import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export async function POST(req: Request) {
    try {
        const phKey = process.env.POSTHOG_PERSONAL_API_KEY;
        const phHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com';

        if (!phKey) {
            return NextResponse.json({
                title: "PostHog AI Gotowy",
                text: "PostHog Personal API Key (zmienna: POSTHOG_PERSONAL_API_KEY) nie został jeszcze zaprogramowany w .env.local. Wygeneruj klucz w panelu u201cPersonal API keysu201d PostHog i dodaj do projektu, by model mógu0142 automatycznie czytać trendy zachowań.",
                type: "warning"
            });
        }

        const fetchOpts = { headers: { 'Authorization': `Bearer ${phKey}` } };

        // 1. Get project ID
        const host = phHost.replace('.i.', '.'); // Convert tracking host to API host
        const projRes = await fetch(`${host}/api/projects/`, fetchOpts);

        if (!projRes.ok) {
            throw new Error(`Connection error with PostHog projects: ${projRes.statusText}`);
        }

        const projData = await projRes.json();
        if (!projData.results || projData.results.length === 0) {
            throw new Error("No projects found under this Personal token.");
        }

        const projectId = projData.results[0].id;

        // 2. Fetch Top Pageviews last period
        const eventsRes = await fetch(`${host}/api/projects/${projectId}/events/?limit=500&event=$pageview`, fetchOpts);

        if (!eventsRes.ok) {
            throw new Error(`Connection error with PostHog events: ${eventsRes.statusText}`);
        }

        const eventsData = await eventsRes.json();

        const urlCounts: Record<string, number> = {};

        if (eventsData.results) {
            eventsData.results.forEach((e: any) => {
                const url = e.properties?.$current_url;
                if (url) {
                    urlCounts[url] = (urlCounts[url] || 0) + 1;
                }
            });
        }

        const sortedUrls = Object.entries(urlCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([url, count]) => `- ${url}: ${count} wyświetleń w ostatniej próbce badanej.`);

        if (sortedUrls.length === 0) {
            return NextResponse.json({
                title: "Zbieranie danych",
                text: "Skrypt i integracja PostHog z Gemini działają! Aktualnie analizujemy nowe logowania. Z tego powodu, że integracja jest bardzo świeża, odczekaj na pierwsze merytoryczne insajty kilka godzin. Aplikacja gromadzi dane użytkowników.",
                type: "info"
            });
        }

        const prompt = `
Jesteś starszym analitykiem biznesowym AI i Growth Hackerem w cyfrowej agencji 'ECM Digital'.
Poniżej znajdują się aktualne, ustrukturyzowane w locie przez system API prawdziwe dane bezpośrednio z narzędzia PostHog zebrane ze strony agencyjnej klienta w ostatnich momentach:

${sortedUrls.join('\n')}

Wygeneruj BARDZO OSTRY, KRÓTKI (max 2 zdania), merytoryczny komunikat ("insight") marketingowy. Opisz z punktu widzenia optymalizacji sprzedaży lub konwersji, jaki wniosek można wyciągnąć ze zdobytego ruchu, bazując na powyższych najpopularniejszych adresach. Pisz do szefa firmy jako inteligentny agent analityczny. Język polski, mocno profesjonalny.

Wyrzuć ewentualne formatowanie / markdown, tylko czysty tekst.`;

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(prompt);
        const textArea = result.response.text();

        return NextResponse.json({
            title: "Insights z PostHog (AI)",
            text: textArea.trim().replace(/\*\*/g, ""),
            type: "success"
        });

    } catch (error: any) {
        console.error("PostHog AI API Error:", error);
        return NextResponse.json({
            title: "Błąd modelu analitycznego",
            text: `Komunikacja przerwana. Błąd pobierania danych lub zła zmienna dla modelu: ${error.message || 'Błąd Serwera'}`,
            type: "error"
        });
    }
}
