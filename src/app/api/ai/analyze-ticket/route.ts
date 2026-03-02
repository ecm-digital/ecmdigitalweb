import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { subject, message, clientName } = await req.json();

        const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
        if (!API_KEY) {
            return NextResponse.json({ error: 'AI Configuration missing' }, { status: 500 });
        }

        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

        const systemPrompt = `Jesteś analitykiem wsparcia technicznego w agencji ECM Digital.
Otrzymałeś nowe zgłoszenie od klienta: ${clientName}.
Temat: ${subject}
Wiadomość: ${message}

Przeanalizuj to zgłoszenie i podaj adminowi:
1. Krótkie podsumowanie problemu (1 zdanie).
2. Sugerowaną kategorię błędu (np. Frontend, Backend, Email, Content).
3. Potencjalne rozwiązanie lub pierwszy krok do sprawdzenia.
4. Stopień irytacji klienta na skali 1-10.

Odpowiedz w formie krótkiego, profesjonalnego raportu (max 4 zdania). Używaj emoji.`;

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: systemPrompt }]
                }],
                generationConfig: {
                    temperature: 0.3,
                    maxOutputTokens: 500,
                }
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json({ error: data.error?.message || 'Gemini API Error' }, { status: response.status });
        }

        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        return NextResponse.json({ analysis: aiText });

    } catch (error) {
        console.error('AI Analysis Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
