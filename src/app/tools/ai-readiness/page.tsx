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
    'Finalizowanie analizy z udziałem Gemini AI...'
  ],
  en: [
    'Evaluating technological maturity...',
    'Analyzing data structures...',
    'Identifying bottlenecks in processes...',
    'Verifying automation suitability...',
    'Modeling AI Agent deployment potential...',
    'Structuring strategic report...',
    'Finalizing analysis with Gemini AI...'
  ]
};

export default function AIReadinessAuditPage() {
  const { lang } = useLanguage();
  const isPl = lang === 'pl' || lang === 'szl';
  const displayLang = isPl ? 'pl' : 'en';

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

    calculateScore();
    setStep('loading');

    try {
      // 1. Submit answers to backend endpoint calling Gemini
      const response = await fetch('/api/ai/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, lang: displayLang }),
      });

      if (!response.ok) throw new Error('Failed to generate report');
      const data = (await response.json()) as AnalysisResponse;
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

      // 4. Trigger n8n Webhook
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
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
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
    <div className="min-h-screen bg-[#05060f] text-white flex flex-col font-sans relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />

      <Navbar />

      {/* Spacer to push content below the transparent fixed Navbar */}
      <div className="h-24 md:h-32 flex-shrink-0" />

      <main className="flex-grow flex justify-center pt-8 md:pt-12 pb-16 px-4 z-10">
        <div className="w-full max-w-4xl">
          
          {/* INTRO STEP */}
          {step === 'intro' && (
            <div className="text-center space-y-8 max-w-3xl mx-auto py-12">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-xs font-bold uppercase tracking-widest animate-pulse mx-auto">
                <Sparkles size={14} className="text-blue-400" />
                <span className="text-blue-400">{isPl ? 'Bezpłatny Audyt AI' : 'Free AI Audit'}</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-black font-space-grotesk tracking-tight uppercase italic leading-tight">
                {isPl ? 'Audyt Gotowości' : 'AI Readiness'}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-500">
                  AI
                </span>
              </h1>

              <p className="text-gray-400 text-lg md:text-xl font-medium leading-relaxed">
                {isPl 
                  ? 'Odpowiedz na 12 szybkich pytań i dowiedz się, na ile Twoja firma jest gotowa na wdrożenie sztucznej inteligencji. Na końcu otrzymasz natychmiastowy, spersonalizowany raport z rekomendacjami od Gemini AI.'
                  : 'Answer 12 quick questions to find out how ready your company is to adopt artificial intelligence. Receive an instant, personalized recommendation report generated by Gemini AI.'
                }
              </p>

              {/* High-value bullets */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 text-left">
                {[
                  {
                    icon: <BarChart2 className="text-blue-400" size={24} />,
                    title: isPl ? 'Kalkulacja gotowości' : 'Readiness score',
                    desc: isPl ? 'Poznasz swój dokładny wynik w procentach i profil gotowości.' : 'Discover your exact score percentage and readiness profile.'
                  },
                  {
                    icon: <Cpu className="text-violet-400" size={24} />,
                    title: isPl ? 'Rekomendacje Gemini AI' : 'Gemini AI report',
                    desc: isPl ? 'Spersonalizowana analiza Twojej sytuacji technicznej w 15 sekund.' : 'Personalized technical scenario analysis generated in 15 seconds.'
                  },
                  {
                    icon: <Shield className="text-emerald-400" size={24} />,
                    title: isPl ? '3 Szybkie Wygrane' : '3 Quick Wins',
                    desc: isPl ? 'Konkretne pomysły automatyzacji, które możesz wdrożyć jutro.' : 'Actionable automation ideas you can deploy in your company tomorrow.'
                  }
                ].map((item, index) => (
                  <div key={index} className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl hover:border-white/10 transition-all hover:-translate-y-1">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center mb-4">
                      {item.icon}
                    </div>
                    <h3 className="font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="pt-8">
                <button
                  onClick={handleStartAudit}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 text-white font-bold rounded-2xl shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all hover:scale-[1.03] active:scale-[0.98] inline-flex items-center gap-3 text-lg"
                >
                  {isPl ? 'Rozpocznij Audyt' : 'Start Audit'}
                  <ChevronRight size={20} />
                </button>
                <div className="text-gray-600 text-xs mt-3">
                  {isPl ? 'Czas trwania: ~3 minuty • Bez spamu • Zgodne z RODO' : 'Takes ~3 minutes • No spam • GDPR compliant'}
                </div>
              </div>
            </div>
          )}

          {/* QUESTIONS STEP (WIZARD) */}
          {step === 'questions' && (
            <div className="space-y-6">
              {/* Stepper Header */}
              <div className="flex items-center justify-between text-xs text-gray-500 font-semibold px-1">
                <span className="uppercase tracking-widest text-blue-400">
                  {currentQuestion.categoryLabel[displayLang]}
                </span>
                <span>
                  {isPl ? 'Pytanie' : 'Question'} {currentQuestionIndex + 1} {isPl ? 'z' : 'of'} {QUESTIONS.length}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-violet-500 h-full transition-all duration-300 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Question Card */}
              <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl backdrop-blur-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

                <div className="space-y-4 mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold font-space-grotesk tracking-tight text-white leading-snug">
                    {currentQuestion.title[displayLang]}
                  </h2>
                  {currentQuestion.description && (
                    <p className="text-gray-400 text-sm md:text-base font-medium">
                      {currentQuestion.description[displayLang]}
                    </p>
                  )}
                </div>

                {/* Options Grid */}
                <div className="grid grid-cols-1 gap-4">
                  {currentQuestion.options.map((opt, index) => {
                    const isSelected = answers[currentQuestion.id]?.answerText === opt.text[displayLang];
                    return (
                      <button
                        key={index}
                        onClick={() => handleSelectOption(opt)}
                        className={`text-left p-5 rounded-2xl border transition-all duration-200 ${
                          isSelected
                            ? 'bg-blue-600/10 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.15)] text-white'
                            : 'bg-white/[0.01] border-white/5 hover:border-white/20 hover:bg-white/[0.03] text-gray-300 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold transition-all ${
                            isSelected 
                              ? 'border-blue-500 bg-blue-500 text-white' 
                              : 'border-white/20 text-gray-500'
                          }`}>
                            {isSelected ? '✓' : String.fromCharCode(65 + index)}
                          </div>
                          <span className="font-semibold text-sm md:text-base leading-relaxed">
                            {opt.text[displayLang]}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Back button */}
                <div className="flex justify-between items-center mt-10 pt-6 border-t border-white/5">
                  <button
                    onClick={handleBack}
                    className="px-5 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all text-sm font-semibold inline-flex items-center gap-2"
                  >
                    <ChevronLeft size={16} />
                    {isPl ? 'Wstecz' : 'Back'}
                  </button>
                  <div className="text-xs text-gray-600 font-bold">
                    ECM DIGITAL AUDIT SYSTEM
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LEAD CAPTURE STEP */}
          {step === 'lead' && (
            <div className="max-w-xl mx-auto space-y-6">
              <div className="text-center space-y-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                  <Lock size={20} />
                </div>
                <h2 className="text-3xl font-bold font-space-grotesk tracking-tight uppercase">
                  {isPl ? 'Twój Audyt jest gotowy!' : 'Your Audit is Ready!'}
                </h2>
                <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-md mx-auto">
                  {isPl 
                    ? 'Wprowadź swoje dane kontaktowe, aby zapisać wyniki w panelu i odblokować szczegółowy raport oraz analizę Gemini AI.'
                    : 'Enter your contact details to save the results in our panel and unlock the detailed Gemini AI report.'
                  }
                </p>
              </div>

              {/* Lead Form */}
              <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-md">
                <form onSubmit={handleLeadSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="lead-name" className="block text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">
                      {isPl ? 'Imię i Nazwisko / Nazwa' : 'Full Name'} *
                    </label>
                    <input
                      id="lead-name"
                      type="text"
                      required
                      placeholder={isPl ? 'np. Jan Kowalski' : 'e.g. John Doe'}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none transition-all text-white placeholder-gray-600"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="lead-email" className="block text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">
                        {isPl ? 'Adres E-mail' : 'Email Address'} *
                      </label>
                      <input
                        id="lead-email"
                        type="email"
                        required
                        placeholder="nazwa@firma.pl"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none transition-all text-white placeholder-gray-600"
                      />
                    </div>
                    <div>
                      <label htmlFor="lead-phone" className="block text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">
                        {isPl ? 'Numer Telefonu' : 'Phone Number'}
                      </label>
                      <input
                        id="lead-phone"
                        type="tel"
                        placeholder="+48 123 456 789"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none transition-all text-white placeholder-gray-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="lead-company" className="block text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">
                      {isPl ? 'Nazwa Firmy' : 'Company Name'}
                    </label>
                    <input
                      id="lead-company"
                      type="text"
                      placeholder={isPl ? 'Nazwa Twojej działalności' : 'Your Business Name'}
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none transition-all text-white placeholder-gray-600"
                    />
                  </div>

                  {/* Consultation Opt-in */}
                  <div className="pt-2">
                    <label className="flex items-start gap-3 cursor-pointer text-gray-400 hover:text-white select-none">
                      <input
                        type="checkbox"
                        checked={isCallbackChecked}
                        onChange={(e) => setIsCallbackChecked(e.target.checked)}
                        className="mt-1 w-4 h-4 rounded border-white/10 bg-white/5 text-blue-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                      />
                      <span className="text-xs font-semibold leading-relaxed">
                        {isPl
                          ? '(Rekomendowane) Chcę bezpłatnie omówić wyniki tego audytu z doradcą ECM Digital podczas 15-minutowej konsultacji.'
                          : '(Recommended) I want to discuss these audit results for free with an ECM Digital consultant during a 15-minute call.'
                        }
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.2)] transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 mt-4 text-base"
                  >
                    {isPl ? 'Generuj Mój Raport AI' : 'Generate My AI Report'}
                    <Send size={18} />
                  </button>

                  <div className="text-[10px] text-gray-600 text-center leading-relaxed mt-4">
                    {isPl 
                      ? 'Klikając przycisk wyrażasz zgodę na przetwarzanie danych osobowych w celu przygotowania oferty. Twoje dane są w pełni bezpieczne i nie zostaną nikomu przekazane.'
                      : 'By clicking, you consent to processing personal data for the purpose of preparing an offer. Your data is secure and will never be shared.'
                    }
                  </div>
                </form>
              </div>

              {/* Back Button */}
              <div className="text-center">
                <button
                  onClick={() => {
                    setCurrentQuestionIndex(QUESTIONS.length - 1);
                    setStep('questions');
                  }}
                  className="text-xs text-gray-500 hover:text-white font-semibold underline"
                >
                  {isPl ? 'Wróć do pytań' : 'Back to questions'}
                </button>
              </div>
            </div>
          )}

          {/* LOADING STEP */}
          {step === 'loading' && (
            <div className="text-center py-20 space-y-8 max-w-md mx-auto">
              {/* Spinner */}
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-white/5" />
                <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-violet-500 animate-spin" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400 font-bold text-xs">
                  AI
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-bold font-space-grotesk uppercase tracking-wider text-white">
                  {isPl ? 'Przetwarzanie danych...' : 'Processing data...'}
                </h3>
                <p className="text-blue-400 text-sm font-semibold min-h-[20px] transition-all duration-300">
                  {statusMessages[displayLang][loadingMsgIndex]}
                </p>
              </div>
            </div>
          )}

          {/* RESULTS STEP */}
          {step === 'results' && report && (
            <div ref={resultsRef} className="space-y-10 animate-fade-in">
              
              {/* Top Overview Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Radial Gauge Card */}
                <div className="lg:col-span-4 bg-white/[0.02] border border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden backdrop-blur-md">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
                  
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-4">
                    {isPl ? 'Wynik Gotowości' : 'Readiness Score'}
                  </span>

                  {/* Radial circle representation */}
                  <div className="relative w-40 h-40 flex items-center justify-center mb-4">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      {/* Gray track */}
                      <circle 
                        cx="50" cy="50" r="42" 
                        fill="transparent" 
                        stroke="rgba(255,255,255,0.05)" 
                        strokeWidth="8"
                      />
                      {/* Gradient fill */}
                      <circle 
                        cx="50" cy="50" r="42" 
                        fill="transparent" 
                        stroke="url(#gradientScore)" 
                        strokeWidth="8"
                        strokeDasharray={263.89}
                        strokeDashoffset={263.89 - (263.89 * scorePercentage) / 100}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                      />
                      <defs>
                        <linearGradient id="gradientScore" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#60a5fa" />
                          <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-4xl md:text-5xl font-black font-space-grotesk text-white">
                        {scorePercentage}%
                      </span>
                    </div>
                  </div>

                  {/* Badge */}
                  <div className={`px-4 py-1.5 rounded-full border text-xs font-bold ${tier.class}`}>
                    {tier.name}
                  </div>
                </div>

                {/* Assessment Summary Card */}
                <div className="lg:col-span-8 bg-white/[0.02] border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col justify-center relative overflow-hidden backdrop-blur-md">
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="text-violet-400 animate-pulse" size={18} />
                    <h3 className="text-xs text-gray-500 font-bold uppercase tracking-[0.2em]">
                      {isPl ? 'Ewaluacja Gemini AI' : 'Gemini AI Assessment'}
                    </h3>
                  </div>

                  <p className="text-gray-300 font-semibold text-sm md:text-base leading-relaxed mb-4">
                    {tier.desc}
                  </p>

                  <div className="border-t border-white/5 pt-4">
                    <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line italic">
                      "{report.recommendation}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Wins (Szybkie Wygrane) */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-400">
                    <TrendingUp size={16} />
                  </div>
                  <h3 className="text-lg font-bold font-space-grotesk tracking-wide uppercase">
                    {isPl ? 'Rekomendowane Szybkie Wygrane (Quick Wins)' : 'Recommended Quick Wins'}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {report.quickWins.map((win, idx) => (
                    <div 
                      key={idx} 
                      className="bg-white/[0.01] border border-white/5 p-6 rounded-2xl flex flex-col gap-3 relative overflow-hidden group hover:border-white/10 transition-all"
                    >
                      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-500 to-teal-500 opacity-60" />
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs font-bold">
                        0{idx + 1}
                      </div>
                      <p className="text-gray-300 text-sm font-semibold leading-relaxed">
                        {win}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Services */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-400">
                    <Cpu size={16} />
                  </div>
                  <h3 className="text-lg font-bold font-space-grotesk tracking-wide uppercase">
                    {isPl ? 'Sugerowane rozwiązania od ECM Digital' : 'Suggested Solutions by ECM Digital'}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {report.suggestedServices.map((service, idx) => (
                    <div 
                      key={idx} 
                      className={`bg-white/[0.02] border rounded-2xl p-6 flex flex-col justify-between group hover:-translate-y-1 transition-all ${
                        service.priority === 'high' 
                          ? 'border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.05)]' 
                          : 'border-white/5'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{service.emoji}</span>
                            <h4 className="font-bold text-white text-base md:text-lg">
                              {service.name}
                            </h4>
                          </div>
                          
                          {/* Priority badge */}
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                            service.priority === 'high'
                              ? 'text-red-400 bg-red-500/10 border-red-500/20'
                              : service.priority === 'medium'
                              ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                              : 'text-gray-400 bg-white/5 border-white/10'
                          }`}>
                            {isPl 
                              ? (service.priority === 'high' ? 'Priorytet: Wysoki' : service.priority === 'medium' ? 'Priorytet: Średni' : 'Priorytet: Niski') 
                              : `Priority: ${service.priority}`}
                          </span>
                        </div>
                        
                        <p className="text-gray-400 text-sm leading-relaxed font-medium">
                          {service.reason}
                        </p>
                      </div>

                      {/* Go to services button link */}
                      <div className="pt-6">
                        <a 
                          href="/#services" 
                          className="text-xs text-blue-400 group-hover:text-blue-300 font-bold inline-flex items-center gap-1 hover:underline"
                        >
                          {isPl ? 'Szczegóły usługi' : 'Service details'}
                          <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Consultation Callback Section */}
              <div className="bg-gradient-to-br from-blue-600/10 via-violet-600/5 to-transparent border border-blue-500/30 rounded-3xl p-6 md:p-10 text-center relative overflow-hidden mt-8 shadow-[0_0_40px_rgba(59,130,246,0.1)]">
                <div className="absolute inset-0 bg-blue-500/[0.02] mix-blend-color-dodge pointer-events-none" />

                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/15 text-blue-400 flex items-center justify-center mx-auto mb-4 border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
                    <PhoneCall size={22} className="animate-bounce" />
                  </div>

                  <h3 className="text-2xl md:text-3xl font-black font-space-grotesk tracking-tight uppercase">
                    {isPl ? 'Chcesz wdrożyć te rekomendacje?' : 'Ready to implement these tips?'}
                  </h3>

                  <p className="text-gray-400 text-sm md:text-base font-semibold leading-relaxed max-w-lg mx-auto">
                    {isPl 
                      ? 'Umów darmową, 15-minutową konsultację wideo. Przeanalizujemy Twoje wąskie gardła i podpowiemy, jak najtaniej i najszybciej uruchomić Agenta AI lub automatyzację.'
                      : 'Schedule a free 15-minute discovery call. We will analyze your operational bottlenecks and guide you on how to start saving time with AI agents and automations.'
                    }
                  </p>

                  <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
                    {callbackRequested ? (
                      <div className="px-6 py-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold rounded-2xl flex items-center gap-2 max-w-md mx-auto">
                        <CheckCircle2 size={20} />
                        <span>
                          {isPl 
                            ? 'Prośba wysłana! Konsultant skontaktuje się z Tobą w ciągu 24h.' 
                            : 'Request received! A consultant will contact you within 24 hours.'
                          }
                        </span>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={handleRequestCallbackDirect}
                          disabled={submittingCallback}
                          className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-2xl shadow-[0_0_30px_rgba(59,130,246,0.25)] transition-all hover:scale-[1.03] active:scale-[0.98] inline-flex items-center gap-3 text-base"
                        >
                          {submittingCallback ? (
                            <>
                              <RefreshCw size={18} className="animate-spin" />
                              {isPl ? 'Zapisywanie...' : 'Saving...'}
                            </>
                          ) : (
                            <>
                              <PhoneCall size={18} />
                              {isPl ? 'Zamawiam darmową konsultację' : 'Book my free consultation'}
                            </>
                          )}
                        </button>

                        <a
                          href="/#contact"
                          className="px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-semibold rounded-2xl transition-all"
                        >
                          {isPl ? 'Napisz wiadomość' : 'Send message'}
                        </a>
                      </>
                    )}
                  </div>

                  <div className="text-[10px] text-gray-600 leading-normal max-w-sm mx-auto">
                    {isPl 
                      ? 'Nasz doradca oddzwoni na podany numer telefonu lub wyśle zaproszenie na Google Meet.' 
                      : 'Our representative will call your number or send a calendar invitation for Google Meet.'
                    }
                  </div>
                </div>
              </div>

              {/* Repeat test options */}
              <div className="text-center pt-8">
                <button
                  onClick={handleStartAudit}
                  className="text-xs text-gray-500 hover:text-white font-bold inline-flex items-center gap-1.5 transition-all hover:underline"
                >
                  <RefreshCw size={12} />
                  {isPl ? 'Rozpocznij audyt od nowa' : 'Restart audit from scratch'}
                </button>
              </div>

            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
