'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { addLead } from '@/lib/firestoreService';
import { trackLead } from '@/lib/ga';
import { 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  ArrowRight, 
  RefreshCw, 
  BarChart2, 
  Shield, 
  Award, 
  Sparkles, 
  Send, 
  PhoneCall, 
  Lock, 
  TrendingUp, 
  Users, 
  Database, 
  Cpu, 
  MessageSquare,
  AlertTriangle
} from 'lucide-react';

interface Question {
  id: string;
  category: 'strategy' | 'data' | 'operations';
  categoryLabel: { pl: string; en: string };
  title: { pl: string; en: string };
  description?: { pl: string; en: string };
  options: Array<{
    text: { pl: string; en: string };
    score: number;
  }>;
}

const QUESTIONS: Question[] = [
  {
    id: 'vision',
    category: 'strategy',
    categoryLabel: { pl: 'Strategia i Wizja', en: 'Strategy & Vision' },
    title: { pl: 'Czy Twoja firma posiada strategię wdrożenia AI?', en: 'Does your company have an AI implementation strategy?' },
    description: { pl: 'Wizja i planowanie są kluczem do udanej transformacji.', en: 'Vision and planning are key to a successful transformation.' },
    options: [
      { text: { pl: 'Nie, nie myśleliśmy o tym.', en: 'No, we haven\'t thought about it.' }, score: 1 },
      { text: { pl: 'Rozważamy pewne pomysły, ale brak nam konkretnego planu.', en: 'We are considering some ideas, but lack a concrete plan.' }, score: 2 },
      { text: { pl: 'Mamy wdrożone pojedyncze narzędzia (np. ChatGPT), ale bez szerszej strategii.', en: 'We have implemented some tools (like ChatGPT), but without a broader strategy.' }, score: 3 },
      { text: { pl: 'Tak, mamy jasną strategię i wyznaczone cele wdrożenia AI.', en: 'Yes, we have a clear strategy and defined AI implementation goals.' }, score: 4 },
    ]
  },
  {
    id: 'data',
    category: 'data',
    categoryLabel: { pl: 'Dane i Infrastruktura', en: 'Data & Infrastructure' },
    title: { pl: 'W jaki sposób przechowywane są dane operacyjne i dane o klientach?', en: 'How are operational and customer data stored?' },
    description: { pl: 'AI potrzebuje ustrukturyzowanych danych, by działać efektywnie.', en: 'AI needs structured data to operate effectively.' },
    options: [
      { text: { pl: 'W notatkach, mailach lub na papierze – brak centralizacji.', en: 'In notes, emails, or on paper – no centralization.' }, score: 1 },
      { text: { pl: 'W wielu arkuszach Excel/Google Sheets, bez automatycznej synchronizacji.', en: 'In multiple Excel/Google sheets, without auto-sync.' }, score: 2 },
      { text: { pl: 'W jednym systemie CRM/ERP, ale dane wymagają ręcznego porządkowania.', en: 'In a single CRM/ERP system, but data requires manual cleaning.' }, score: 3 },
      { text: { pl: 'W zorganizowanej, zintegrowanej bazie danych gotowej do analizy przez AI.', en: 'In an organized, integrated database ready for AI analysis.' }, score: 4 },
    ]
  },
  {
    id: 'automation',
    category: 'operations',
    categoryLabel: { pl: 'Operacje i Automatyzacja', en: 'Operations & Automation' },
    title: { pl: 'Jak automatyzujecie powtarzalne zadania w firmie?', en: 'How do you automate repetitive tasks in your company?' },
    description: { pl: 'Automatyzacja to pierwszy krok do skalowania z AI.', en: 'Automation is the first step to scaling with AI.' },
    options: [
      { text: { pl: 'Wszystko robimy ręcznie.', en: 'We do everything manually.' }, score: 1 },
      { text: { pl: 'Używamy podstawowych szablonów lub prostych reguł w skrzynkach mailowych.', en: 'We use basic templates or simple email inbox rules.' }, score: 2 },
      { text: { pl: 'Używamy prostych integracji (np. Zapier, Make) do łączenia kilku aplikacji.', en: 'We use simple integrations (e.g., Zapier, Make) to connect a few apps.' }, score: 3 },
      { text: { pl: 'Mamy zaawansowane, dedykowane scenariusze automatyzacji (np. n8n, skrypty).', en: 'We have advanced, dedicated automation scenarios (e.g., n8n, custom scripts).' }, score: 4 },
    ]
  },
  {
    id: 'support',
    category: 'operations',
    categoryLabel: { pl: 'Obsługa Klienta', en: 'Customer Support' },
    title: { pl: 'Jak wygląda obsługa powtarzalnych zapytań od klientów?', en: 'How is repetitive customer support handled?' },
    description: { pl: 'Agenci AI mogą odciążyć zespół, odpowiadając na 80% pytań.', en: 'AI agents can offload your team by answering 80% of questions.' },
    options: [
      { text: { pl: 'Pracownicy odpowiadają na każde zapytanie ręcznie od zera.', en: 'Staff reply to every inquiry manually from scratch.' }, score: 1 },
      { text: { pl: 'Używamy gotowych szablonów odpowiedzi w mailach.', en: 'We use pre-made email response templates.' }, score: 2 },
      { text: { pl: 'Mamy prosty chatbot oparty na drzewie decyzji.', en: 'We have a simple decision-tree chatbot.' }, score: 3 },
      { text: { pl: 'Używamy inteligentnych agentów AI zintegrowanych z naszą bazą wiedzy.', en: 'We use intelligent AI agents integrated with our knowledge base.' }, score: 4 },
    ]
  },
  {
    id: 'skills',
    category: 'strategy',
    categoryLabel: { pl: 'Strategia i Wizja', en: 'Strategy & Vision' },
    title: { pl: 'Jak dobrze Twój zespół zna i wykorzystuje narzędzia AI?', en: 'How well does your team know and utilize AI tools?' },
    description: { pl: 'Kompetencje zespołu decydują o tempie adopcji technologii.', en: 'Team competence determines the speed of technology adoption.' },
    options: [
      { text: { pl: 'Nikt w firmie nie korzysta z narzędzi AI.', en: 'No one in the company uses AI tools.' }, score: 1 },
      { text: { pl: 'Pojedyncze osoby używają darmowego ChatGPT do prostych zadań.', en: 'Individuals use free ChatGPT for simple tasks.' }, score: 2 },
      { text: { pl: 'Większość zespołu korzysta z AI w codziennej pracy, ale brak nam szkoleń.', en: 'Most of the team uses AI in daily work, but we lack training.' }, score: 3 },
      { text: { pl: 'Mamy wdrożone standardy korzystania z AI i przeszkolony zespół.', en: 'We have implemented AI standards and a trained team.' }, score: 4 },
    ]
  },
  {
    id: 'budget',
    category: 'strategy',
    categoryLabel: { pl: 'Strategia i Wizja', en: 'Strategy & Vision' },
    title: { pl: 'Jakie środki firma przeznacza na rozwój technologii i AI?', en: 'What budget does the company allocate for tech and AI development?' },
    description: { pl: 'Wdrożenie sztucznej inteligencji to inwestycja o wysokiej stopie zwrotu.', en: 'AI implementation is an investment with a high rate of return.' },
    options: [
      { text: { pl: 'Nie posiadamy budżetu na innowacje technologiczne.', en: 'We don\'t have a budget for technological innovations.' }, score: 1 },
      { text: { pl: 'Wdrażamy narzędzia tylko wtedy, gdy jest to absolutnie konieczne.', en: 'We implement tools only when absolutely necessary.' }, score: 2 },
      { text: { pl: 'Mamy elastyczny budżet na testowanie nowych rozwiązań.', en: 'We have a flexible budget for testing new solutions.' }, score: 3 },
      { text: { pl: 'Posiadamy dedykowany budżet na transformację cyfrową i AI.', en: 'We have a dedicated budget for digital and AI transformation.' }, score: 4 },
    ]
  },
  {
    id: 'processes',
    category: 'operations',
    categoryLabel: { pl: 'Operacje i Automatyzacja', en: 'Operations & Automation' },
    title: { pl: 'Czy procesy operacyjne w Twojej firmie są powtarzalne i spisane?', en: 'Are operational processes in your company repeatable and documented?' },
    description: { pl: 'Jasne procedury znacznie ułatwiają programowanie agentów AI.', en: 'Clear procedures make programming AI agents much easier.' },
    options: [
      { text: { pl: 'Nie, każdy pracownik robi rzeczy po swojemu.', en: 'No, each employee does things their own way.' }, score: 1 },
      { text: { pl: 'Mamy pewne niepisane zasady, ale brak oficjalnych procedur.', en: 'We have some unwritten rules, but lack official procedures.' }, score: 2 },
      { text: { pl: 'Procesy są powtarzalne, ale spisane tylko częściowo.', en: 'Processes are repeatable, but only partially documented.' }, score: 3 },
      { text: { pl: 'Wszystkie kluczowe procesy są w pełni zmapowane i udokumentowane.', en: 'All key processes are fully mapped and documented.' }, score: 4 },
    ]
  },
  {
    id: 'integration',
    category: 'data',
    categoryLabel: { pl: 'Dane i Infrastruktura', en: 'Data & Infrastructure' },
    title: { pl: 'Jak łatwo można połączyć Twoje obecne oprogramowanie (CRM, ERP, pocztę) z innymi narzędziami?', en: 'How easily can your current software (CRM, ERP, email) connect with other tools?' },
    description: { pl: 'Otwartość systemów na integrację decyduje o możliwościach AI.', en: 'Systems\' openness to integration determines AI capabilities.' },
    options: [
      { text: { pl: 'Używamy starych programów (legacy) bez możliwości łączenia przez API.', en: 'We use legacy software with no API connection options.' }, score: 1 },
      { text: { pl: 'Niektóre programy mają gotowe integracje, ale większość działa osobno.', en: 'Some apps have built-in integrations, but most work separately.' }, score: 2 },
      { text: { pl: 'Większość naszych narzędzi posiada otwarte API, z którego możemy skorzystać.', en: 'Most of our tools have open APIs that we can use.' }, score: 3 },
      { text: { pl: 'Wszystkie systemy są nowoczesne, w chmurze i w pełni połączone za pomocą API.', en: 'All systems are modern, cloud-based, and fully connected via APIs.' }, score: 4 },
    ]
  },
  {
    id: 'crm',
    category: 'operations',
    categoryLabel: { pl: 'Obsługa Klienta', en: 'Customer Support' },
    title: { pl: 'W jaki sposób pozyskujecie i obsługujecie nowych klientów?', en: 'How do you generate and handle new customer leads?' },
    description: { pl: 'Automatyczna kwalifikacja leadów pozwala oszczędzić czas handlowców.', en: 'Automated lead qualification saves sales representatives\' time.' },
    options: [
      { text: { pl: 'Leady zapisujemy w notesie lub na skrzynce mailowej.', en: 'We track leads in a notebook or email inbox.' }, score: 1 },
      { text: { pl: 'Używamy prostego CRM, ale kontaktujemy się w pełni ręcznie.', en: 'We use a simple CRM, but communication is fully manual.' }, score: 2 },
      { text: { pl: 'CRM wysyła powiadomienia, ale brak automatycznego kwalifikowania.', en: 'CRM sends notifications, but lacks automated qualification.' }, score: 3 },
      { text: { pl: 'Mamy w pełni zautomatyzowany lej (kwalifikacja AI, automatyczny follow-up).', en: 'We have a fully automated funnel (AI qualification, automatic follow-up).' }, score: 4 },
    ]
  },
  {
    id: 'compliance',
    category: 'strategy',
    categoryLabel: { pl: 'Dane i Infrastruktura', en: 'Data & Infrastructure' },
    title: { pl: 'Czy posiadacie polityki bezpieczeństwa dotyczące przetwarzania danych przez AI?', en: 'Do you have security policies for data processing by AI?' },
    description: { pl: 'Zgodność z RODO oraz bezpieczeństwo danych to podstawa wdrożenia AI.', en: 'GDPR compliance and data security are fundamental to AI adoption.' },
    options: [
      { text: { pl: 'Nie regulujemy tego w żaden sposób.', en: 'We do not regulate this in any way.' }, score: 1 },
      { text: { pl: 'Pracownicy zostali poproszeni o niewrzucanie danych klientów do ChatGPT.', en: 'Staff were asked not to put client data into ChatGPT.' }, score: 2 },
      { text: { pl: 'Mamy podstawowe wytyczne, ale brak wdrożonych zabezpieczeń technicznych.', en: 'We have basic guidelines, but lack technical security measures.' }, score: 3 },
      { text: { pl: 'Mamy wdrożone rygorystyczne polityki bezpieczeństwa i umowy RODO z dostawcami AI.', en: 'We have strict security policies and GDPR agreements with AI providers.' }, score: 4 },
    ]
  },
  {
    id: 'size',
    category: 'strategy',
    categoryLabel: { pl: 'Strategia i Wizja', en: 'Strategy & Vision' },
    title: { pl: 'Ilu pracowników liczy Twoja firma?', en: 'How many employees does your company have?' },
    description: { pl: 'Skala działalności pozwala dobrać odpowiednie architektury AI.', en: 'The scale of business operations dictates the suitable AI architecture.' },
    options: [
      { text: { pl: '1 (samodzielny przedsiębiorca)', en: '1 (solo entrepreneur)' }, score: 1 },
      { text: { pl: '2–10 osób', en: '2–10 people' }, score: 2 },
      { text: { pl: '11–50 osób', en: '11–50 people' }, score: 3 },
      { text: { pl: 'Powyżej 50 osób', en: 'More than 50 people' }, score: 4 },
    ]
  },
  {
    id: 'bottleneck',
    category: 'operations',
    categoryLabel: { pl: 'Operacje i Automatyzacja', en: 'Operations & Automation' },
    title: { pl: 'Który obszar w firmie pochłania najwięcej niepotrzebnego czasu?', en: 'Which area in the company consumes the most unnecessary time?' },
    description: { pl: 'Zlokalizowanie wąskich gardeł wskaże nam priorytetowe wdrożenia.', en: 'Locating bottlenecks shows us high-priority implementations.' },
    options: [
      { text: { pl: 'Obsługa klienta i odpowiadanie na powtarzalne pytania.', en: 'Customer service and answering repetitive questions.' }, score: 3 },
      { text: { pl: 'Ręczne przepisywanie danych między systemami i biurokracja.', en: 'Manual data entry between systems and paperwork.' }, score: 3 },
      { text: { pl: 'Pozyskiwanie, kwalifikacja i wycena zapytań od nowych klientów.', en: 'Lead generation, qualification, and proposal quoting.' }, score: 3 },
      { text: { pl: 'Tworzenie treści marketingowych, ofert i dokumentów.', en: 'Creating marketing content, proposals, and documents.' }, score: 3 },
    ]
  }
];

