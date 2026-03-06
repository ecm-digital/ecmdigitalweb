import { AIService } from '../services/aiService';
import { getAgencySettings } from './firestoreService';

export interface PostHogInsight {
    title: string;
    text: string;
    type: 'success' | 'info' | 'warning' | 'error';
    trendingUrls?: string[];
    reasoning?: string;
}

export class PostHogAIService {
    private static async getPostHogKeys() {
        // Look in env first, then localStorage (Admin can set them there)
        const personalKey = process.env.NEXT_PUBLIC_POSTHOG_PERSONAL_API_KEY || localStorage.getItem('POSTHOG_PERSONAL_API_KEY');
        const projectId = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_ID || localStorage.getItem('POSTHOG_PROJECT_ID');
        const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com';

        return { personalKey, projectId, host };
    }

    static async getAnalysis(): Promise<PostHogInsight> {
        try {
            const { personalKey, projectId, host } = await this.getPostHogKeys();

            if (!personalKey || !projectId) {
                return {
                    title: "Konfiguracja PostHog AI",
                    text: "Brak klucza Personal API Key lub Project ID. Dodaj NEXT_PUBLIC_POSTHOG_PERSONAL_API_KEY do środowiska lub ustaw w localStorage Admina, by AI mogło analizować ruch.",
                    type: "warning"
                };
            }

            const apiHost = host.replace('.i.', '.');
            const eventsUrl = `${apiHost}/api/projects/${projectId}/events/?limit=300&event=$pageview`;

            const res = await fetch(eventsUrl, {
                headers: { 'Authorization': `Bearer ${personalKey}` }
            });

            if (!res.ok) {
                if (res.status === 401 || res.status === 403) {
                    throw new Error("Błąd autoryzacji PostHog. Sprawdź Personal API Key.");
                }
                throw new Error(`Błąd PostHog API: ${res.statusText}`);
            }

            const data = await res.json();
            const urlCounts: Record<string, number> = {};

            if (data.results) {
                data.results.forEach((e: any) => {
                    const url = e.properties?.$current_url;
                    if (url) {
                        urlCounts[url] = (urlCounts[url] || 0) + 1;
                    }
                });
            }

            const sortedUrls = Object.entries(urlCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10)
                .map(([url, count]) => `- ${url}: ${count} wyświetleń`);

            if (sortedUrls.length === 0) {
                return {
                    title: "Zbieranie danych",
                    text: "System PostHog jest aktywny, ale nie zarejestrowaliśmy jeszcze wystarczającej ilości zdarzeń $pageview do analizy AI. Odśwież za kilka godzin.",
                    type: "info"
                };
            }

            const settings = await getAgencySettings();
            const brandKnowledge = settings?.aiKnowledge || 'ECM Digital to nowoczesna agencja AI i automatyzacji.';

            const systemPrompt = `Jesteś starszym analitykiem biznesowym AI w agencji ECM Digital. 
            Twoja wiedza o firmie (DNA marki):
            ${brandKnowledge}

            Przeanalizuj poniższy ruch na stronie i podaj merytoryczny wniosek.
            Odpowiedz w ściśle określonym formacie:
            [INSIGHT]: (krótki, max 2 zdania wniosek strategiczny dla szefa)
            [REASONING]: (wyjaśnienie Twojego toku myślenia, dlaczego to rekomendujesz, na jakich danych się opierasz - max 3 zdania)

            Styl: Profesjonalny, konkretny, bez lania wody. Agencja Przyszłości 2026.
            Dane z PostHog:\n${sortedUrls.join('\n')}`;

            const aiResponse = await AIService.generateContent("Wygeneruj raport ruchu", systemPrompt);

            if (aiResponse.error) {
                throw new Error(aiResponse.error);
            }

            const fullText = aiResponse.text.replace(/\*\*/g, "");
            let insightText = fullText;
            let reasoningText = "Analiza oparta na wolumenie ruchu i trendach URL.";

            if (fullText.includes('[INSIGHT]:') && fullText.includes('[REASONING]:')) {
                const parts = fullText.split('[REASONING]:');
                insightText = parts[0].replace('[INSIGHT]:', '').trim();
                reasoningText = parts[1].trim();
            } else if (fullText.includes('[REASONING]:')) {
                const parts = fullText.split('[REASONING]:');
                insightText = parts[0].trim();
                reasoningText = parts[1].trim();
            }

            return {
                title: "Insights z PostHog (AI)",
                text: insightText,
                reasoning: reasoningText,
                type: "success",
                trendingUrls: sortedUrls
            };

        } catch (error: any) {
            console.error("PostHogAIService Error:", error);
            return {
                title: "Błąd analizy AI",
                text: error.message || "Wystąpił nieoczekiwany problem przy pobieraniu danych z PostHog.",
                type: "error"
            };
        }
    }
}
