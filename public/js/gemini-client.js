/**
 * Google Gemini API Client
 * ECM Digital - Integracja z Google Gemini API
 */

class GeminiClient {
    constructor(config = {}) {
        this.apiKey = config.apiKey || localStorage.getItem('GEMINI_API_KEY') || '';
        this.model = config.model || 'gemini-flash-latest';
        this.apiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent`;
        this.streamingEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:streamGenerateContent`;
        this.enableLogging = config.enableLogging !== false;

        if (!this.apiKey) {
            console.warn('⚠️ Gemini API key not found. Please set GEMINI_API_KEY in localStorage or config.');
        }
    }

    /**
     * Generate content using Gemini API
     * @param {string} systemPrompt - System prompt/instructions
     * @param {string} userMessage - User message
     * @param {Object} options - Additional options
     * @returns {Promise<string>} Generated response
     */
    async generateContent(systemPrompt, userMessage, options = {}) {
        if (!this.apiKey) {
            throw new Error('Gemini API key is required. Please set GEMINI_API_KEY.');
        }

        try {
            // Combine system prompt and user message
            const fullPrompt = `${systemPrompt}\n\nUżytkownik: ${userMessage}\n\nAsystent:`;

            const requestBody = {
                contents: [{
                    parts: [{
                        text: fullPrompt
                    }]
                }],
                generationConfig: {
                    temperature: options.temperature || 0.7,
                    topK: options.topK || 40,
                    topP: options.topP || 0.95,
                    maxOutputTokens: options.maxOutputTokens || 2048,
                    stopSequences: options.stopSequences || []
                },
                safetySettings: [
                    {
                        category: "HARM_CATEGORY_HARASSMENT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_HATE_SPEECH",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    }
                ]
            };

            if (this.enableLogging) {
                console.log('🚀 Calling Google Gemini API...');
                console.log('Model:', this.model);
                console.log('Prompt length:', fullPrompt.length);
            }

            const response = await fetch(`${this.apiEndpoint}?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`Gemini API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
            }

            const data = await response.json();

            if (this.enableLogging) {
                console.log('✅ Gemini API response received');
            }

            // Extract text from response
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                const text = data.candidates[0].content.parts[0].text;

                // Check for safety ratings
                if (data.candidates[0].safetyRatings) {
                    const blocked = data.candidates[0].safetyRatings.some(
                        rating => rating.probability === 'HIGH' || rating.probability === 'MEDIUM'
                    );
                    if (blocked) {
                        console.warn('⚠️ Response blocked by safety filters');
                        return 'Przepraszam, nie mogę odpowiedzieć na to pytanie z powodu ograniczeń bezpieczeństwa. Czy mogę pomóc w czymś innym?';
                    }
                }

                return text.trim();
            } else {
                throw new Error('Invalid response format from Gemini API');
            }

        } catch (error) {
            console.error('❌ Gemini API call failed:', error);
            throw error;
        }
    }

    /**
     * Stream content generation (for real-time responses)
     * @param {string} systemPrompt - System prompt/instructions
     * @param {string} userMessage - User message
     * @param {Function} onChunk - Callback for each chunk
     * @param {Object} options - Additional options
     * @returns {Promise<string>} Full generated response
     */
    async streamGenerateContent(systemPrompt, userMessage, onChunk, options = {}) {
        if (!this.apiKey) {
            throw new Error('Gemini API key is required. Please set GEMINI_API_KEY.');
        }

        try {
            const fullPrompt = `${systemPrompt}\n\nUżytkownik: ${userMessage}\n\nAsystent:`;

            const requestBody = {
                contents: [{
                    parts: [{
                        text: fullPrompt
                    }]
                }],
                generationConfig: {
                    temperature: options.temperature || 0.7,
                    topK: options.topK || 40,
                    topP: options.topP || 0.95,
                    maxOutputTokens: options.maxOutputTokens || 2048,
                }
            };

            const response = await fetch(`${this.streamingEndpoint}?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullText = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));
                            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                                const text = data.candidates[0].content.parts[0].text;
                                if (text) {
                                    fullText += text;
                                    if (onChunk) {
                                        onChunk(text);
                                    }
                                }
                            }
                        } catch (e) {
                            // Skip invalid JSON
                        }
                    }
                }
            }

            return fullText.trim();

        } catch (error) {
            console.error('❌ Gemini streaming failed:', error);
            throw error;
        }
    }

    /**
     * Set API key
     * @param {string} apiKey - Google Gemini API key
     */
    setApiKey(apiKey) {
        this.apiKey = apiKey;
        localStorage.setItem('GEMINI_API_KEY', apiKey);
        if (this.enableLogging) {
            console.log('✅ Gemini API key set');
        }
    }

    /**
     * Get available models
     * @returns {Array} List of available models
     */
    getAvailableModels() {
        return [
            { id: 'gemini-pro', name: 'Gemini Pro', description: 'Best for text generation' },
            { id: 'gemini-pro-vision', name: 'Gemini Pro Vision', description: 'Supports images and text' },
            { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', description: 'Latest model with improved performance' },
            { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', description: 'Faster, optimized for speed' }
        ];
    }

    /**
     * Change model
     * @param {string} modelId - Model ID to use
     */
    setModel(modelId) {
        this.model = modelId;
        this.apiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent`;
        this.streamingEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:streamGenerateContent`;
        if (this.enableLogging) {
            console.log('✅ Model changed to:', modelId);
        }
    }
}

// Global instance
window.GeminiClient = GeminiClient;

// Create default instance if API key is available
if (typeof window !== 'undefined') {
    const apiKey = window.NEXT_PUBLIC_GEMINI_API_KEY || localStorage.getItem('GEMINI_API_KEY');
    if (apiKey) {
        window.geminiClient = new GeminiClient({ apiKey });
        console.log('✅ Gemini client initialized');
    }
}




