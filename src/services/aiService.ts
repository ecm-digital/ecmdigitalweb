import { GoogleGenerativeAI } from '@google/generative-ai';

export interface AIResponse {
    text: string;
    error?: string;
}

export class AIService {
    private static async getApiKey(): Promise<string | null> {
        const winKey = (window as any).NEXT_PUBLIC_GEMINI_API_KEY;
        const envKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        const localKey = localStorage.getItem('GEMINI_API_KEY');
        return [winKey, envKey, localKey].find(k => k && k !== 'undefined' && k !== '') || null;
    }

    private static async callAI(prompt: string, systemPrompt: string, temperature = 0.7): Promise<AIResponse> {
        try {
            const apiKey = await this.getApiKey();
            if (!apiKey) {
                throw new Error('AI Configuration missing (Missing API Key)');
            }

            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({
                model: "gemini-2.5-flash",
                generationConfig: { temperature }
            });

            const result = await model.generateContent(`${systemPrompt}\n\nUser: ${prompt}`);
            const response = await result.response;
            let text = response.text();

            // Clean JSON if needed (remove markdown blocks)
            if (text.includes('```json')) {
                text = text.split('```json')[1].split('```')[0].trim();
            } else if (text.includes('```')) {
                text = text.split('```')[1].split('```')[0].trim();
            }

            return { text: text.trim() };
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

    /**
     * Generates improvements and ideas for a specific service
     */
    static async developService(serviceName: string, description: string, currentFeatures: string[]) {
        const systemPrompt = `You are an expert product strategist and AI innovation consultant for a premium digital agency.
        Analyze the service provided and generate:
        1. 3 disruptive improvement ideas for 2026.
        2. 3 new high-value features.
        3. Strategic advice on pricing or delivery.
        
        Keep the tone professional, bold, and visionary. Use bullet points.
        Format your response in Markdown.`;

        const prompt = `Service: ${serviceName}
        Current Description: ${description}
        Current Features: ${currentFeatures.join(', ')}`;

        return this.callAI(prompt, systemPrompt, 0.8);
    }
}
