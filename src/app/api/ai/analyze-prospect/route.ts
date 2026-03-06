import { NextRequest, NextResponse } from 'next/server';
import { AIService } from '@/services/aiService';
import { getAgencySettings } from '@/lib/firestoreService';

async function scrapeUrl(url: string): Promise<string> {
  try {
    const targetUrl = url.startsWith('http') ? url : `https://${url}`;
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      next: { revalidate: 3600 }
    });

    if (!response.ok) return '';
    const html = await response.text();

    // Basic extraction of title, meta description and body text
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    const metaDescMatch = html.match(/<meta name="description" content="(.*?)"/i);

    // Remove script and style tags
    const cleanBody = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 5000); // Limit context for AI

    return `Title: ${titleMatch?.[1] || ''}\nDescription: ${metaDescMatch?.[1] || ''}\nContent: ${cleanBody}`;
  } catch (e) {
    console.error('Scraping Error:', e);
    return '';
  }
}

export async function POST(req: NextRequest) {
  try {
    const { prospectInput } = await req.json();
    const settings = await getAgencySettings();
    const brandDNA = settings?.aiKnowledge || 'ECM Digital to nowoczesna agencja AI i automatyzacji.';

    let scrapedContent = '';
    const isUrl = prospectInput.includes('.') && !prospectInput.includes(' ');

    if (isUrl) {
      scrapedContent = await scrapeUrl(prospectInput);
    }

    const systemPrompt = `Jesteś elitarnym analitykiem biznesowym i strategiem sprzedaży w ECM Digital.
        Twoja Wiedza o ECM Digital (DNA Marki):
        ${brandDNA}

        Twoim zadaniem jest stworzenie "Battle Card" dla potencjalnego klienta.
        
        DANE WEJŚCIOWE:
        "${prospectInput}"
        
        ${scrapedContent ? `TREŚĆ ZESKRAPOWANA ZE STRONY KLIENTA:
        "${scrapedContent}"` : ''}

        Twoja analiza musi być rygorystyczna, oparta na faktach ze strony (jeśli dostępne) i kreatywna. 
        Zwróć wynik WYŁĄCZNIE jako JSON w formacie:
        {
          "companyName": "Nazwa firmy",
          "painPoints": [
            {"title": "Problem 1", "desc": "Szczegółowy opis dlaczego to ich boli, nawiązujący do ich konkretnej branży/strony."}
          ],
          "offerPitch": {
            "title": "Unikalna Propozycja Wartości",
            "desc": "Konkretny pitch sprzedażowy łączący ich potrzeby (np. to co mają na stronie) z usługami ECM Digital."
          },
          "videoScript": {
            "hook": "Mocne otwarcie wideo (5 sekund) - nawiąż do czegoś konkretnego co robią",
            "body": "Główna część skryptu prezentująca rozwiązanie ich konkretnego problemu",
            "cta": "Wezwanie do działania"
          },
          "agentReasoning": "Opisz jak zeskrapowane dane wpłynęły na Twoją strategię."
        }`;

    const aiResponse = await AIService.generateContent("Generuj DEEP Battle Card", systemPrompt);

    if (aiResponse.error) {
      return NextResponse.json({ error: aiResponse.error }, { status: 500 });
    }

    const cleanJson = aiResponse.text.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();
    const parsedData = JSON.parse(cleanJson);

    return NextResponse.json(parsedData);

  } catch (error: any) {
    console.error('Prospect Intelligence Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
