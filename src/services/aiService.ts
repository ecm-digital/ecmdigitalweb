/**
 * AI Service
 * Handles communication with the internal /api/ai route and manages specialized prompts.
 */

export interface AIResponse {
    text: string;
    error?: string;
}

export class AIService {
    private static async callAI(prompt: string, systemPrompt: string, temperature = 0.7): Promise<AIResponse> {
        try {
            const response = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, systemPrompt, temperature }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'AI Request failed');
            }

            return await response.json();
        } catch (error: any) {
            console.error('AIService Error:', error);
            return { text: '', error: error.message };
        }
    }

    /**
     * Extracts intent and data from voice transcription for Kanban/CRM
     */
    static async processVoiceIntent(transcription: string) {
        const systemPrompt = `Analyze the following voice transcription for an agency management system. 
        Extract the INTENT and relevant DATA. 
        Possible intents: "ADD_TASK", "CREATE_OFFER", "ADD_CLIENT", "REMIND_FOLLOWUP".
        Respond ONLY in JSON format like: {"intent": "INTENT", "data": {...}, "confidence": 0.8}`;

        return this.callAI(transcription, systemPrompt, 0.2);
    }

    /**
     * Scores a lead based on their data and message
     */
    static async scoreLead(leadData: any) {
        const systemPrompt = `You are an expert sales qualifier for a digital agency. 
        Analyze the lead data provided. Assign a score from 0-100 (Hot > 70, Warm 40-70, Cold < 40).
        Provide a brief rationale. 
        Respond ONLY in JSON: {"score": 85, "category": "Hot", "rationale": "High budget and clear timeline."}`;

        return this.callAI(JSON.stringify(leadData), systemPrompt, 0.3);
    }

    /**
     * Generates ad copy or social media content
     */
    static async generateContent(goal: string, format: string) {
        const systemPrompt = `Generate professional, high-engaging ad copy for a digital agency.
        Format: ${format}. Goal: ${goal}. 
        Style: Premium, modern, results-driven. Use emojis sparingly.`;

        return this.callAI(`Generate content for: ${goal}`, systemPrompt, 0.8);
    }
}
