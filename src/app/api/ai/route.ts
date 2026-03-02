import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { prompt, audio, systemPrompt, temperature = 0.7 } = await req.json();

        // Use server-side ONLY environment variable, with public fallback if needed
        const API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

        if (!API_KEY) {
            console.error('❌ Missing GEMINI_API_KEY or NEXT_PUBLIC_GEMINI_API_KEY in environment variables');
            return NextResponse.json({ error: 'AI Configuration missing' }, { status: 500 });
        }

        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

        // Prepare contents
        const contents: any[] = [
            {
                role: 'user',
                parts: [{ text: systemPrompt }]
            },
            {
                role: 'model',
                parts: [{ text: "Zrozumiałem. Będę działać jako oficjalny asystent ECM Digital." }]
            }
        ];

        // Add user input (text or audio)
        const userParts: any[] = [];
        if (prompt) userParts.push({ text: prompt });
        if (audio) {
            userParts.push({
                inline_data: {
                    mime_type: "audio/webm",
                    data: audio
                }
            });
        }

        if (userParts.length > 0) {
            contents.push({
                role: 'user',
                parts: userParts
            });
        }

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents,
                generationConfig: {
                    temperature,
                    maxOutputTokens: 2048,
                }
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('❌ Gemini API Error:', {
                status: response.status,
                statusText: response.statusText,
                error: data.error
            });
            return NextResponse.json({
                error: data.error?.message || 'Gemini API Error',
                details: data.error
            }, { status: response.status });
        }

        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        return NextResponse.json({ text });

    } catch (error) {
        console.error('AI Route Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