interface AnalysisResponse {
  recommendation: string;
  quickWins: string[];
  suggestedServices: Array<{
    name: string;
    emoji: string;
    reason: string;
    priority: 'high' | 'medium' | 'low';
  }>;
}

const statusMessages = {
  pl: [
    'Ewaluacja dojrzałości technologicznej...',
    'Analizowanie struktury danych...',
    'Identyfikacja wąskich gardeł w procesach...',
    'Weryfikacja podatności na automatyzacje...',
    'Modelowanie potencjału wdrożenia Agentów AI...',
    'Strukturyzowanie raportu strategicznego...',
    'Finalizowanie analizy AI...'
  ],
  en: [
    'Evaluating technological maturity...',
    'Analyzing data structures...',
    'Identifying bottlenecks in processes...',
    'Verifying automation suitability...',
    'Modeling AI Agent deployment potential...',
    'Structuring strategic report...',
    'Finalizing AI analysis...'
  ]
};

async function generateReportClientSide(answers: any, displayLang: string): Promise<AnalysisResponse> {
  const isPl = displayLang === 'pl';
  const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  const fallbackReport: AnalysisResponse = {
    recommendation: isPl
      ? 'Na podstawie Twoich odpowiedzi, Twoja firma wykazuje duży potencjał do automatyzacji procesów operacyjnych. Rekomendujemy wdrożenie podstawowych agentów AI wspierających obsługę klienta oraz integrację rozproszonych narzędzi CRM za pomocą platformy n8n. Pomoże to wyeliminować powtarzalne, ręczne zadania i znacznie przyspieszyć czas obsługi klienta.'
      : 'Based on your answers, your company shows high potential for operational process automation. We recommend implementing basic AI agents to support customer service and integrating scattered CRM tools using the n8n platform. This will help eliminate repetitive, manual tasks and speed up customer service.',
    quickWins: isPl
      ? [
          'Zidentyfikowanie 3 najbardziej powtarzalnych zadań w zespole i rozpisanie ich pod automatyzację w n8n.',
          'Wdrożenie podstawowego asystenta AI zintegrowanego z wewnętrzną bazą wiedzy firmy.',
          'Uporządkowanie i scentralizowanie danych o klientach w jednym systemie CRM.'
        ]
      : [
          'Identify the 3 most repetitive tasks in your team and outline them for n8n automation.',
          'Deploy a basic AI assistant integrated with the company\'s internal knowledge base.',
          'Organize and centralize customer data into a single CRM system.'
        ],
    suggestedServices: [
      {
        name: isPl ? 'Automatyzacje procesów' : 'Process Automation',
        emoji: '⚙️',
        reason: isPl ? 'Pomoże połączyć Twoje obecne narzędzia w jeden spójny system i wyeliminuje ręczne przepisywanie danych.' : 'Will help connect your current tools into one coherent system and eliminate manual data entry.',
        priority: 'high'
      },
      {
        name: isPl ? 'Agenci AI' : 'AI Agents',
        emoji: '🤖',
        reason: isPl ? 'Zautomatyzuje powtarzalną komunikację z klientami, gwarantując odpowiedzi 24/7 i oszczędzając czas zespołu.' : 'Will automate repetitive customer communication, guaranteeing 24/7 replies and saving team time.',
        priority: 'high'
      },
      {
        name: isPl ? 'Kompleksowy Audyt AI' : 'Comprehensive AI Audit',
        emoji: '📋',
        reason: isPl ? 'Pozwoli szczegółowo przeanalizować wszystkie procesy i stworzyć mapę drogową wdrożeń AI.' : 'Will allow a detailed analysis of all processes and create a roadmap for AI implementation.',
        priority: 'medium'
      }
    ]
  };

  if (!API_KEY) {
    console.warn('NEXT_PUBLIC_GEMINI_API_KEY is missing, returning fallback.');
    return fallbackReport;
  }

  try {
    let formattedAnswers = '';
    Object.entries(answers).forEach(([key, val]: [string, any]) => {
      formattedAnswers += `- **${val.question}**: ${val.answerText} (Ocena: ${val.score}/4)\n`;
    });

    const prompt = isPl
      ? `Jesteś doświadczonym dyrektorem ds. technologii (CTO) i doradcą ds. sztucznej inteligencji w agencji interaktywnej ECM Digital.
Przeanalizuj poniższe odpowiedzi z audytu gotowości AI (AI Readiness Audit) wypełnionego przez firmę i przygotuj spersonalizowaną analizę oraz rekomendacje.

Odpowiedzi firmy:
${formattedAnswers}

Wymagania dotyczące odpowiedzi:
1. Odpowiedz w języku: Polskim.
2. Zwróć dane w formacie czystego obiektu JSON. Nie dodawaj znaczników markdown \`\`\`json ani innych tekstów przed i po obiekcie JSON.
3. Obiekt JSON musi mieć następującą strukturę:
{
  "recommendation": "Szczegółowa, profesjonalna ocena stanu gotowości firmy, mocnych stron oraz kluczowych obszarów do poprawy (ok. 100-150 słów). Odwołaj się bezpośrednio do ich odpowiedzi, np. na temat stanu danych lub obsługi klienta. Pisz w tonie eksperckim, motywującym, oferującym realną wartość.",
  "quickWins": [
    "Szybka wygrana 1: konkretne, łatwe do wdrożenia działanie z zakresu AI/automatyzacji (np. za pomocą n8n lub prostych skryptów), które przyniesie natychmiastowe rezultaty bez dużego budżetu.",
    "Szybka wygrana 2: kolejne konkretne i łatwe działanie dostosowane do profilu firmy.",
    "Szybka wygrana 3: trzecie łatwe działanie."
  ],
  "suggestedServices": [
    {
      "name": "Nazwa usługi z portfolio ECM Digital (np. Agenci AI / Automatyzacje procesów / Dedykowane strony i aplikacje / Produkty MVP / Audyt AI)",
      "emoji": "Odpowiedni emoji usługi",
      "reason": "Dlaczego ta konkretna usługa jest rekomendowana dla nich na podstawie ich odpowiedzi.",
      "priority": "high|medium|low"
    }
  ]
}

ECM Digital oferuje następujące usługi główne:
- **Agenci AI** (automatyzacja obsługi klienta, wirtualni asystenci, RAG, kwalifikowanie leadów)
- **Automatyzacje procesów** (połączenia systemów przez n8n, automatyzacja pracy z dokumentami, automatyzacja marketingu)
- **Dedykowane strony i aplikacje** (wysokowydajne portale, platformy e-commerce Shopify/Wix, nowoczesne witryny)
- **Prototypy MVP** (szybkie prototypowanie dla startupów i innowacji)
- **Kompleksowy Audyt AI** (analiza przedwdrożeniowa, strategia transformacji)

Upewnij się, że zaproponujesz 2 lub 3 usługi o najwyższym priorytecie (high/medium) powiązane z ich wąskimi gardłami.
Zwróć TYLKO poprawny obiekt JSON.`
      : `You are an experienced Chief Technology Officer (CTO) and AI Consultant at ECM Digital interactive agency.
Analyze the following answers from the AI Readiness Audit filled out by a company and prepare a personalized analysis and recommendations.

Company answers:
${formattedAnswers}

Response requirements:
1. Answer in the language: English.
2. Return data strictly in the format of a clean JSON object. Do not include markdown code block formatting (like \`\`\`json) or any additional text before or after the JSON object.
3. The JSON object must follow this structure:
{
  "recommendation": "A detailed, professional assessment of the company's readiness, strengths, and key areas for improvement (around 100-150 words). Reference their answers directly (e.g. data quality or customer service). Write in an expert, motivating tone that offers real business value.",
  "quickWins": [
    "Quick Win 1: concrete, easy-to-implement AI/automation action item (e.g. via n8n or simple scripts) that yields immediate results without a high budget.",
    "Quick Win 2: another specific and easy action item tailored to their business profile.",
    "Quick Win 3: a third easy action item."
  ],
  "suggestedServices": [
    {
      "name": "Name of service from ECM Digital portfolio (e.g. AI Agents / Process Automation / Custom Websites & Apps / MVP Prototypes / AI Audit)",
      "emoji": "Suitable emoji for the service",
      "reason": "Why this specific service is recommended for them based on their answers.",
      "priority": "high|medium|low"
    }
  ]
}

ECM Digital offers the following core services:
- **AI Agents** (customer support automation, virtual assistants, RAG, lead qualification)
- **Process Automation** (connecting systems via n8n, document flow automation, marketing automation)
- **Custom Websites & Apps** (high-performance portals, Shopify/Wix e-commerce, modern websites)
- **MVP Prototypes** (rapid prototyping for startups and innovations)
- **AI Audit** (pre-implementation analysis, transformation strategy)

Make sure to suggest 2 or 3 services with high/medium priority matching their bottlenecks.
Return ONLY a valid JSON object.`;

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
    const apiResponse = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.5,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!apiResponse.ok) {
      console.warn('Gemini API returned error status, fallback used:', apiResponse.status);
      return fallbackReport;
    }

    const data = await apiResponse.json();
    let responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    responseText = responseText.trim();

    // Clean up markdown block wraps
    if (responseText.startsWith('```json')) {
      responseText = responseText.substring(7);
    }
    if (responseText.endsWith('```')) {
      responseText = responseText.substring(0, responseText.length - 3);
    }
    responseText = responseText.trim();

    try {
      return JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse Gemini response as JSON. Raw text:', responseText);
      return fallbackReport;
    }
  } catch (error) {
    console.error('Client-side Gemini call failed, returning fallback:', error);
    return fallbackReport;
  }
}

