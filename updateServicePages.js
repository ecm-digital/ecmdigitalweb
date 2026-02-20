const fs = require('fs');
const content = fs.readFileSync('src/app/services/serviceData.ts', 'utf8');

const updatedContent = content.replace(
    /'mvp': {/g,
    `'ai-executive': {
        slug: 'ai-executive',
        icon: '💼',
        gradient: 'linear-gradient(135deg, #FF2D55, #ff5e7e)',
        features: ['features.1', 'features.2', 'features.3', 'features.4', 'features.5', 'features.6'],
        techs: ['Private LLM', 'LangChain', 'Custom RAG', 'Ollama', 'Security', 'ERP Integration'],
        price: 'price',
    },
    'edu': {
        slug: 'edu',
        icon: '🎓',
        gradient: 'linear-gradient(135deg, #30D158, #59df7a)',
        features: ['features.1', 'features.2', 'features.3', 'features.4', 'features.5', 'features.6'],
        techs: ['ChatGPT', 'Claude', 'Midjourney', 'Zapier', 'Canva AI', 'Prompt Engineering'],
        price: 'price',
    },
    'mvp': {`
);

fs.writeFileSync('src/app/services/serviceData.ts', updatedContent);
console.log('Updated serviceData.ts');

const translationsPath = 'src/app/services/serviceTranslations.ts';
let transContent = fs.readFileSync(translationsPath, 'utf8');

const plTrans = `
        // AI Executive
        'ai-executive.title': 'AI Executive',
        'ai-executive.subtitle': 'Prywatna instancja AI dla zarządu. Pełny kontekst firmy i wsparcie decyzyjne 24/7.',
        'ai-executive.long': 'Twój osobisty, cyfrowy doradca. Wdrażamy zamknięte modele AI działające on-premise lub w prywatnej chmurze. System przetwarza poufne dane finansowe i operacyjne, pomagając w kluczowych decyzjach strategicznych.',
        'ai-executive.features.1': 'Prywatna instancja LLM (bezpieczeństwo danych)',
        'ai-executive.features.2': 'Pełne szyfrowanie end-to-end',
        'ai-executive.features.3': 'Integracja z ERP, CRM i Slackiem',
        'ai-executive.features.4': 'Własna, dedykowana baza wiedzy (Custom RAG)',
        'ai-executive.features.5': 'Błyskawiczne raportowanie wyników fiansowych',
        'ai-executive.features.6': 'Symulacje scenariuszy biznesowych (co-jeśli)',
        'ai-executive.price': 'Wycena Indywidualna',

        // Edukacja
        'edu.title': 'Edukacja i Wdrożenia AI',
        'edu.subtitle': 'Praktyczne szkolenia z AI i warsztaty dla Twojego zespołu.',
        'edu.long': 'Technologia to tylko połowa sukcesu. Szkolimy Twój zespół, aby w pełni wykorzystał potencjał nowych narzędzi. Przełamujemy opór przed zmianą i uczymy inżynierii promptów, by pracownicy natychmiast zwiększyli swoją produktywność.',
        'edu.features.1': 'Wstęp do Generative AI dla firm',
        'edu.features.2': 'Praktyczne warsztaty Prompt Engineeringu',
        'edu.features.3': 'Analiza Use-Cases specyficznych dla branży',
        'edu.features.4': 'Strategie Change Management (zarządzanie zmianą)',
        'edu.features.5': 'Konsultacje 1:1 dla liderów zespołu',
        'edu.features.6': 'Program certyfikacji (Akademia Wdrożeniowa)',
        'edu.price': 'od 3 500 PLN',
`;

const enTrans = `
        'ai-executive.title': 'AI Executive',
        'ai-executive.subtitle': 'Private AI instance for the board. Full company context and 24/7 decision support.',
        'ai-executive.long': 'Your personal digital advisor. We implement closed AI models operating on-premise or in a private cloud. The system processes confidential financial and operational data, helping with key strategic decisions.',
        'ai-executive.features.1': 'Private LLM instance (data security)',
        'ai-executive.features.2': 'Full end-to-end encryption',
        'ai-executive.features.3': 'Integration with ERP, CRM, and Slack',
        'ai-executive.features.4': 'Custom Knowledge Base (RAG)',
        'ai-executive.features.5': 'Instant financial reporting',
        'ai-executive.features.6': 'Business scenario simulations (what-if)',
        'ai-executive.price': 'Custom Pricing',

        'edu.title': 'AI Education & Implementation',
        'edu.subtitle': 'Practical AI training and workshops for your team.',
        'edu.long': 'Technology is only half the battle. We train your team to fully utilize the potential of new tools. We overcome resistance to change and teach prompt engineering so employees immediately boost their productivity.',
        'edu.features.1': 'Intro to Generative AI for business',
        'edu.features.2': 'Practical Prompt Engineering workshops',
        'edu.features.3': 'Industry-specific Use-Cases analysis',
        'edu.features.4': 'Change Management strategies',
        'edu.features.5': '1:1 consultations for team leaders',
        'edu.features.6': 'Certification program (Implementation Academy)',
        'edu.price': 'from 800 EUR',
`;

const deTrans = `
        'ai-executive.title': 'AI Executive',
        'ai-executive.subtitle': 'Private KI-Instanz für den Vorstand. Voller Unternehmenskontext und 24/7-Entscheidungsunterstützung.',
        'ai-executive.long': 'Ihr persönlicher digitaler Berater. Wir implementieren geschlossene KI-Modelle, die on-premise oder in einer privaten Cloud arbeiten.',
        'ai-executive.features.1': 'Private LLM-Instanz (Datensicherheit)',
        'ai-executive.features.2': 'Vollständige Ende-zu-Ende-Verschlüsselung',
        'ai-executive.features.3': 'Integration mit ERP, CRM und Slack',
        'ai-executive.features.4': 'Eigene dedizierte Wissensdatenbank (Custom RAG)',
        'ai-executive.features.5': 'Sofortiges Finanzreporting',
        'ai-executive.features.6': 'Simulation von Geschäftsszenarien',
        'ai-executive.price': 'Individuelle Preise',

        'edu.title': 'KI-Bildung & Implementierung',
        'edu.subtitle': 'Praktische KI-Schulungen und Workshops für Ihr Team.',
        'edu.long': 'Technologie ist nur die halbe Miete. Wir schulen Ihr Team, um das volle Potenzial neuer Werkzeuge zu nutzen. Wir überwinden Veränderungsängste und unterrichten Prompt Engineering.',
        'edu.features.1': 'Einführung in Generative KI für Unternehmen',
        'edu.features.2': 'Praktische Prompt-Engineering-Workshops',
        'edu.features.3': 'Branchenspezifische Anwendungsfallanalyse',
        'edu.features.4': 'Change-Management-Strategien',
        'edu.features.5': '1:1 Beratungen für Teamleiter',
        'edu.features.6': 'Zertifizierungsprogramm',
        'edu.price': 'ab 800 EUR',
`;

transContent = transContent.replace(/([ \t]+)\/\/ MVP\n/g, plTrans + "\n$1// MVP\n");
transContent = transContent.replace(/([ \t]+)'mvp\.title': 'MVP Prototypes',\n/g, enTrans + "\n$1'mvp.title': 'MVP Prototypes',\n");
transContent = transContent.replace(/([ \t]+)'mvp\.title': 'MVP Prototypen',\n/g, deTrans + "\n$1'mvp.title': 'MVP Prototypen',\n");

// Also update automation translated texts for PL
transContent = transContent.replace(
    /'automation\.title': 'Automatyzacja N8N',/,
    "'automation.title': 'Softwaryzacja & Automatyzacja',"
);
transContent = transContent.replace(
    /'automation\.subtitle': 'Oszczędzaj 15–20h tygodniowo\. Integracje systemów, workflow automation i eliminacja powtarzalnych zadań\.',/,
    "'automation.subtitle': 'Model 80/20. Łączymy dedykowane oprogramowanie z automatyzacją AI. Budujemy narzędzia, które oszczędzają czas i eliminują błędy.',"
);
transContent = transContent.replace(
    /'automation\.long': 'Automatyzujemy procesy biznesowe za pomocą N8N, Zapier i Make\. Integrujemy systemy, synchronizujemy dane i eliminujemy ręczną pracę\. Każda automatyzacja to oszczędność czasu i redukcja błędów\.',/,
    "'automation.long': '80% solidnej inżynierii oporgramowania, 20% nowoczesnych modeli AI. Tworzymy stabilne aplikacje, API i dashboardy, a za pomocą N8N i warstwy LLM dodajemy do nich inteligencję.',"
);

fs.writeFileSync(translationsPath, transContent);
console.log('Updated serviceTranslations.ts');
