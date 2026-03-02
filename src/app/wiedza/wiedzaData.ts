import { Lang } from '../../translations';

export interface KnowledgeItem {
    slug: string;
    icon: string;
    gradient: string;
    translations: Record<string, {
        title: string;
        shortDesc: string;
        content: string;
    }>;
}

export const knowledgeItems: KnowledgeItem[] = [
    {
        slug: 'ai-agents',
        icon: '🤖',
        gradient: 'linear-gradient(135deg, #e94560 0%, #ff6b81 100%)',
        translations: {
            pl: {
                title: 'Agent AI (AI Agent)',
                shortDesc: 'Autonomiczny system zdolny do podejmowania decyzji i wykonywania zadań bez ciągłego nadzoru człowieka.',
                content: `## Czym jest Agent AI?
Agent AI (Sztucznej Inteligencji) to zaawansowany system komputerowy zaprojektowany do obserwacji swojego środowiska, podejmowania decyzji i wykonywania działań w celu osiągnięcia określonych celów. 

W przeciwieństwie do tradycyjnych programów opartych na sztywnych regułach "jeśli-to", Agenci AI wykorzystują modele językowe (takie jak oparte na architekturze Transformer, np. GPT-4) jako swój centralny mechanizm wnioskowania.

### Główne powody dlaczego Agenci AI to przyszłość:
1. **Autonomia:** Agenci potrafią samodzielnie rozbić duży cel na mniejsze kroki (tzw. task breakdown).
2. **Korzystanie z narzędzi (Tool Use):** Mogą używać API, wyszukiwarek internetowych, kalkulatorów czy systemów CRM by realizować zadania.
3. **Pamięć (Memory):** Zapamiętują wcześniejsze interakcje z użytkownikami, co pozwala na płynne prowadzenie procesów wsparcia.

### Zastosowanie w biznesie:
- **Obsługa Klienta:** Agenci rozwiązujący do 80% powtarzalnych zgłoszeń (Customer Support Agents).
- **Zautomatyzowana Sprzedaż:** Kwalifikacja leadów i rezerwacja spotkań w kalendarzach handlowców (SDR Agents).
- **Analityka Danych:** Agenci AI w kilka sekund analizujący ogromne arkusze kalkulacyjne Excel.`
            },
            en: {
                title: 'AI Agent',
                shortDesc: 'An autonomous system capable of making decisions and executing tasks without constant human oversight.',
                content: `## What is an AI Agent?
An AI (Artificial Intelligence) Agent is an advanced computer system designed to observe its environment, make decisions, and take actions to achieve specific goals.

Unlike traditional programs based on rigid "if-then" rules, AI Agents use language models (like GPT-4) as their central reasoning mechanism.

### Use cases in business:
- **Customer Support:** Resolving up to 80% of repetitive tickets.
- **Automated Sales:** Lead qualification and meeting booking (SDR Agents).
- **Data Analytics:** Analyzing massive spreadsheets in seconds.`
            }
        }
    },
    {
        slug: 'rag-retrieval-augmented-generation',
        icon: '📚',
        gradient: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
        translations: {
            pl: {
                title: 'RAG (Retrieval-Augmented Generation)',
                shortDesc: 'Zaawansowana technika łącząca Generatywną Sztuczną Inteligencję z bazą wiedzy Twojej firmy.',
                content: `## Czym jest RAG?
RAG (Retrieval-Augmented Generation) to architektura sztucznej inteligencji, która poprawia precyzję i wiarygodność odpowiedzi modeli LLM poprzez zapewnienie im dostępu do zewnętrznych, rzetelnych źródeł wiedzy przed wygenerowaniem odpowiedzi.

Tradycyjny model AI (jak ChatGPT) odpowiada tylko z danych, na jakich został wytrenowany (tzw. parametric memory). To może prowadzić do zjawiska halucynacji.

### Jak proces wpływa działa RAG:
1. **Pytanie (Retrieval):** Użytkownik zadaje pytanie np. "Jakie są nasze warunki zwrotów?". System najpierw przeszukuje wektorową bazę dokumentów firmy (PDF, Notion, Intranet).
2. **Rozszerzenie (Augmented):** Wyciągnięte najtrafniejsze fragmenty tekstu są "doklejane" do oryginalnego pytania.
3. **Generacja (Generation):** Model AI, patrząc na fragmenty Twoich procedur, formułuje ostateczną, w 100% trafną odpowiedź.

Wykorzystanie RAG jest koniecznością każdej prawdziwej implementacji AI w dużej firmie.`
            },
            en: {
                title: 'RAG (Retrieval-Augmented Generation)',
                shortDesc: 'An AI framework that combines Large Language Models with your company’s internal knowledge base.',
                content: `## What is RAG?
Retrieval-Augmented Generation (RAG) improves the precision and reliability of LLM responses by providing them access to external authoritative sources.

### How it works:
1. **Retrieval:** The system searches a vector database of your company’s documents.
2. **Augmented:** The retrieved information is appended to the user prompt.
3. **Generation:** The AI formulates an accurate answer based exclusively on the provided context.`
            }
        }
    },
    {
        slug: 'llm-large-language-model',
        icon: '🧠',
        gradient: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
        translations: {
            pl: {
                title: 'LLM (Duży Model Językowy)',
                shortDesc: 'Rozbudowany algorytm AI, który potrafi czytać, streszczać, rozumieć i generować ludzki język.',
                content: `## Co to jest LLM?
LLM (Large Language Model) to rodzaj modelu sztucznej inteligencji opartego na uczeniu maszynowym, który poprzez analizę ogromnych ilości danych tekstowych (często obejmujących znaczną część Internetu) zyskuje zdolność do rozumienia języka naturalnego i udzielania odpowiedzi na poziomie zbliżonym do ludzkiego.

### Przykłady popularnych modeli LLM:
- **Seria GPT** (Twórcy: OpenAI) - np. GPT-4, GPT-4o.
- **Seria Claude** (Twórcy: Anthropic) - np. Claude 3.5 Sonnet (wyróżniający się w kodowaniu).
- **Seria Gemini** (Twórcy: Google) - np. Gemini 1.5 Pro (znany z ogromnego okna kontekstowego).
- **Llama 3** (Twórcy: Meta) - wiodące modele open-source uruchamiane lokalnie.

Rozumienie różnic między modelami LLM jest kluczowe w projektowaniu biznesowych systemów, gdzie niektóre modele są lepsze na co dzień, a mniejsze, lokalne uchodzą za bezpieczniejsze dla danych RODO.`
            },
            en: {
                title: 'LLM (Large Language Model)',
                shortDesc: 'An advanced AI algorithm focused on reading, summarizing, and generating human language.',
                content: `## What is an LLM?
Large Language Models (LLMs) are AI models trained on vast amounts of data to understand conversational language naturally.`
            }
        }
    },
    {
        slug: 'aios-ai-operating-system',
        icon: '⚡',
        gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
        translations: {
            pl: {
                title: 'AIOS (AI Operating System)',
                shortDesc: 'Zintegrowany środowisko pracy wspierane przez wirtualny umysł agentyczny, zarządzający całą Twoją firmą.',
                content: `## Czym jest AIOS?
Koncepcja AIOS odnosi się do przyszłości zarządzania przedsiębiorstwem, gdzie Sztuczna Inteligencja nie jest tylko pobocznym chatbotem, lecz systemem operacyjnym firmy.

Integracja poszczególnych warstw "OS" (np. Data OS, Context OS, Workflow OS, Meeting OS) z modelami językowymi w jedną "uprząż" gwarantuje całkowitą widoczność w firmy.

Dzięki **AIOS**, liderzy mogą pracować całkowicie asynchronicznie, korzystając z Agenta AI do analizy logów i raportowania wyników jako Co-CEO.`
            },
            en: {
                title: 'AIOS (AI Operating System)',
                shortDesc: 'An integrated workspace powered by an agentic mind, managing your entire business output.',
                content: `## What is AIOS?
The future of enterprise management, integrating Data OS, Context OS, and Workflows within one logical intelligent structure for leaders.`
            }
        }
    }
];

