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
        }
    },
    {
        slug: 'private-llm',
        icon: '🔒',
        gradient: 'linear-gradient(135deg, #1e293b 0%, #3b82f6 100%)',
        translations: {
            pl: {
                title: 'Prywatny Model LLM (Private LLM)',
                shortDesc: 'Modele AI uruchamiane na własnych serwerach firmy lub w zabezpieczonej chmurze prywatnej. Gwarantują poufność i pełne bezpieczeństwo danych RODO.',
                content: `## Czym jest Prywatne LLM?
Prywatne LLM (Private Large Language Model) to instancja modelu językowego wdrożona na wyłączność w bezpiecznej infrastrukturze firmy (na serwerach fizycznych firmy lub w dedykowanej, odizolowanej chmurze prywatnej).

W przeciwieństwie do publicznych interfejsów (takich jak standardowy ChatGPT), prywatne modele LLM nie przesyłają danych na serwery zewnętrznych firm, eliminując ryzyko wycieku poufnych danych klientów, tajemnic handlowych czy kodu źródłowego.

### Główne zalety wdrożenia prywatnego LLM:
1. **Pełne bezpieczeństwo i RODO:** Dane nigdy nie opuszczają Twojej infrastruktury IT. Twoje dane nie są wykorzystywane do trenowania modeli innych firm.
2. **Niezależność:** Brak ryzyka, że dostawca zewnętrzny zmieni warunki użytkowania, podniesie ceny lub wyłączy usługę.
3. **Dostosowanie (Fine-Tuning):** Model można dotrenować na wewnętrznych bazach danych firmy, by posługiwał się specyficznym żargonem i znał procedury.

### Zastosowanie w biznesie:
- **Sektor Finansowy i Prawny:** Analiza umów i dokumentacji bez ryzyka ujawnienia tajemnic.
- **Medycyna:** Analiza kart pacjentów zgodnie z restrykcyjnymi zasadami ochrony danych zdrowotnych.
- **Przemysł:** Bezpieczne wyszukiwanie informacji w procedurach wewnętrznych i dokumentacji patentowej.`
            },
            en: {
                title: 'Private LLM',
                shortDesc: 'AI models hosted on on-premise infrastructure or isolated cloud instances, ensuring absolute data privacy and GDPR compliance.',
                content: `## What is a Private LLM?
A Private LLM is an instance of a Large Language Model deployed exclusively inside a company's secure environment.

Unlike public tools, private models ensure that prompt data is never used for training other models or sent to third-party endpoints.

### Key advantages:
1. **GDPR & Security:** Data stays strictly inside your corporate network.
2. **Independence:** Zero risk of price hikes or service termination from third parties.
3. **Fine-Tuning:** Custom training on internal documents and proprietary data.`
            }
        }
    },
    {
        slug: 'workflow-automation',
        icon: '⛓️',
        gradient: 'linear-gradient(135deg, #ff4a00 0%, #ff8500 100%)',
        translations: {
            pl: {
                title: 'Automatyzacja procesów (Workflow Automation)',
                shortDesc: 'Łączenie aplikacji, CRM-ów, skrzynek e-mail i modułów AI w zautomatyzowane przepływy pracy (np. n8n, Make), które wykonują zadania w tle 24/7.',
                content: `## Czym jest automatyzacja procesów?
Workflow Automation (Automatyzacja przepływów pracy) to proces łączenia różnych systemów, programów i baz danych za pomocą zautomatyzowanych scenariuszy, które wykonują powtarzalne czynności bez konieczności ręcznego klikania przez człowieka.

Wykorzystując nowoczesne narzędzia takie jak n8n, Make czy Zapier, integrujemy formularze na stronie, skrzynki e-mail, komunikatory (Slack, Teams), bazy SQL oraz moduły AI w jeden spójny system.

### Dlaczego automatyzacja procesów jest kluczowa:
1. **Eliminacja rutyny:** Pracownicy przestają ręcznie kopiować dane z formularzy do CRM czy wystawiać faktury.
2. **Brak błędów ludzkich:** System działa zgodnie ze zdefiniowanym schematem, nie myli literówek w mailach ani kwot.
3. **Działanie 24/7:** Procesy przetwarzania leadów i wysyłki ofert działają nawet w nocy i w dni świąteczne.

### Zastosowanie w biznesie:
- **Lead Management:** Automatyczne pobieranie leadów z reklam (np. Facebook Lead Ads), zapisywanie w CRM i natychmiastowe przydzielanie do handlowca.
- **Obsługa Faktur:** Automatyczne odczytywanie faktur ze skrzynki e-mail za pomocą AI i wprowadzanie danych do systemu księgowego.
- **Raportowanie:** Automatyczne generowanie tygodniowych podsumowań sprzedaży i wysyłanie na Slacka.`
            },
            en: {
                title: 'Workflow Automation',
                shortDesc: 'Connecting CRM, emails, and databases into automated paths (using n8n, Make, or Zapier) that run in the background 24/7.',
                content: `## What is Workflow Automation?
Workflow Automation connects separate business applications, systems, and APIs to execute repetitive tasks automatically.

By using modern integration platforms like n8n or Make, we map complex business pathways without manual copy-pasting.

### Key advantages:
1. **Zero Busywork:** Teams focus on high-value strategy instead of copy-paste data entry.
2. **Eliminated Errors:** Data flows directly and securely between applications.
3. **Always On:** Leads and inquiries are processed instantly, day or night.`
            }
        }
    },
    {
        slug: 'computer-vision-ocr',
        icon: '👁️',
        gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        translations: {
            pl: {
                title: 'Computer Vision & Smart OCR',
                shortDesc: 'Systemy AI do odczytywania i strukturyzowania danych ze skanów dokumentów, faktur, zdjęć i tabel bez ręcznego przepisywania.',
                content: `## Czym jest Computer Vision i Smart OCR?
Computer Vision (Komputerowe rozpoznawanie obrazu) oraz Smart OCR (Optical Character Recognition zasilany AI) to technologie pozwalające komputerom na „widzenie” i interpretowanie zawartości plików graficznych, zdjęć oraz dokumentów PDF.

Tradycyjny OCR potrafił jedynie odczytać znaki (np. zamienić obrazek na plik TXT). Smart OCR zasilany modelami językowymi potrafi *zrozumieć* dokument – np. rozpoznać, która kwota to NIP, a która to suma brutto, bez konieczności tworzenia sztywnych szablonów dla każdej faktury.

### Jakie możliwości daje Smart OCR i Vision:
1. **Strukturyzacja danych:** Przekształcanie nieustrukturyzowanych plików PDF (faktur, umów, raportów finansowych) w czyste pliki JSON/Excel.
2. **Weryfikacja tożsamości:** Skanowanie i automatyczne sprawdzanie dowodów osobistych czy praw jazdy w systemach rejestracji.
3. **Kontrola Jakości:** Analiza zdjęć z linii produkcyjnych w celu wykrywania wad produktów.

### Zastosowanie w biznesie:
- **Księgowość:** Odczytywanie i automatyczne księgowanie faktur zakupowych o dowolnym układzie graficznym.
- **Logistyka:** Automatyzacja listów przewozowych i dokumentów dostawy.
- **Obsługa Umów:** Porównywanie zeskanowanych umów papierowych z ich cyfrowymi oryginałami w celu wykrywania dopisanych ręcznie poprawek.`
            },
            en: {
                title: 'Computer Vision & Smart OCR',
                shortDesc: 'AI models trained to read, understand, and extract structured data from scanned invoices, tables, and physical documents.',
                content: `## What is Smart OCR & Computer Vision?
Computer Vision allows algorithms to interpret visual data. Combined with AI-powered OCR, it extracts structured semantic information from scanned assets.

### Key advantages:
1. **Context Understanding:** Models identify tax fields or totals regardless of document layout.
2. **Automated Audits:** Review scanned files against text versions to spot discrepancies.
3. **Instant Intake:** Users upload ID photos or bills, and forms autofill instantly.`
            }
        }
    },
    {
        slug: 'prompt-engineering',
        icon: '✍️',
        gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
        translations: {
            pl: {
                title: 'Inżynieria promptów (Prompt Engineering)',
                shortDesc: 'Sztuka precyzyjnego instruowania i programowania modeli AI za pomocą słów, gwarantująca powtarzalne i stabilne wyniki w systemach biznesowych.',
                content: `## Czym jest Prompt Engineering?
Prompt Engineering (Inżynieria promptów) to nauka i sztuka precyzyjnego formułowania zapytań (instrukcji) do modeli językowych w taki sposób, aby uzyskać jak najbardziej dokładne, pożądane i bezpieczne rezultaty.

W biznesowych wdrożeniach AI, Prompt Engineering to nie tylko „dobre pisanie zapytań”, ale zaawansowane programowanie zachowania AI za pomocą technik takich jak Few-Shot Prompting, Chain of Thought (łańcuch myśli) czy zmuszanie AI do generowania ustrukturyzowanych danych (np. JSON).

### Dlaczego to kluczowy element systemów AI:
1. **Powtarzalność wyników:** Zapewnia, że chatbot lub agent AI za każdym razem odpowie z taką samą kulturą i dokładnością, nie wychodząc poza nadane uprawnienia.
2. **Bezpieczeństwo (Guardrails):** Chroni system przed atakami typu Prompt Injection (próbami zmanipulowania bota przez klienta w celu obniżenia cen lub uzyskania poufnych danych).
3. **Efektywność kosztowa:** Optymalizacja promptów zmniejsza zużycie tokenów, co bezpośrednio przekłada się na niższe rachunki za API (np. OpenAI lub Anthropic).

### Zastosowanie w biznesie:
- **Systemy SDR / Sprzedażowe:** Pisanie promptów pozycjonujących agenta jako cierpliwego handlowca badającego potrzeby.
- **Kwalifikacja Treści:** Promptowanie modeli klasyfikujących w celu kategoryzacji wiadomości (np. skarga, prośba o wycenę, spam).
- **Generowanie Raportów:** Ustawianie sztywnych instrukcji formatowania w celu ciągłego generowania raportów w tym samym formacie markdown.`
            },
            en: {
                title: 'Prompt Engineering',
                shortDesc: 'The technique of structuring instructions for LLMs to generate repeatable, formatted, and safe output in production applications.',
                content: `## What is Prompt Engineering?
Prompt Engineering is the design process of refining prompts to get consistent, accurate, and structured results from AI systems.

### Key advantages:
1. **Consistency:** AI outputs remain formatted and strictly on-topic.
2. **Security:** Preventing prompt injections and jailbreaks.
3. **Token Efficiency:** Writing concise system rules to reduce API costs.`
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
