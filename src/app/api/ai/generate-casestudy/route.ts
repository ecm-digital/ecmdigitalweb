import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { projectName, clientReview, rating } = await req.json();

        const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
        if (!API_KEY) {
            return NextResponse.json({ error: 'AI Configuration missing' }, { status: 500 });
        }

        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

        const systemPrompt = `Jesteś "Social Proof Machine" – AI budującym na bazie suchych informacji z projektu i opinii klienta niesamowite, sprzedażowe "Case Studies" do portfolio agencji interaktywnej ECM Digital.

Cel: Otrzymaliśmy w panelu właśnie zatwierdzony projekt o tytule "${projectName}".
Klient po zatwierdzeniu zostawił nam taką opinię i dowód wdzięczności:
"${clientReview}"
Jego ocena projektu w gwiazdkach: ${rating}/5.

Wygeneruj robocze, ale świetnie napisane portfolio Case Study w formacie czystego JSON (bez znaczników markdown \`\`\`json).
Struktura musi DOKŁADNIE odpowiadać temu schematowi:
{
    "slug": "krotki-unikalny-slug-np-budowa-sklepu-xyz",
    "color": "from-purple-500 to-pink-500",
    "year": "2026",
    "duration": "4 tygodnie",
    "featured": false,
    "translations": {
        "pl": {
            "category": "E-commerce / Web Development",
            "title": "Budowa wymyśl projekt na bazie tytułu: ${projectName}",
            "client": "Kluczowy Klient B2B",
            "industry": "Nowoczesne Technologie",
            "description": "Obszerny, piękny opis (ok 3 zdania) tego jak pomogliśmy klientowi z jego projektem ${projectName}.",
            "challenge": "Wyzwanie biznesowe klienta, wywnioskuj je.",
            "solution": "Jakie technologie wdrożyliśmy (np. Next.js, Firebase, AI).",
            "results": "Wspaniałe rezultaty...",
            "resultsStats": [
                { "label": "Satysfakcja", "value": "${rating}/5" },
                { "label": "Czas realizacji", "value": "-30%" }
            ],
            "technologies": ["React", "AI", "Tailwind CSS"],
            "testimonial": {
                "quote": "${clientReview}",
                "author": "Zadowolony Klient",
                "role": "Właściciel Projektu"
            }
        },
        "en": {
            "category": "E-commerce / Web Development",
            "title": "Building project based on: ${projectName}",
            "description": "English translation of the description",
            "challenge": "Business challenge translation",
            "solution": "Solution translation",
            "results": "Results translation",
            "technologies": ["React", "AI", "Tailwind CSS"],
            "testimonial": {
                "quote": "Translated quote (or leave original if better)",
                "author": "Happy Client",
                "role": "Project Owner"
            }
        }
    }
}
Tylko i wyłącznie obiekt JSON z prawidłowymi cudzysłowami.`;

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: systemPrompt }]
                }],
                generationConfig: {
                    temperature: 0.5,
                    maxOutputTokens: 2048,
                }
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json({ error: data.error?.message || 'Gemini API Error' }, { status: response.status });
        }

        let aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

        // Clean up markdown block if the model included it despite our prompt
        aiText = aiText.replace(/```json/g, '').replace(/```/g, '').trim();

        const parsedJson = JSON.parse(aiText);

        return NextResponse.json(parsedJson);

    } catch (error) {
        console.error('AI Case Study Generator Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
