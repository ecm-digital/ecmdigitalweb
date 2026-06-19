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

export interface FAQItem {
    id: string;
    translations: Record<string, {
        question: string;
        answer: string;
    }>;
}

export const faqItems: FAQItem[] = [
    {
        id: 'pricing',
        translations: {
            pl: {
                question: 'Ile kosztuje wdrożenie automatyzacji lub sztucznej inteligencji?',
                answer: 'Ceny wdrożeń automatyzacji (np. w n8n lub Make) zaczynają się od 3 000 PLN za prosty proces, a zaawansowani asystenci AI i integracje to koszt od 5 000 do 15 000 PLN. Każdy projekt wyceniamy indywidualnie po bezpłatnej konsultacji i analizie.'
            },
            en: {
                question: 'How much does it cost to implement automation or AI?',
                answer: 'Automation implementation (e.g. in n8n or Make) starts at 3,000 PLN for simple workflows, while advanced AI assistants and deep integrations range from 5,000 to 15,000 PLN. Each project is quoted individually after a free discovery call.'
            }
        }
    },
    {
        id: 'timeline',
        translations: {
            pl: {
                question: 'Jak długo trwa wdrożenie projektu?',
                answer: 'Proste automatyzacje i audyty realizujemy w 2-3 tygodnie. Dedykowani asystenci AI i średniej wielkości systemy to zazwyczaj 4-6 tygodni, a budowa pełnych aplikacji MVP trwa od 8 do 12 tygodni.'
            },
            en: {
                question: 'How long does project implementation take?',
                answer: 'Simple automations and audits are delivered in 2-3 weeks. Dedicated AI assistants and medium-sized systems usually take 4-6 weeks, while full MVP application development takes 8 to 12 weeks.'
            }
        }
    },
    {
        id: 'security',
        translations: {
            pl: {
                question: 'Czy moje dane firmowe i dane klientów są bezpieczne z AI?',
                answer: 'Bezpieczeństwo to nasz priorytet. Wdrażamy systemy zgodne z RODO/GDPR. Dla wrażliwych danych konfigurujemy prywatne modele LLM uruchamiane w odizolowanej chmurze lub lokalnie, dzięki czemu dane nie są wykorzystywane do trenowania publicznych modeli.'
            },
            en: {
                question: 'Are my company and customer data safe with AI?',
                answer: 'Security is our top priority. We implement GDPR-compliant systems. For sensitive data, we configure Private LLMs hosted in isolated clouds or on-premise, ensuring your inputs are never used to train public models.'
            }
        }
    },
    {
        id: 'maintenance',
        translations: {
            pl: {
                question: 'Jakie są koszty utrzymania wdrożonych systemów (API i licencje)?',
                answer: 'Koszty zależą od skali użytkowania. Korzystanie z modeli takich jak GPT-4o czy Claude 3.5 rozliczane jest za zużycie (tokeny) – dla małej firmy to często zaledwie kilkanaście dolarów miesięcznie. Narzędzia takie jak n8n wdrażamy w wersji self-hosted, co pozwala uniknąć drogich abonamentów.'
            },
            en: {
                question: 'What are the maintenance costs (API and licensing)?',
                answer: 'Costs depend on usage. Models like GPT-4o or Claude 3.5 are billed on a pay-as-you-go basis (tokens) – for small companies, this is often just a few dozen dollars a month. We set up tools like n8n as self-hosted to avoid expensive subscriptions.'
            }
        }
    },
    {
        id: 'progress',
        translations: {
            pl: {
                question: 'Jak mogę śledzić postępy prac nad moim projektem?',
                answer: 'Każdy klient otrzymuje dostęp do Panelu Klienta (The Portal). Widzisz tam aktualny status prac, ukończone sprinty, dokumentację techniczną oraz zaplanowane zadania. Pracujemy w 100% transparentnie.'
            },
            en: {
                question: 'How can I track the progress of my project?',
                answer: 'Every client receives access to our Client Panel (The Portal). You can see the current project status, completed sprints, technical documentation, and planned tasks there. We work with 100% transparency.'
            }
        }
    },
    {
        id: 'the-portal',
        translations: {
            pl: {
                question: 'Co to jest "The Portal" / Panel Klienta?',
                answer: 'To nasze dedykowane narzędzie do zarządzania współpracą. Pozwala klientom w czasie rzeczywistym na wgląd w postępy, komunikację z zespołem, zatwierdzanie kolejnych etapów oraz dostęp do dokumentacji powdrożeniowej.'
            },
            en: {
                question: 'What is "The Portal" / Client Panel?',
                answer: 'It is our dedicated tool for collaboration management. It gives clients real-time visibility into progress, team communication, phase approvals, and post-deployment documentation.'
            }
        }
    },
    {
        id: 'no-tech-knowledge',
        translations: {
            pl: {
                question: 'Czy muszę mieć wiedzę techniczną, aby z Wami współpracować?',
                answer: 'Nie, nie musisz. Cały proces techniczny bierzemy na siebie. Tłumaczymy działanie systemów prostym językiem, a po wdrożeniu przeprowadzamy szkolenia dla Twojego zespołu oraz przekazujemy przejrzyste instrukcje.'
            },
            en: {
                question: 'Do I need technical knowledge to work with you?',
                answer: 'No, you don\'t. We handle the entire technical process. We explain how the systems work in plain language, and after deployment, we train your team and deliver clear instructions.'
            }
        }
    },
    {
        id: 'hallucinations',
        translations: {
            pl: {
                question: 'Czy AI może halucynować (wymyślać nieprawdziwe informacje)?',
                answer: 'Tak, surowe modele językowe mają taką tendencję. Aby temu zapobiec, stosujemy architekturę RAG (Retrieval-Augmented Generation) oraz restrykcyjne instrukcje (guardrails). Dzięki temu AI odpowiada wyłącznie na podstawie dostarczonych baz wiedzy i dokumentów Twojej firmy.'
            },
            en: {
                question: 'Can AI hallucinate (make up false information)?',
                answer: 'Yes, raw language models tend to do so. To prevent this, we use RAG (Retrieval-Augmented Generation) architectures and strict guardrails. This limits the AI to answer solely based on your provided company documentation.'
            }
        }
    },
    {
        id: 'tech-stack',
        translations: {
            pl: {
                question: 'Z jakimi technologiami pracujecie najczęściej?',
                answer: 'Nasz główny stack to Next.js, TypeScript, Node.js oraz chmura Firebase/Google Cloud. W automatyzacjach wykorzystujemy n8n i Make, a w e-commerce Shopify. Integracje AI opieramy o biblioteki LangChain oraz interfejsy OpenAI, Gemini i Anthropic.'
            },
            en: {
                question: 'What technologies do you work with most often?',
                answer: 'Our core stack includes Next.js, TypeScript, Node.js, and Firebase/Google Cloud. For automations we use n8n and Make, and for e-commerce, we rely on Shopify. We build AI integrations using LangChain, OpenAI, Gemini, and Anthropic APIs.'
            }
        }
    },
    {
        id: 'support',
        translations: {
            pl: {
                question: 'Czy oferujecie wsparcie po wdrożeniu projektu?',
                answer: 'Tak, oferujemy elastyczne pakiety wsparcia technicznego i powdrożeniowego (SLA). Dbamy o to, aby automatyzacje działały bez przerw, a modele AI były na bieżąco optymalizowane i aktualizowane do najnowszych wersji.'
            },
            en: {
                question: 'Do you offer support after project launch?',
                answer: 'Yes, we offer flexible post-deployment technical support and maintenance packages (SLA). We ensure your automations run smoothly and update AI models regularly to their latest versions.'
            }
        }
    },
    {
        id: 'start',
        translations: {
            pl: {
                question: 'Jak rozpocząć współpracę?',
                answer: 'Najlepszym krokiem jest wypełnienie formularza kontaktowego lub rezerwacja bezpłatnej, 30-minutowej konsultacji. Przeanalizujemy Twoje potrzeby i przygotujemy konkretne rekomendacje wraz z wyceną.'
            },
            en: {
                question: 'How do we start collaborating?',
                answer: 'The best way to start is by filling out our contact form or booking a free 30-minute consultation. We will analyze your requirements and provide tailored recommendations with a quotation.'
            }
        }
    },
    {
        id: 'crm-integrations',
        translations: {
            pl: {
                question: 'Czy integrujecie AI z istniejącymi systemami CRM?',
                answer: 'Tak, większość naszych projektów to integracje z systemami CRM (np. HubSpot, Pipedrive, Salesforce), komunikatorami (Slack, Teams, WhatsApp, Messenger) czy skrzynkami e-mail.'
            },
            en: {
                question: 'Do you integrate AI with existing CRM systems?',
                answer: 'Yes, most of our projects involve integrations with CRMs (e.g. HubSpot, Pipedrive, Salesforce), messaging platforms (Slack, Teams, WhatsApp, Messenger), or email accounts.'
            }
        }
    }
];
