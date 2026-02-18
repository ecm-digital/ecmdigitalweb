import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { prompt, systemPrompt, temperature = 0.7 } = await req.json();

        // In a real production environment, you would use process.env.GEMINI_API_KEY
        // For this environment, we'll try to get it from a safe place or fallback
        const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

        if (!API_KEY) {
            return NextResponse.json({ error: 'AI Configuration missing' }, { status: 500 });
        }

        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: `${systemPrompt}\n\nUser: ${prompt}` }]
                }],
                generationConfig: {
                    temperature,
                    maxOutputTokens: 2048,
                }
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json({ error: data.error?.message || 'Gemini API Error' }, { status: response.status });
        }

        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        return NextResponse.json({ text });

    } catch (error) {
        console.error('AI Route Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
