import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, query, where, orderBy } from 'firebase/firestore';
import { getAgencyServices } from '@/lib/firestoreService';

export async function POST(req: Request) {
    try {
        const { clientRequest, companyName, clientId } = await req.json();

        const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
        if (!API_KEY) {
            return NextResponse.json({ error: 'AI Configuration missing' }, { status: 500 });
        }

        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

        // ═══ 1. Load Context OS ═══
        let contextOSBlock = '';
        try {
            const ctxDoc = await getDoc(doc(db, 'context_os', 'main'));
            if (ctxDoc.exists()) {
                const ctx = ctxDoc.data();
                if (ctx.toneOfVoice) contextOSBlock += `[TONE OF VOICE firmy]: ${ctx.toneOfVoice}\n`;
                if (ctx.businessGoals) contextOSBlock += `[CELE BIZNESOWE]: ${ctx.businessGoals}\n`;
                if (ctx.sops) contextOSBlock += `[PROCEDURY SPRZEDAŻOWE]: ${ctx.sops}\n`;
                if (ctx.customInstructions) contextOSBlock += `[INSTRUKCJE DODATKOWE]: ${ctx.customInstructions}\n`;
            }
        } catch (e) {
            console.error('Context OS load failed:', e);
        }

        // ═══ 2. Fetch Agency Services (cennik) ═══
        let servicesContext = 'Domyślne usługi agencji: strony internetowe, aplikacje, UI/UX, AI chatboty, automatyzacja.';
        try {
            const services = await getAgencyServices();
            if (services.length > 0) {
                servicesContext = services.map(s => `- ${s.translations.pl.title}: ${s.price}`).join('\n');
            }
        } catch (e) {
            console.error('Failed to get services:', e);
        }

        // ═══ 3. Fetch Client CRM History ═══
        let clientContext = '';
        if (clientId) {
            try {
                // Get client details
                const clientDoc = await getDoc(doc(db, 'clients', clientId));
                if (clientDoc.exists()) {
                    const c = clientDoc.data();
                    clientContext += `[DANE KLIENTA Z CRM]:\n`;
                    clientContext += `Firma: ${c.company || 'brak'}\n`;
                    clientContext += `Status: ${c.status || 'brak'}\n`;
                    clientContext += `Wartość klienta: ${c.value?.toLocaleString('pl-PL') || 0} PLN\n`;
                    clientContext += `Branża: ${c.industry || 'brak'}\n`;
                    clientContext += `Notatki: ${c.notes || 'brak'}\n`;
                    clientContext += `Źródło: ${c.source || 'brak'}\n`;
                }

                // Get past offers for this client
                try {
                    const offersSnap = await getDocs(
                        query(collection(db, 'offers'), where('clientId', '==', clientId))
                    );
                    if (!offersSnap.empty) {
                        const pastOffers = offersSnap.docs.map(d => d.data());
                        clientContext += `\n[HISTORIA OFERT DLA TEGO KLIENTA]:\n`;
                        pastOffers.forEach(o => {
                            clientContext += `- "${o.title}" | Status: ${o.status} | Kwota: ${o.totalPrice?.toLocaleString('pl-PL')} PLN\n`;
                        });
                        const avgPrice = pastOffers.reduce((s, o) => s + (o.totalPrice || 0), 0) / pastOffers.length;
                        clientContext += `Średnia wartość oferty: ${avgPrice.toLocaleString('pl-PL')} PLN\n`;
                    }
                } catch (e) { /* skip */ }
            } catch (e) {
                console.error('Client context load failed:', e);
            }
        }

        // ═══ 4. Build Intelligent Prompt ═══
        const systemPrompt = `Jesteś "Offer Intelligence OS" - zaawansowanym systemem generowania ofert dla agencji ECM Digital.
Tworzysz PROFESJONALNE, STRATEGICZNE wyceny, które nie tylko kalkulują koszty, ale budują wartość i relację z klientem.

${contextOSBlock ? `═══ CONTEXT OS (wiedza o firmie) ═══\n${contextOSBlock}═══ KONIEC CONTEXT OS ═══\n` : ''}

[CENNIK USŁUG AGENCJI]:
${servicesContext}

${clientContext ? `${clientContext}` : ''}

[BRIEFING OD ACCOUNT MANAGERA - WYMAGANIA KLIENTA "${companyName}"]:
${clientRequest}

TWOJE ZADANIE:
Wygeneruj ofertę w formacie JSON (BEZ markdown, BEZ backticks, TYLKO czysty JSON):

{
  "title": "Profesjonalny i chwytliwy tytuł oferty (max 80 znaków)",
  "items": [
    {
      "service": "Nazwa etapu/usługi (max 50 znaków)",
      "description": "Co dokładnie robimy w tym etapie (1-2 zdania)",
      "price": 3000
    }
  ],
  "notes": "Spersonalizowany list motywacyjny (3-4 zdania). Odnieś się do branży klienta, jego potrzeb. Użyj Tone of Voice z Context OS. Zakończ call-to-action.",
  "strategy": "Wewnętrzna notatka dla Account Managera: dlaczego taka cena, jakie ryzyka, sugestia upsell (2-3 zdania)"
}

ZASADY WYCENY:
1. Od 3 do 6 etapów oferowych (nie za mało, nie za dużo)
2. Ceny REALISTYCZNE (oparte na cenniku agencji). Nie zaniżaj i nie zawyżaj.
3. Jeśli klient ma historię ofert – dostosuj ceny do jego poziomu (nie dawaj drożej niż dotychczasowe oferty bez uzasadnienia).
4. Uwzględnij cele biznesowe z Context OS – jeśli firma celuje w upsell, zasugeruj premium elementy.
5. Notatka motywacyjna musi być w Tone of Voice firmy z Context OS.
6. Pole "strategy" to WEWNĘTRZNE wskazówki dla managera – nie trafia do klienta.
7. Zwróć TYLKO poprawny JSON. Nic więcej.`;

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: systemPrompt }] }],
                generationConfig: {
                    temperature: 0.35,
                    maxOutputTokens: 2048,
                }
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json({ error: data.error?.message || 'Gemini API Error' }, { status: response.status });
        }

        let aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        aiText = aiText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        const parsedJson = JSON.parse(aiText);
        return NextResponse.json(parsedJson);

    } catch (error) {
        console.error('Offer Intelligence OS Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
