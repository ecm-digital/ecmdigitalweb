import { NextRequest, NextResponse } from 'next/server';
import { AIService } from '@/services/aiService';
import { getAgencySettings } from '@/lib/firestoreService';

export async function POST(req: NextRequest) {
    try {
        const { trendingUrls } = await req.json();
        const settings = await getAgencySettings();
        const brandDNA = settings?.aiKnowledge || 'ECM Digital to agencja przyszłości 2026.';

        const systemPrompt = `Jesteś autonomicznym Content Plannerem AI w ECM Digital. 
        Twoja Wiedza o ECM Digital:
        ${brandDNA}

        Twoim zadaniem jest stworzenie strategicznego planu treści na najbliższe 7 dni, bazując na trendach ruchu:
        ${trendingUrls ? trendingUrls.join('\n') : 'Brak danych - zaplanuj ogólny wzrost autorytetu.'}

        Zwróć wynik WYŁĄCZNIE jako JSON w formacie:
        {
          "plan": [
            {
              "day": "Poniedziałek",
              "platform": "LinkedIn",
              "title": "Tytuł/Temat",
              "description": "Dokładny opis dlaczego ten temat dziś i co ma osiągnąć.",
              "angle": "Wizjonerski | Case Study | Edukacyjny",
              "status": "Planowane"
            }
          ],
          "strategicAdvice": "Krótka porada na ten tydzień."
        }`;

        const aiResponse = await AIService.generateContent("Generuj Plan Treści", systemPrompt);

        if (aiResponse.error) {
            return NextResponse.json({ error: aiResponse.error }, { status: 500 });
        }

        const cleanJson = aiResponse.text.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();
        const parsedData = JSON.parse(cleanJson);

        return NextResponse.json(parsedData);

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
