import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { question, knowledgeBase, serviceName } = await req.json();

        const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

        if (!API_KEY) {
            return NextResponse.json({ error: 'AI Configuration missing' }, { status: 500 });
        }

        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

        let systemPrompt = `Jesteś Asystentem AI ds. Realizacji Projektów w agencji ECM. 
Twoim zadaniem jest pomaganie pracownikom agencji w realizacji projektów na podstawie wewnętrznej bazy wiedzy.
Odpowiadaj ZAWSZE w oparciu o dostarczoną "Wewnętrzną Instrukcję Realizacji".
Jeżeli pracownik pyta o coś, co nie jest określone w instrukcji, poinformuj go o tym, opierając się na ogólnych najlepszych praktykach branżowych, ale zaznacz, że opierasz się na wiedzy ogólnej.
Bądź konkretny, zwięzły i pomocny. Używaj języka profesjonalnego, formatuj odpowiedzi przy pomocy Markdown (wypunktowania, pogrubienia).`;

        if (serviceName) {
            systemPrompt += `\n\nObecnie pytający realizuje usługę: "${serviceName}".`;
        }
        if (knowledgeBase) {
            systemPrompt += `\n\nOto Wewnętrzna Baza Wiedzy dla tej usługi:\n<baza_wiedzy>\n${knowledgeBase}\n</baza_wiedzy>`;
        } else {
            systemPrompt += `\n\nBrak zdefiniowanej wewnętrznej bazy wiedzy dla tej usługi. Opieraj się w 100% na swojej ogólnej pamięci i standardach branżowych.`;
        }

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: `${systemPrompt}\n\nPytanie od pracownika:\n${question}` }]
                }],
                generationConfig: {
                    temperature: 0.4,
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
        console.error('AI RAG Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
