import { NextRequest, NextResponse } from 'next/server';
import { AIService } from '@/services/aiService';
import { getAgencySettings } from '@/lib/firestoreService';

export async function POST(req: NextRequest) {
    try {
        const { prospectData, lastMessage } = await req.json();
        const settings = await getAgencySettings();
        const brandDNA = settings?.aiKnowledge || 'ECM Digital to agencja przyszłości 2026.';

        const systemPrompt = `Jesteś Smart Booking Assistantem w ECM Digital.
        Twoja Wiedza o ECM Digital:
        ${brandDNA}

        Twoim zadaniem jest wygenerowanie profesjonalnej, spersonalizowanej odpowiedzi na wiadomość od klienta.
        DANE O PROSPEKCIE:
        - Nazwa: ${prospectData.companyName}
        - Pain Points: ${JSON.stringify(prospectData.painPoints)}
        - Nasz Pitch: ${prospectData.pitch.title}

        OSTATNIA WIADOMOŚĆ OD KLIENTA:
        "${lastMessage}"

        Zasady odpowiedzi:
        1. Bądź pomocny, profesjonalny i konkretny.
        2. Nawiąż do ich problemów (pain points).
        3. Zaproponuj spotkanie (demo) i poproś o pasujący termin.
        4. Jeśli klient o coś pyta, odpowiedz w oparciu o DNA ECM Digital.

        Zwróć wynik WYŁĄCZNIE jako JSON:
        {
          "reply": "Treść odpowiedzi...",
          "strategicNote": "Krótka notatka dlaczego tak odpowiedziałeś."
        }`;

        const aiResponse = await AIService.generateContent("Generuj Odpowiedź Booking", systemPrompt);

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
