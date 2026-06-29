import { NextResponse } from 'next/server';

function getFallbackReport(isPl: boolean) {
  return {
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
}

export async function POST(req: Request) {
  try {
    const { answers, lang = 'pl' } = await req.json();

    if (!answers || Object.keys(answers).length === 0) {
      return NextResponse.json({ error: 'Answers are required' }, { status: 400 });
    }

    const isPl = lang === 'pl' || lang === 'szl';
    const API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!API_KEY) {
      console.warn('GEMINI_API_KEY is missing, returning fallback report.');
      return NextResponse.json(getFallbackReport(isPl));
    }

    // Format the answers for the LLM
    let formattedAnswers = '';
    Object.entries(answers).forEach(([key, val]: [string, any]) => {
      formattedAnswers += `- **${val.question}**: ${val.answerText} (Ocena: ${val.score}/4)\n`;
    });

    const responseLang = isPl ? 'Polish' : 'English';

    const prompt = `Jesteś doświadczonym dyrektorem ds. technologii (CTO) i doradcą ds. sztucznej inteligencji w agencji interaktywnej ECM Digital.
Przeanalizuj poniższe odpowiedzi z audytu gotowości AI (AI Readiness Audit) wypełnionego przez firmę i przygotuj spersonalizowaną analizę oraz rekomendacje.

Odpowiedzi firmy:
${formattedAnswers}

Wymagania dotyczące odpowiedzi:
1. Odpowiedz w języku: **${responseLang}**.
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
Zwróć TYLKO poprawny obiekt JSON.`;

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

    const response = await fetch(API_URL, {
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

    if (!response.ok) {
      console.warn('Gemini API returned error status, fallback used:', response.status);
      return NextResponse.json(getFallbackReport(isPl));
    }

    const data = await response.json();
    let responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    responseText = responseText.trim();

    // Clean up markdown block wraps if the model returned them anyway
    if (responseText.startsWith('```json')) {
      responseText = responseText.substring(7);
    }
    if (responseText.endsWith('```')) {
      responseText = responseText.substring(0, responseText.length - 3);
    }
    responseText = responseText.trim();

    try {
      const parsedResult = JSON.parse(responseText);
      return NextResponse.json(parsedResult);
    } catch (parseError) {
      console.error('Failed to parse Gemini response as JSON. Raw text:', responseText);
      return NextResponse.json(getFallbackReport(isPl));
    }
  } catch (error) {
    console.error('AI Audit endpoint error, returning fallback:', error);
    const { lang = 'pl' } = await req.clone().json().catch(() => ({}));
    return NextResponse.json(getFallbackReport(lang === 'pl' || lang === 'szl'));
  }
}