export const kbTranslations: Record<string, Record<string, string>> = {
    pl: {
        'kb.back': 'Baza Wiedzy AI',
        'kb.hero.title': 'Słownik & Baza Wiedzy AI',
        'kb.hero.subtitle': 'Przewodnik po pojęciach ze świata Sztucznej Inteligencji i automatyzacji. Zdobywaj przewagę w erze cyfrowej z ECM Digital.',
        'kb.read': 'Czytaj więcej'
    },
    en: {
        'kb.back': 'AI Knowledge Base',
        'kb.hero.title': 'AI Dictionary & Knowledge Base',
        'kb.hero.subtitle': 'Your guide to concepts in Artificial Intelligence and automation. Gain an edge in the digital era with ECM Digital.',
        'kb.read': 'Read more'
    },
    de: {
        'kb.back': 'KI Wissensbasis',
        'kb.hero.title': 'KI Wörterbuch & Wissensbasis',
        'kb.hero.subtitle': 'Ihr Leitfaden zu Konzepten in der KI und Automatisierung. Verschaffen Sie sich im digitalen Zeitalter einen Vorteil.',
        'kb.read': 'Mehr lesen'
    }
};

export function tkb(lang: Lang, key: string): string {
    return kbTranslations[lang]?.[key] || kbTranslations.pl[key] || key;
}