export default function AIReadinessAuditPage() {
  const { lang } = useLanguage();
  const isPl = lang === 'pl' || lang === 'szl';
  const displayLang = isPl ? 'pl' : 'en';

  const getCategoryScores = () => {
    const getScore = (id: string) => answers[id]?.score || 1;

    // 1. Strategia i Wizja: vision, skills, budget, size (4 questions)
    // Max = 16, Min = 4
    const strategyPoints = getScore('vision') + getScore('skills') + getScore('budget') + getScore('size');
    const strategyScore = Math.round(((strategyPoints - 4) / 12) * 100);

    // 2. Dane i Infrastruktura: data, integration, compliance (3 questions)
    // Max = 12, Min = 3
    const dataPoints = getScore('data') + getScore('integration') + getScore('compliance');
    const dataScore = Math.round(((dataPoints - 3) / 9) * 100);

    // 3. Automatyzacja Operacji: automation, processes (2 questions)
    // Max = 8, Min = 2
    const operationsPoints = getScore('automation') + getScore('processes');
    const operationsScore = Math.round(((operationsPoints - 2) / 6) * 100);

    // 4. Obsługa i Kwalifikacja: support, crm (2 questions)
    // Max = 8, Min = 2
    const supportPoints = getScore('support') + getScore('crm');
    const supportScore = Math.round(((supportPoints - 2) / 6) * 100);

    return [
      {
        name: isPl ? 'Strategia i Wizja' : 'Strategy & Vision',
        score: strategyScore,
        color: '#60a5fa', // Blue
        desc: isPl ? 'Wizja, budżet i przygotowanie zespołu.' : 'Vision, budget, and team readiness.'
      },
      {
        name: isPl ? 'Dane i Infrastruktura' : 'Data & Infrastructure',
        score: dataScore,
        color: '#a78bfa', // Purple
        desc: isPl ? 'Uporządkowanie danych, integracje API i RODO.' : 'Data structures, integration APIs, and GDPR.'
      },
      {
        name: isPl ? 'Automatyzacja Operacji' : 'Process Automation',
        score: operationsScore,
        color: '#34d399', // Green
        desc: isPl ? 'Jasność procedur i poziom automatyzacji zadań.' : 'Process documentation and automation of daily tasks.'
      },
      {
        name: isPl ? 'Obsługa i Kwalifikacja' : 'Customer Support & Sales',
        score: supportScore,
        color: '#fb923c', // Orange
        desc: isPl ? 'Sposób obsługi zapytań klientów i lej sprzedaży.' : 'Customer support replies and lead funnel.'
      }
    ];
  };

  const [step, setStep] = useState<'intro' | 'questions' | 'lead' | 'loading' | 'results'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { question: string; answerText: string; score: number }>>({});
  
  // Lead Details
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [isCallbackChecked, setIsCallbackChecked] = useState(true);

  // Results & Loading
  const [scorePercentage, setScorePercentage] = useState(0);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const [report, setReport] = useState<AnalysisResponse | null>(null);
  const [callbackRequested, setCallbackRequested] = useState(false);
  const [submittingCallback, setSubmittingCallback] = useState(false);

  const resultsRef = useRef<HTMLDivElement>(null);

  // Dynamic loading messages
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'loading') {
      interval = setInterval(() => {
        setLoadingMsgIndex((prev) => (prev + 1) % statusMessages[displayLang].length);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [step, displayLang]);

  // Animate readiness score on result step activation
  useEffect(() => {
    if (step === 'results' && scorePercentage > 0) {
      setAnimatedScore(0);
      let start = 0;
      const duration = 1200; // 1.2s total animation
      const steps = 60; // 60 updates
      const increment = scorePercentage / steps;
      const stepDuration = duration / steps;
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= scorePercentage) {
          setAnimatedScore(scorePercentage);
          clearInterval(timer);
        } else {
          setAnimatedScore(Math.round(start));
        }
      }, stepDuration);
      
      return () => clearInterval(timer);
    }
  }, [step, scorePercentage]);

  // Calculate score percentage
  const calculateScore = () => {
    let totalPoints = 0;
    // Sum scores of first 11 questions (bottleneck doesn't score readiness, it locates priority)
    QUESTIONS.forEach((q) => {
      if (q.id !== 'bottleneck' && answers[q.id]) {
        totalPoints += answers[q.id].score;
      }
    });

    // 11 questions * 1 point min = 11. Max = 44 points.
    // Scale 11-44 points to 0-100%
    const score = Math.round(((totalPoints - 11) / (44 - 11)) * 100);
    setScorePercentage(Math.max(0, Math.min(100, score)));
  };

  const handleSelectOption = (option: { text: { pl: string; en: string }; score: number }) => {
    const q = QUESTIONS[currentQuestionIndex];
    setAnswers((prev) => ({
      ...prev,
      [q.id]: {
        question: q.title[displayLang],
        answerText: option.text[displayLang],
        score: option.score,
      },
    }));

    // Auto-advance with a tiny delay so the user sees their selection
    setTimeout(() => {
      if (currentQuestionIndex < QUESTIONS.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        setStep('lead');
      }
    }, 250);
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    } else {
      setStep('intro');
    }
  };

  const handleStartAudit = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setStep('questions');
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    // Validate phone number if provided (minimum 7 digits, allowed chars: +, digits, spaces, hyphens)
    if (phone && phone.trim() !== '') {
      const phoneInput = e.currentTarget.querySelector('input[type="tel"]') as HTMLInputElement;
      const digitsOnly = phone.replace(/\D/g, '');
      if (digitsOnly.length < 7 || !/^[+0-9\s-]+$/.test(phone)) {
        if (phoneInput) {
          phoneInput.setCustomValidity(
            isPl 
              ? 'Podaj prawidłowy numer telefonu (minimum 7 cyfr).' 
              : 'Please enter a valid phone number (minimum 7 digits).'
          );
          phoneInput.reportValidity();
        }
        return;
      }
      if (phoneInput) {
        phoneInput.setCustomValidity('');
      }
    }

    calculateScore();
    setStep('loading');

    try {
      // 1. Submit answers to backend endpoint (with client-side fallback and 2s minimum load time for UX)
      const [data] = await Promise.all([
        (async (): Promise<AnalysisResponse> => {
          try {
            const response = await fetch('/api/ai/audit', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ answers, lang: displayLang }),
            });

            if (!response.ok) throw new Error('Failed to generate report');
            return (await response.json()) as AnalysisResponse;
          } catch (backendErr) {
            console.warn('Backend API failed/404, calling Gemini client-side fallback:', backendErr);
            return await generateReportClientSide(answers, displayLang);
          }
        })(),
        new Promise((resolve) => setTimeout(resolve, 2000))
      ]);
      setReport(data);

      // Calculate final score for lead details
      let totalPoints = 0;
      QUESTIONS.forEach((q) => {
        if (q.id !== 'bottleneck' && answers[q.id]) totalPoints += answers[q.id].score;
      });
      const finalScore = Math.round(((totalPoints - 11) / (44 - 11)) * 100);

      // Determine level
      let level = isPl ? 'Obserwator AI' : 'AI Observer';
      if (finalScore >= 35 && finalScore < 75) level = isPl ? 'Odkrywca AI' : 'AI Explorer';
      if (finalScore >= 75) level = isPl ? 'Lider AI' : 'AI Leader';

      // 2. Save lead in Firestore (calls getProspects structure/addLead)
      const leadMessage = `Wypełniono AI Readiness Audit.\nWynik: ${finalScore}%\nPoziom: ${level}\nWąskie gardło: ${answers.bottleneck?.answerText || 'Nie określono'}\nKonsultacja: ${isCallbackChecked ? 'TAK - Prośba o kontakt w ciągu 24h' : 'NIE'}`;
      
      const firestoreLeadId = await addLead({
        name,
        email,
        phone: phone || '',
        company: company || '',
        service: 'AI Audit',
        message: leadMessage,
        source: 'AI Readiness Audit Tool',
      });

      // 3. Trigger GA Lead Tracking
      trackLead('AI Readiness Audit', 'ai-audit');

      // 4. Trigger HubSpot Forms Submission client-side (to bypass Google Cloud Functions IP spam filter)
      try {
        const nameParts = name.trim().split(/\s+/);
        const firstname = nameParts[0] || '';
        const lastname = nameParts.slice(1).join(' ') || '';

        const getHubSpotCookie = () => {
          if (typeof document === 'undefined') return '';
          const match = document.cookie.match(/hubspotutk=([^;]+)/);
          return match ? match[1] : '';
        };

        const hsPortalId = '145940599';
        const hsFormId = 'fac0d462-6388-49ef-86ea-a34ee139ddb2';
        const hsUrl = `https://api-eu1.hsforms.com/submissions/v3/integration/submit/${hsPortalId}/${hsFormId}`;

        const hsPayload = {
          fields: [
            { name: 'email', value: email },
            { name: 'firstname', value: firstname },
            { name: 'lastname', value: lastname },
            { name: 'company', value: company || '' },
            { name: 'phone', value: phone || '' },
            { name: 'message', value: `Selected Service: AI Audit\nMessage: ${leadMessage}` },
            { name: 'description', value: `Selected Service: AI Audit\nMessage: ${leadMessage}` },
            { name: 'notes', value: `Selected Service: AI Audit\nMessage: ${leadMessage}` }
          ],
          context: {
            hutk: getHubSpotCookie(),
            pageUri: 'https://ecmdigital.pl/tools/ai-readiness',
            pageName: typeof document !== 'undefined' ? document.title : 'Bezpłatny Audyt Gotowości AI'
          }
        };

        const hsRes = await fetch(hsUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(hsPayload),
        });
        const hsData = await hsRes.json();
        console.log('HubSpot client-side response:', hsData);
      } catch (hsClientErr) {
        console.error('HubSpot client-side integration exception:', hsClientErr);
      }

      // 5. Trigger n8n Webhook
      const n8nWebhookUrl = 'https://primary-production-4224.up.railway.app/webhook/contact-form';
      fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          company,
          score: finalScore,
          level,
          bottleneck: answers.bottleneck?.answerText,
          callbackRequested: isCallbackChecked,
          source: 'AI Readiness Audit',
          timestamp: new Date().toISOString(),
          language: displayLang,
          firestoreLeadId
        }),
      }).catch((err) => console.error('n8n submission error:', err));

      setStep('results');
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error('Audit submission error:', err);
      alert(isPl ? 'Wystąpił błąd podczas generowania audytu. Spróbuj ponownie.' : 'An error occurred while generating the audit. Please try again.');
      setStep('lead');
    }
  };

  const handleRequestCallbackDirect = async () => {
    setSubmittingCallback(true);
    try {
      // Append a note/prospect in Firestore or update lead notes to prioritize contact
      await addLead({
        name,
        email,
        phone: phone || '',
        company: company || '',
        service: 'AI Audit Consultation',
        message: `Użytkownik po przejrzeniu wyników Audytu AI (Wynik: ${scorePercentage}%) kliknął przycisk "Zamawiam natychmiastową darmową konsultację". Proszę o pilny kontakt telefoniczny.`,
        source: 'AI Audit Results Direct CTA',
      });

      // Hit n8n for direct callback slack/telegram alerts
      fetch('https://primary-production-4224.up.railway.app/webhook/contact-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          company,
          message: `PILNE: Klient zamówił darmową konsultację bezpośrednio z wyników Audytu AI. Wynik audytu: ${scorePercentage}%.`,
          source: 'AI Audit Results Direct Call Request',
          timestamp: new Date().toISOString(),
          language: displayLang,
        }),
      }).catch(console.error);

      // Trigger HubSpot Forms Submission client-side for direct callback request
      try {
        const nameParts = name.trim().split(/\s+/);
        const firstname = nameParts[0] || '';
        const lastname = nameParts.slice(1).join(' ') || '';

        const getHubSpotCookie = () => {
          if (typeof document === 'undefined') return '';
          const match = document.cookie.match(/hubspotutk=([^;]+)/);
          return match ? match[1] : '';
        };

        const hsPortalId = '145940599';
        const hsFormId = 'fac0d462-6388-49ef-86ea-a34ee139ddb2';
        const hsUrl = `https://api-eu1.hsforms.com/submissions/v3/integration/submit/${hsPortalId}/${hsFormId}`;

        const hsPayload = {
          fields: [
            { name: 'email', value: email },
            { name: 'firstname', value: firstname },
            { name: 'lastname', value: lastname },
            { name: 'company', value: company || '' },
            { name: 'phone', value: phone || '' },
            { name: 'message', value: `Selected Service: AI Audit Consultation\nMessage: PILNE: Klient zamówił darmową konsultację bezpośrednio z wyników Audytu AI. Wynik audytu: ${scorePercentage}%.` },
            { name: 'description', value: `Selected Service: AI Audit Consultation\nMessage: PILNE: Klient zamówił darmową konsultację bezpośrednio z wyników Audytu AI. Wynik audytu: ${scorePercentage}%.` },
            { name: 'notes', value: `Selected Service: AI Audit Consultation\nMessage: PILNE: Klient zamówił darmową konsultację bezpośrednio z wyników Audytu AI. Wynik audytu: ${scorePercentage}%.` }
          ],
          context: {
            hutk: getHubSpotCookie(),
            pageUri: 'https://ecmdigital.pl/tools/ai-readiness',
            pageName: typeof document !== 'undefined' ? document.title : 'Bezpłatny Audyt Gotowości AI'
          }
        };

        const hsRes = await fetch(hsUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(hsPayload),
        });
        const hsData = await hsRes.json();
        console.log('HubSpot client-side callback response:', hsData);
      } catch (hsClientErr) {
        console.error('HubSpot client-side callback exception:', hsClientErr);
      }

      setCallbackRequested(true);
    } catch (e) {
      console.error(e);
      alert(isPl ? 'Nie udało się wysłać prośby. Skontaktuj się bezpośrednio przez formularz.' : 'Failed to request call. Please use the contact page.');
    } finally {
      setSubmittingCallback(false);
    }
  };

  const getTierDetails = (score: number) => {
    if (score < 35) {
      return {
        name: isPl ? 'Obserwator AI (AI Observer)' : 'AI Observer',
        class: 'text-red-400 bg-red-500/10 border-red-500/20',
        desc: isPl 
          ? 'Twoja firma stawia pierwsze kroki w świecie AI. Procesy są w większości manualne, a dane rozproszone. To idealny moment na zaplanowanie fundamentów wdrożenia AI, co da najszybszy skok wydajności.'
          : 'Your company is taking its first steps in the AI space. Processes are mostly manual and data is scattered. This is the perfect moment to plan the foundations of AI adoption for a fast boost in efficiency.'
      };
    } else if (score >= 35 && score < 75) {
      return {
        name: isPl ? 'Odkrywca AI (AI Explorer)' : 'AI Explorer',
        class: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
        desc: isPl
          ? 'Wykorzystujecie już pojedyncze narzędzia AI i automatyzacje. Dane są częściowo uporządkowane. Kluczem do sukcesu będzie teraz integracja rozproszonych systemów (np. za pomocą n8n) oraz wdrożenie dedykowanych Agentów AI w obsłudze klienta.'
          : 'You are already utilizing single AI tools and automations. Data is partially organized. The key to success now will be integrating scattered systems (e.g., via n8n) and deploying dedicated AI agents for customer support.'
      };
    } else {
      return {
        name: isPl ? 'Lider AI (AI Leader)' : 'AI Leader',
        class: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        desc: isPl
          ? 'Posiadacie wysoki poziom gotowości technicznej. Macie ustrukturyzowane dane i budżety. Jesteście gotowi na wdrożenie zaawansowanych systemów AI, dedykowanych Agentów wspierających core biznesu oraz zaawansowanych integracji RAG.'
          : 'You have a high level of technical readiness. You have structured data and budgets. You are ready to deploy advanced enterprise AI systems, custom core business agents, and complex RAG integrations.'
      };
    }
  };

  const tier = getTierDetails(scorePercentage);
  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const progressPercent = Math.round(((currentQuestionIndex) / QUESTIONS.length) * 100);

  return (
    <div className="lp-wrapper">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeInSlideUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .step-transition-container {
          animation: fadeInSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        .option-button-hover {
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        .option-button-hover:hover {
          transform: translateY(-2px);
          border-color: rgba(59, 130, 246, 0.3) !important;
          background: rgba(59, 130, 246, 0.03) !important;
          box-shadow: 0 4px 20px rgba(59, 130, 246, 0.06) !important;
        }
      ` }} />

      {/* Background glow effects */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)', filter: 'blur(100px)', zIndex: 0, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%)', filter: 'blur(100px)', zIndex: 0, pointerEvents: 'none' }} />

      <Navbar minimal />

      {/* Spacer to push content below the transparent fixed Navbar */}
      <div style={{ height: '130px', flexShrink: 0 }} />

      <main className="container" style={{ padding: '0 24px 80px', display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 10 }}>
        <div style={{ width: '100%', maxWidth: '850px' }}>
          
          {/* INTRO STEP */}
          {step === 'intro' && (
            <div className="step-transition-container" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '750px', margin: '0 auto', padding: '24px 0' }}>
              <div className="premium-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '28px', color: '#60a5fa' }}>
                <Sparkles size={14} style={{ color: '#60a5fa' }} />
                <span>{isPl ? 'Bezpłatny Audyt AI' : 'Free AI Audit'}</span>
              </div>

              <h1 className="hero-title" style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 800, color: 'white', lineHeight: 1.15, marginBottom: '24px', textAlign: 'center' }}>
                {isPl ? 'Audyt Gotowości' : 'AI Readiness'}{' '}
                <span className="premium-text-gradient font-extrabold" style={{ display: 'inline-block' }}>
                  AI
                </span>
              </h1>

              <p className="hero-subtitle" style={{ fontSize: '1.08rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: '44px', maxWidth: '640px', textAlign: 'center' }}>
                {isPl 
                  ? 'Odpowiedz na 12 szybkich pytań i dowiedz się, na ile Twoja firma jest gotowa na wdrożenie sztucznej inteligencji. Na końcu otrzymasz natychmiastowy, spersonalizowany raport z rekomendacjami AI.'
                  : 'Answer 12 quick questions to find out how ready your company is to adopt artificial intelligence. Receive an instant, personalized recommendation report generated by AI.'
                }
              </p>

              {/* High-value bullets */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', width: '100%', textAlign: 'left', marginBottom: '48px' }}>
                {[
                  {
                    icon: <BarChart2 style={{ color: '#60a5fa' }} size={24} />,
                    title: isPl ? 'Kalkulacja gotowości' : 'Readiness score',
                    desc: isPl ? 'Poznasz swój dokładny wynik w procentach i profil gotowości.' : 'Discover your exact score percentage and readiness profile.'
                  },
                  {
                    icon: <Cpu style={{ color: '#a78bfa' }} size={24} />,
                    title: isPl ? 'Rekomendacje AI' : 'AI report',
                    desc: isPl ? 'Spersonalizowana analiza Twojej sytuacji technicznej w 15 sekund.' : 'Personalized technical scenario analysis generated in 15 seconds.'
                  },
                  {
                    icon: <Shield style={{ color: '#34d399' }} size={24} />,
                    title: isPl ? '3 Szybkie Wygrane' : '3 Quick Wins',
                    desc: isPl ? 'Konkretne pomysły automatyzacji, które możesz wdrożyć jutro.' : 'Actionable automation ideas you can deploy in your company tomorrow.'
                  },
                  {
                    icon: <Award style={{ color: '#fb923c' }} size={24} />,
                    title: isPl ? 'Porównanie rynkowe' : 'Market Benchmark',
                    desc: isPl ? 'Zobaczysz, jak Twoje przygotowanie wypada na tle konkurencji z branży.' : 'See how your readiness compares against competitors in your sector.'
                  }
                ].map((item, index) => (
                  <div key={index} className="premium-glass-panel" style={{ padding: '28px', borderRadius: '24px', display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.02)' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                      {item.icon}
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white', marginBottom: '10px' }}>{item.title}</h3>
                    <p style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.55, margin: 0 }}>{item.desc}</p>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <button
                  onClick={handleStartAudit}
                  className="btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '16px 40px', fontSize: '1.05rem', fontWeight: 700, borderRadius: '999px', cursor: 'pointer' }}
                >
                  {isPl ? 'Rozpocznij Audyt' : 'Start Audit'}
                  <ChevronRight size={18} />
                </button>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>
                  {isPl ? 'Czas trwania: ~3 minuty • Bez spamu • Zgodne z RODO' : 'Takes ~3 minutes • No spam • GDPR compliant'}
                </div>
              </div>
            </div>
          )}

          {/* QUESTIONS STEP (WIZARD) */}
          {step === 'questions' && (
            <div className="step-transition-container" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              {/* Stepper Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600, padding: '0 4px' }}>
                <span className="premium-text-gradient" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {currentQuestion.categoryLabel[displayLang]}
                </span>
                <span>
                  {isPl ? 'Pytanie' : 'Question'} {currentQuestionIndex + 1} {isPl ? 'z' : 'of'} {QUESTIONS.length}
                </span>
              </div>

              {/* Progress bar */}
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '99px', overflow: 'hidden' }}>
                <div 
                  style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)', transition: 'width 0.3s ease-out' }}
                />
              </div>

              {/* Question Card */}
              <div key={currentQuestionIndex} className="step-transition-container premium-glass-panel" style={{ padding: 'clamp(24px, 5vw, 44px)', borderRadius: '32px', background: 'rgba(255,255,255,0.02)', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.1rem)', fontWeight: 800, color: 'white', lineHeight: 1.25 }}>
                    {currentQuestion.title[displayLang]}
                  </h2>
                  {currentQuestion.description && (
                    <p style={{ fontSize: '0.98rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5, fontWeight: 500 }}>
                      {currentQuestion.description[displayLang]}
                    </p>
                  )}
                </div>

                {/* Options List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {currentQuestion.options.map((opt, index) => {
                    const isSelected = answers[currentQuestion.id]?.answerText === opt.text[displayLang];
                    return (
                      <button
                        key={index}
                        onClick={() => handleSelectOption(opt)}
                        className="option-button-hover"
                        style={{
                          textAlign: 'left',
                          padding: '20px 24px',
                          borderRadius: '16px',
                          border: isSelected ? '1px solid #3b82f6' : '1px solid rgba(255,255,255,0.06)',
                          background: isSelected ? 'rgba(59, 130, 246, 0.08)' : 'rgba(255,255,255,0.01)',
                          color: isSelected ? '#ffffff' : 'rgba(255,255,255,0.7)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                          fontSize: '1rem',
                          fontWeight: 500,
                          boxShadow: isSelected ? '0 0 20px rgba(59, 130, 246, 0.1)' : 'none',
                        }}
                      >
                        <div style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          border: isSelected ? '6px solid #3b82f6' : '2px solid rgba(255,255,255,0.2)',
                          background: isSelected ? 'white' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          transition: 'all 0.2s ease',
                        }} />
                        <span>{opt.text[displayLang]}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Navigation Bar */}
                <div style={{ display: 'flex', justifyContent: currentQuestionIndex > 0 ? 'space-between' : 'flex-end', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  {currentQuestionIndex > 0 && (
                    <button
                      onClick={handleBack}
                      className="btn-secondary"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '12px', cursor: 'pointer' }}
                    >
                      <ChevronLeft size={16} />
                      {isPl ? 'Wstecz' : 'Back'}
                    </button>
                  )}
                  <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>
                    {isPl ? 'Odpowiedź automatycznie przejdzie dalej' : 'Selecting an option advances automatically'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* LEAD CAPTURE STEP */}
          {step === 'lead' && (
            <div className="step-transition-container" style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '600px', margin: '0 auto' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
                <div className="premium-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', alignSelf: 'center', color: '#10b981', background: 'rgba(16, 185, 129, 0.05)', borderColor: 'rgba(16, 185, 129, 0.1)' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} className="animate-pulse" />
                  <span>{isPl ? 'Krok finałowy' : 'Final Step'}</span>
                </div>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'white', margin: '12px 0 0' }}>
                  {isPl ? 'Gdzie wysłać raport z rekomendacjami?' : 'Where should we send your report?'}
                </h2>
                <p style={{ fontSize: '0.98rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
                  {isPl 
                    ? 'Podaj dane kontaktowe, aby zapisać swoje odpowiedzi. Nasz algorytm przeanalizuje gotowość Twojej firmy w czasie rzeczywistym i wygeneruje spersonalizowane rekomendacje wdrożeń AI.'
                    : 'Provide your contact details to save your answers. Our algorithm will analyze your company readiness in real time and generate personalized AI implementation recommendations.'
                  }
                </p>
              </div>

              <div className="premium-glass-panel" style={{ padding: '36px', borderRadius: '28px', background: 'rgba(255,255,255,0.02)' }}>
                <form onSubmit={handleLeadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Inputs */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {isPl ? 'Imię i nazwisko / Nazwa' : 'Full Name'} *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        style={{ padding: '14px 18px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', color: 'white', outline: 'none', fontSize: '1rem', width: '100%' }}
                        placeholder={isPl ? 'np. Jan Kowalski' : 'e.g. John Doe'}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {isPl ? 'Adres e-mail' : 'Email Address'} *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        style={{ padding: '14px 18px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', color: 'white', outline: 'none', fontSize: '1rem', width: '100%' }}
                        placeholder={isPl ? 'np. jan@firma.pl' : 'e.g. john@company.com'}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {isPl ? 'Numer telefonu' : 'Phone Number'}
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => {
                          setPhone(e.target.value);
                          e.target.setCustomValidity('');
                        }}
                        pattern="[+0-9\s-]{9,20}"
                        title={isPl ? 'Podaj prawidłowy numer telefonu (np. +48 500 600 700)' : 'Please enter a valid phone number (e.g. +1 555 123 456)'}
                        style={{ padding: '14px 18px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', color: 'white', outline: 'none', fontSize: '1rem', width: '100%' }}
                        placeholder={isPl ? 'np. +48 500 600 700' : 'e.g. +1 555 123 456'}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {isPl ? 'Nazwa firmy' : 'Company Name'} *
                      </label>
                      <input
                        type="text"
                        required
                        value={company}
                        onChange={e => setCompany(e.target.value)}
                        style={{ padding: '14px 18px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', color: 'white', outline: 'none', fontSize: '1rem', width: '100%' }}
                        placeholder={isPl ? 'np. Moja Firma Sp. z o.o.' : 'e.g. My Company LLC'}
                      />
                    </div>
                  </div>

                  {/* Checkbox */}
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer', userSelect: 'none', marginTop: '10px' }}>
                    <input
                      type="checkbox"
                      checked={isCallbackChecked}
                      onChange={e => setIsCallbackChecked(e.target.checked)}
                      style={{ marginTop: '4px', cursor: 'pointer', width: '16px', height: '16px', flexShrink: 0 }}
                    />
                    <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.45 }}>
                      {isPl 
                        ? '(Rekomendowane) Chcę bezpłatnie omówić wyniki tego audytu z doradcą ECM Digital podczas 15-minutowej konsultacji.'
                        : '(Recommended) I want to discuss these audit results for free with an ECM Digital consultant during a 15-minute call.'
                      }
                    </span>
                  </label>

                  {/* Buttons */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px' }}>
                    <button
                      type="button"
                      onClick={() => setStep('questions')}
                      className="btn-secondary"
                      style={{ padding: '12px 28px', borderRadius: '12px', cursor: 'pointer' }}
                    >
                      {isPl ? 'Wstecz' : 'Back'}
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                      style={{ padding: '12px 36px', borderRadius: '12px', cursor: 'pointer', fontWeight: 700 }}
                    >
                      {isPl ? 'Wygeneruj Raport' : 'Generate Report'}
                    </button>
                  </div>
                </form>
              </div>

              <div style={{ textAlign: 'center', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentQuestionIndex(QUESTIONS.length - 1);
                    setStep('questions');
                  }}
                  style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', textDecoration: 'underline', fontSize: '0.78rem', cursor: 'pointer' }}
                >
                  {isPl ? 'Wróć do pytań' : 'Back to questions'}
                </button>
              </div>
            </div>
          )}

          {/* LOADING STEP */}
          {step === 'loading' && (
            <div className="step-transition-container premium-glass-panel" style={{ padding: '60px 40px', borderRadius: '32px', background: 'rgba(255,255,255,0.02)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '32px', textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
              <div style={{ position: 'relative', width: '80px', height: '80px' }}>
                <div className="animate-spin" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '50%', border: '4px solid rgba(59, 130, 246, 0.05)', borderTopColor: '#3b82f6' }} />
                <Cpu size={32} style={{ position: 'absolute', top: '24px', left: '24px', color: '#a78bfa' }} className="animate-pulse" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white', margin: 0 }}>
                  {isPl ? 'Analizowanie gotowości AI...' : 'Analyzing AI readiness...'}
                </h2>
                <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.5)', minHeight: '24px', margin: '8px 0 0' }}>
                  {statusMessages[displayLang][loadingMsgIndex]}
                </p>
              </div>
            </div>
          )}

          {/* RESULTS STEP */}
          {step === 'results' && report && (
            <div ref={resultsRef} className="step-transition-container" style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
              
              {/* Top Overview Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
                
                {/* Radial Gauge Card */}
                <div className="premium-glass-panel" style={{ padding: '32px', borderRadius: '28px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', background: 'rgba(255,255,255,0.02)' }}>
                  <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '24px' }}>
                    {isPl ? 'Wynik Gotowości' : 'Readiness Score'}
                  </span>

                  {/* Radial circle representation */}
                  <div style={{ position: 'relative', width: '160px', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                    <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }} viewBox="0 0 100 100">
                      <circle 
                        cx="50" cy="50" r="42" 
                        fill="transparent" 
                        stroke="rgba(255,255,255,0.04)" 
                        strokeWidth="8"
                      />
                      <circle 
                        cx="50" cy="50" r="42" 
                        fill="transparent" 
                        stroke="url(#gradientScore)" 
                        strokeWidth="8"
                        strokeDasharray={263.89}
                        strokeDashoffset={263.89 - (263.89 * animatedScore) / 100}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 0.1s ease-out' }}
                      />
                      <defs>
                        <linearGradient id="gradientScore" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#60a5fa" />
                          <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white' }}>
                        {animatedScore}%
                      </span>
                    </div>
                  </div>

                  {/* Badge */}
                  <div className={tier.class} style={{ padding: '8px 18px', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 800, border: '1px solid currentColor' }}>
                    {tier.name}
                  </div>

                  {/* Social Share Buttons */}
                  <div style={{ display: 'flex', gap: '10px', marginTop: '20px', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
                      {isPl ? 'Udostępnij wynik:' : 'Share score:'}
                    </span>
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://www.ecm-digital.com/tools/ai-readiness')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Share on LinkedIn"
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'rgba(255,255,255,0.6)',
                        textDecoration: 'none',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#0077b5';
                        e.currentTarget.style.color = '#ffffff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                        e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                      }}
                    >
                      in
                    </a>
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                        isPl
                          ? `Mój wynik gotowości AI to ${animatedScore}%! Sprawdź bezpłatnie gotowość technologiczną swojej firmy w audycie od ECM Digital:`
                          : `My AI readiness score is ${animatedScore}%! Check your company's technological readiness for free in the ECM Digital audit:`
                      )}&url=${encodeURIComponent('https://www.ecm-digital.com/tools/ai-readiness')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Share on X"
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'rgba(255,255,255,0.6)',
                        textDecoration: 'none',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#000000';
                        e.currentTarget.style.color = '#ffffff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                        e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                      }}
                    >
                      𝕏
                    </a>
                  </div>
                </div>

                {/* Assessment Summary Card */}
                <div className="premium-glass-panel" style={{ padding: '36px', borderRadius: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
                    <Sparkles style={{ color: '#a78bfa' }} size={16} />
                    <h3 style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', margin: 0 }}>
                      {isPl ? 'Dedykowana Analiza AI' : 'AI Assessment'}
                    </h3>
                  </div>

                  <p style={{ fontSize: '1.05rem', fontWeight: 700, color: 'white', lineHeight: 1.5, marginBottom: '20px' }}>
                    {tier.desc}
                  </p>

                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px' }}>
                    <p style={{ fontSize: '0.94rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, fontStyle: 'italic', margin: 0 }}>
                      "{report.recommendation}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Category Breakdown (Maturity Profile) */}
              <div className="premium-glass-panel" style={{ padding: '36px', borderRadius: '28px', display: 'flex', flexDirection: 'column', gap: '28px', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(96, 165, 250, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(96, 165, 250, 0.15)', color: '#60a5fa' }}>
                    <BarChart2 size={16} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {isPl ? 'Profil Dojrzałości Technologicznej' : 'Technology Maturity Profile'}
                  </h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
                  {getCategoryScores().map((cat, idx) => {
                    const ratio = scorePercentage > 0 ? animatedScore / scorePercentage : 0;
                    
                    // Determine maturity label based on score
                    let statusLabel = isPl ? 'Niska dojrzałość' : 'Low maturity';
                    let statusColor = '#ef4444'; // Red
                    if (cat.score >= 35 && cat.score < 75) {
                      statusLabel = isPl ? 'Średnia dojrzałość' : 'Medium maturity';
                      statusColor = '#f59e0b'; // Amber
                    } else if (cat.score >= 75) {
                      statusLabel = isPl ? 'Wysoka dojrzałość' : 'High maturity';
                      statusColor = '#10b981'; // Green
                    }

                    return (
                      <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '12px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <span style={{ fontSize: '1rem', fontWeight: 700, color: 'white' }}>{cat.name}</span>
                            <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>{cat.desc}</span>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
                            <span style={{ fontSize: '1.15rem', fontWeight: 800, color: cat.color }}>{cat.score}%</span>
                            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: statusColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              {statusLabel}
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar Track */}
                        <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.04)', borderRadius: '99px', overflow: 'hidden' }}>
                          {/* Animated Fill Bar */}
                          <div 
                            style={{ 
                              width: `${Math.max(4, cat.score) * ratio}%`, 
                              height: '100%', 
                              background: cat.color, 
                              borderRadius: '99px',
                              transition: 'width 0.1s ease-out'
                            }} 
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Wins */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
                    <TrendingUp size={16} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {isPl ? 'Rekomendowane Szybkie Wygrane (Quick Wins)' : 'Recommended Quick Wins'}
                  </h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
                  {report.quickWins.map((win, idx) => (
                    <div 
                      key={idx} 
                      className="premium-glass-panel" 
                      style={{ padding: '24px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(255,255,255,0.01)', position: 'relative' }}
                    >
                      <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'linear-gradient(to bottom, #34d399, #059669)', opacity: 0.6 }} />
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.05)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800 }}>
                        0{idx + 1}
                      </div>
                      <p style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600, lineHeight: 1.5, margin: 0 }}>
                        {win}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggested Services */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>
                    <Cpu size={16} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {isPl ? 'Sugerowane rozwiązania od ECM Digital' : 'Suggested Solutions by ECM Digital'}
                  </h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                  {report.suggestedServices.map((service, idx) => (
                    <div 
                      key={idx} 
                      className="premium-glass-panel" 
                      style={{
                        padding: '28px',
                        borderRadius: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '24px',
                        background: 'rgba(255,255,255,0.02)',
                        border: service.priority === 'high' ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid rgba(255,255,255,0.05)',
                        boxShadow: service.priority === 'high' ? '0 0 15px rgba(59, 130, 246, 0.05)' : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '1.5rem' }}>{service.emoji}</span>
                            <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'white', margin: 0 }}>
                              {service.name}
                            </h4>
                          </div>
                          
                          {/* Priority badge */}
                          <span style={{
                            padding: '4px 10px',
                            borderRadius: '999px',
                            fontSize: '0.65rem',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            border: '1px solid currentColor',
                            color: service.priority === 'high' 
                              ? '#f87171' 
                              : service.priority === 'medium' 
                              ? '#fbbf24' 
                              : 'rgba(255,255,255,0.4)',
                            background: service.priority === 'high' 
                              ? 'rgba(239, 68, 68, 0.08)' 
                              : service.priority === 'medium' 
                              ? 'rgba(245, 158, 11, 0.08)' 
                              : 'rgba(255,255,255,0.03)',
                          }}>
                            {isPl 
                              ? (service.priority === 'high' ? 'Wysoki' : service.priority === 'medium' ? 'Średni' : 'Niski') 
                              : service.priority}
                          </span>
                        </div>
                        
                        <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.55, margin: 0, fontWeight: 500 }}>
                          {service.reason}
                        </p>
                      </div>

                      {/* Go to services button link */}
                      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
                        <a 
                          href="/#services" 
                          style={{ fontSize: '0.78rem', color: '#60a5fa', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
                        >
                          {isPl ? 'Szczegóły usługi' : 'Service details'}
                          <ChevronRight size={12} />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Consultation Callback Section */}
              <div 
                className="premium-glass-panel" 
                style={{
                  background: 'linear-gradient(145deg, rgba(59, 130, 246, 0.08) 0%, rgba(139, 92, 246, 0.03) 100%)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '32px',
                  padding: '48px 32px',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  marginTop: '16px',
                  boxShadow: '0 0 40px rgba(59, 130, 246, 0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '24px'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', maxWidth: '640px', margin: '0 auto' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(59, 130, 246, 0.2)', fontSize: '1.4rem' }}>
                    📞
                  </div>

                  <h3 className="hero-title" style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {isPl ? 'Chcesz wdrożyć te rekomendacje?' : 'Ready to implement these tips?'}
                  </h3>

                  <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.55, margin: 0, fontWeight: 500 }}>
                    {isPl 
                      ? 'Umów darmową, 15-minutową konsultację wideo. Przeanalizujemy Twoje wąskie gardła i podpowiemy, jak najtaniej i najszybciej uruchomić Agenta AI lub automatyzację.'
                      : 'Schedule a free 15-minute discovery call. We will analyze your operational bottlenecks and guide you on how to start saving time with AI agents and automations.'
                    }
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  {callbackRequested ? (
                    <div style={{ padding: '16px 28px', borderRadius: '16px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.15)', color: '#34d399', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem' }}>
                      <CheckCircle2 size={18} />
                      <span>
                        {isPl 
                          ? 'Prośba wysłana! Skontaktujemy się w ciągu 24h.' 
                          : 'Request received! We will contact you within 24 hours.'
                        }
                      </span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
                      <button
                        onClick={handleRequestCallbackDirect}
                        disabled={submittingCallback}
                        className="btn-primary"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 32px', fontSize: '0.95rem', borderRadius: '999px', cursor: 'pointer', fontWeight: 700 }}
                      >
                        {submittingCallback ? (
                          <>
                            <RefreshCw size={14} className="animate-spin" />
                            <span>{isPl ? 'Zapisywanie...' : 'Saving...'}</span>
                          </>
                        ) : (
                          <>
                            <span>{isPl ? 'Zamawiam darmową konsultację' : 'Book my free consultation'}</span>
                            <ChevronRight size={14} />
                          </>
                        )}
                      </button>

                      <a
                        href="/#contact"
                        className="btn-secondary"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 32px', fontSize: '0.95rem', borderRadius: '999px', cursor: 'pointer', textDecoration: 'none' }}
                      >
                        {isPl ? 'Napisz wiadomość' : 'Send message'}
                      </a>
                    </div>
                  )}

                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginTop: '4px' }}>
                    {isPl 
                      ? 'Nasz doradca oddzwoni na podany numer telefonu lub wyśle zaproszenie na Google Meet.' 
                      : 'Our representative will call your number or send a calendar invitation for Google Meet.'
                    }
                  </div>
                </div>
              </div>

              {/* Repeat test options */}
              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <button
                  onClick={handleStartAudit}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255,255,255,0.4)',
                    textDecoration: 'underline',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <RefreshCw size={12} />
                  <span>{isPl ? 'Rozpocznij audyt od nowa' : 'Restart audit from scratch'}</span>
                </button>
              </div>

            </div>
          )}

        </div>
      </main>
      {/* Minimal Landing Page Footer */}
      <footer style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', padding: '24px 0', textAlign: 'center', fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.4)', zIndex: 10, position: 'relative' }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
          <div>© {new Date().getFullYear()} ECM Digital. Wszelkie prawa zastrzeżone.</div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <a href="/privacy" style={{ color: 'rgba(255, 255, 255, 0.4)', textDecoration: 'underline' }}>{isPl ? 'Polityka Prywatności' : 'Privacy Policy'}</a>
            <a href="/terms" style={{ color: 'rgba(255, 255, 255, 0.4)', textDecoration: 'underline' }}>{isPl ? 'Regulamin' : 'Terms of Service'}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
