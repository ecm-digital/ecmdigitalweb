'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { services, CORE_SERVICE_KEYS } from './serviceData';
import { st } from './serviceTranslations';
import Link from 'next/link';

const tPage: Record<string, Record<string, string>> = {
    pl: {
        'services.hero.label': '🛠️ Kompleksowa Oferta ECM Digital',
        'services.hero.title': 'Usługi AI & Software',
        'services.hero.subtitle': 'Przekształcamy wąskie gardła w automatyczne zyski. Wybierz ścieżkę dopasowaną do Twojego aktualnego etapu rozwoju.',
        'services.matrix.title': 'Z czym dziś przychodzisz?',
        'services.matrix.subtitle': 'Wybierz problem biznesowy, a wskażemy najszybszą i najbardziej opłacalną ścieżkę wdrożenia.',
        'services.details': 'Szczegóły usługi',
        'services.priceLabel': 'Inwestycja:',
        'services.techs': 'Stack technologiczny:',
        'services.coreCatalog.title': '8 Kluczowych Specjalizacji ECM Digital',
        'services.coreCatalog.subtitle': 'Od audytu i 14-dniowego agenta po skalowalne aplikacje Next.js i stałe partnerstwo AI.',
        'services.addon.badge': 'Usługa Komplementarna / Governance',
        'services.addon.title': 'AI Governance & AgentOps Review',
        'services.addon.desc': 'Dla firm posiadających już agentów AI: kwartalny audyt kosztów tokenów, bezpieczeństwa uprawnień, higieny danych i optymalizacji promptów.',
        'services.addon.btn': 'Sprawdź audyt AgentOps',
        'services.cta.title': 'Nie wiesz, od czego zacząć?',
        'services.cta.subtitle': 'Zacznij od Audytu AI (od 3 900 PLN) — 100% kwoty odejmujemy od rachunku przy wdrożeniu kolejnego etapu.',
        'services.cta.button': 'Umów bezpłatną konsultację 30 min',
        'services.calc.cta': 'Skorzystaj z kalkulatora wyceny online →',
    },
    en: {
        'services.hero.label': '🛠️ ECM Digital Comprehensive Offer',
        'services.hero.title': 'AI & Software Services',
        'services.hero.subtitle': 'We turn operational bottlenecks into automated revenue. Choose the path tailored to your company\'s current stage.',
        'services.matrix.title': 'What challenge are you facing today?',
        'services.matrix.subtitle': 'Select your business goal, and we will guide you to the fastest and highest-ROI path.',
        'services.details': 'Service details',
        'services.priceLabel': 'Investment:',
        'services.techs': 'Core technologies:',
        'services.coreCatalog.title': '8 Core Specializations of ECM Digital',
        'services.coreCatalog.subtitle': 'From AI audit and 14-day agent sprint to scalable Next.js apps and ongoing AI growth partnership.',
        'services.addon.badge': 'Complementary Service / Governance',
        'services.addon.title': 'AI Governance & AgentOps Review',
        'services.addon.desc': 'For companies already operating AI agents: quarterly audit of token consumption, permission security, data hygiene, and prompt calibration.',
        'services.addon.btn': 'Explore AgentOps Review',
        'services.cta.title': 'Unsure where to start?',
        'services.cta.subtitle': 'Start with our AI Audit (from 3 900 PLN) — 100% of the audit cost is credited towards your production implementation.',
        'services.cta.button': 'Book a Free 30-min Consultation',
        'services.calc.cta': 'Use our online pricing calculator →',
    },
    de: {
        'services.hero.label': '🛠️ ECM Digital Gesamtangebot',
        'services.hero.title': 'KI- & Software-Dienstleistungen',
        'services.hero.subtitle': 'Wir verwandeln operative Engpässe in automatisierte Gewinne. Wählen Sie den richtigen Weg für Ihre Wachstumsphase.',
        'services.matrix.title': 'Mit welcher Herausforderung kommen Sie zu uns?',
        'services.matrix.subtitle': 'Wählen Sie Ihr Geschäftsziel und wir zeigen Ihnen den schnellsten Weg mit maximalem ROI.',
        'services.details': 'Details ansehen',
        'services.priceLabel': 'Investition:',
        'services.techs': 'Technologien:',
        'services.coreCatalog.title': '8 Kernkompetenzen von ECM Digital',
        'services.coreCatalog.subtitle': 'Vom KI-Audit und 14-Tage-Sprint bis zu skalierbaren Next.js-Apps und kontinuierlicher KI-Partnerschaft.',
        'services.addon.badge': 'Ergänzender Service / Governance',
        'services.addon.title': 'AI Governance & AgentOps Review',
        'services.addon.desc': 'Für Unternehmen mit bestehenden KI-Agenten: vierteljährliches Audit von Token-Kosten, Zugriffssicherheit und Prompt-Optimierung.',
        'services.addon.btn': 'AgentOps Review ansehen',
        'services.cta.title': 'Nicht sicher, wo Sie anfangen sollen?',
        'services.cta.subtitle': 'Starten Sie mit dem KI-Audit (ab 3 900 PLN) — 100% der Kosten werden bei der Umsetzung voll angerechnet.',
        'services.cta.button': 'Kostenloses 30-Minuten-Gespräch buchen',
        'services.calc.cta': 'Zum Online-Preisrechner →',
    },
    es: {
        'services.hero.label': '🛠️ Oferta Integral de ECM Digital',
        'services.hero.title': 'Servicios de IA y Software',
        'services.hero.subtitle': 'Convertimos cuellos de botella operativos en rentabilidad automatizada. Elige la solución ideal para tu etapa actual.',
        'services.matrix.title': '¿Qué desafío tienes hoy en tu negocio?',
        'services.matrix.subtitle': 'Elige tu objetivo y te indicaremos la ruta más rápida y con mayor retorno de inversión.',
        'services.details': 'Detalles del servicio',
        'services.priceLabel': 'Inversión:',
        'services.techs': 'Tecnologías principales:',
        'services.coreCatalog.title': '8 Especializaciones Clave de ECM Digital',
        'services.coreCatalog.subtitle': 'Desde auditoría de IA y sprint de 14 días hasta aplicaciones Next.js y alianza continua de crecimiento.',
        'services.addon.badge': 'Servicio Complementario / Governance',
        'services.addon.title': 'AI Governance & AgentOps Review',
        'services.addon.desc': 'Para empresas que ya usan agentes de IA: auditoría trimestral de costos de tokens, seguridad de accesos y calibración de modelos.',
        'services.addon.btn': 'Ver revisión de AgentOps',
        'services.cta.title': '¿No estás seguro de por dónde empezar?',
        'services.cta.subtitle': 'Empieza con nuestra Auditoría de IA (desde 3 900 PLN) — el 100% del costo se descuenta de tu desarrollo en producción.',
        'services.cta.button': 'Reservar consulta gratuita de 30 min',
        'services.calc.cta': 'Ir al calculador de precios online →',
    },
    szl: {
        'services.hero.label': '🛠️ Oferta ECM Digital',
        'services.hero.title': 'Usługi AI & Software',
        'services.hero.subtitle': 'Przekształcomy wąskie gardła w zautomatyzowane zyski. Ôbierz cug dopasowany do Twoigo biznesu.',
        'services.matrix.title': 'Z czym dzisioj przichodzisz?',
        'services.matrix.subtitle': 'Ôbierz swój problem, a pokożymy nojlepszy a nojtańszy knif na wdrożynie.',
        'services.details': 'Szczegóły usługi',
        'services.priceLabel': 'Inwestycyjŏ:',
        'services.techs': 'Głōwne technologie:',
        'services.coreCatalog.title': '8 Kluczowych Specjalizacyji ECM Digital',
        'services.coreCatalog.subtitle': 'Ôd audytu i 14-dniowego agenta po aplikacyje Next.js i sztalich partnerstwo AI.',
        'services.addon.badge': 'Usługa Komplementarnŏ / Governance',
        'services.addon.title': 'AI Governance & AgentOps Review',
        'services.addon.desc': 'Dlo firm majōncych agentōw AI: kwartalny audyt kosztōw tokenōw, bezpieczeńswa a optymalizacyje promptōw.',
        'services.addon.btn': 'Sprowdź audyt AgentOps',
        'services.cta.title': 'Nie wiesz, kaj zaczonć?',
        'services.cta.subtitle': 'Zacznij ôd Audytu AI (ôd 3 900 PLN) — 100% kwoty ôdliczomy przi wdrożyniu.',
        'services.cta.button': 'Zarezerwuj bezpłatnõ konsultacyjõ',
        'services.calc.cta': 'Kalkulator wycyny online →',
    },
    ar: {
        'services.hero.label': '🛠️ عرض ECM Digital الشامل',
        'services.hero.title': 'خدمات الذكاء الاصطناعي والبرمجيات',
        'services.hero.subtitle': 'نحول الاختناقات التشغيلية إلى أرباح مؤتمتة. اختر المسار الأنسب لمرحلة نمو أعمالك.',
        'services.matrix.title': 'ما هو التحدي الذي تواجهه اليوم؟',
        'services.matrix.subtitle': 'حدد هدفك التجاري وسنرشدك إلى المسار الأسرع والأعلى عائداً على الاستثمار.',
        'services.details': 'تفاصيل الخدمة',
        'services.priceLabel': 'الاستثمار:',
        'services.techs': 'التقنيات الأساسية:',
        'services.coreCatalog.title': '8 تخصصات رئيسية لدى ECM Digital',
        'services.coreCatalog.subtitle': 'من تدقيق الذكاء الاصطناعي وسبرنت الـ 14 يوماً إلى منصات Next.js والشراكة التكنولوجية المستمرة.',
        'services.addon.badge': 'خدمة تكميلية / الحوكمة',
        'services.addon.title': 'AI Governance & AgentOps Review',
        'services.addon.desc': 'للشركات التي تمتلك وكلاء ذكاء اصطناعي بالفعل: تدقيق ربع سنوي لتكاليف الرموز وأمان الأذونات وتحسين الأداء.',
        'services.addon.btn': 'استكشف تدقيق AgentOps',
        'services.cta.title': 'لست متأكداً من أين تبدأ؟',
        'services.cta.subtitle': 'ابدأ بتدقيق الذكاء الاصطناعي (من 3,900 PLN) — نخصم 100% من قيمة التدقيق عند بدء التنفيذ.',
        'services.cta.button': 'احجز استشارة مجانية مدتها 30 دقيقة',
        'services.calc.cta': 'استخدم حاسبة الأسعار الفورية ←',
    }
};

interface ProblemOption {
    id: string;
    icon: string;
    label: Record<string, string>;
    targetSlug: string;
    targetTitle: Record<string, string>;
    priceTag: string;
    badge: Record<string, string>;
    reason: Record<string, string>;
}

const PROBLEM_MATRIX: ProblemOption[] = [
    {
        id: 'need-direction',
        icon: '🧭',
        label: {
            pl: 'Nie wiem, gdzie AI ma sens w mojej firmie',
            en: 'I am not sure where AI makes financial sense for us',
            de: 'Ich weiß nicht, wo KI in meinem Unternehmen Sinn ergibt',
            es: 'No sé dónde la IA aporta valor real en mi empresa',
            szl: 'Nie wiym, kaj AI mo zmysł w moij firmie',
            ar: 'لست متأكداً أين يحقق الذكاء الاصطناعي عائداً مالياً لنا',
        },
        targetSlug: 'ai-audit',
        targetTitle: {
            pl: 'Audyt Gotowości AI & Procesów',
            en: 'AI & Process Audit',
            de: 'KI- & Prozess-Audit',
            es: 'Auditoría de IA y Procesos',
            szl: 'Audyt Gotowości AI & Procesōw',
            ar: 'تدقيق الذكاء الاصطناعي والعمليات',
        },
        priceTag: 'od 3 900 PLN (100% odliczane)',
        badge: {
            pl: 'Zero Ryzyka',
            en: 'Zero Risk',
            de: 'Null Risiko',
            es: 'Cero Riesgo',
            szl: 'Czysty Zysk',
            ar: 'بدون مخاطر',
        },
        reason: {
            pl: 'Mapujemy procesy, eliminujemy wąskie gardła i przygotowujemy 90-dniową roadmapę. Koszt audytu w 100% odliczamy od wdrożenia.',
            en: 'We map workflows, uncover quick-wins, and provide a 90-day ROI roadmap. 100% credited toward production rollout.',
            de: 'Wir analysieren Workflows und erstellen eine 90-Tage-ROI-Roadmap. Zu 100% auf die Umsetzung anrechenbar.',
            es: 'Mapeamos flujos, encontramos victorias rápidas y trazamos una hoja de ruta con ROI. 100% deducible.',
            szl: 'Mapujymy procesy a dŏwomy 90-dniowõ roadmapã. Całŏ kwota ôdliczanŏ przi wdrożyniu.',
            ar: 'نقوم بتحليل العمليات وتحديد المكاسب السريعة مع خطة عائد استثمار لمدة 90 يوماً وتكلفة التدقيق مخصومة بالكامل.',
        }
    },
    {
        id: 'single-process',
        icon: '⚡',
        label: {
            pl: 'Mam 1 konkretny proces i chcę szybkich efektów',
            en: 'I have 1 specific process and need fast results',
            de: 'Ich habe 1 konkreten Prozess und brauche schnelle Ergebnisse',
            es: 'Tengo 1 proceso específico y necesito resultados rápidos',
            szl: 'Mōm 1 konkretny proces i chca gibkich efektōw',
            ar: 'لدي عملية واحدة محددة وأريد نتائج سريعة وملموسة',
        },
        targetSlug: 'ai-agent-sprint',
        targetTitle: {
            pl: 'AI Agent Sprint — 14 Dni ⭐',
            en: 'AI Agent Sprint — 14 Days ⭐',
            de: 'KI-Agenten-Sprint — 14 Tage ⭐',
            es: 'Sprint de Agente de IA — 14 Días ⭐',
            szl: 'AI Agent Sprint — 14 Dni ⭐',
            ar: 'سبرنت وكيل الذكاء الاصطناعي — 14 يوماً ⭐',
        },
        priceTag: 'od 9 900 PLN (Fixed Price)',
        badge: {
            pl: 'Bestseller 14 Dni',
            en: 'Bestseller 14 Days',
            de: 'Bestseller 14 Tage',
            es: 'Bestseller 14 Días',
            szl: 'Bestseller 14 Dni',
            ar: 'الأكثر مبيعاً 14 يوماً',
        },
        reason: {
            pl: 'Działający agent AI w Twoim CRM z panelem KPI w 14 dni roboczych. Stała cena, gwarancja i 14 dni asysty hiper-care.',
            en: 'Production AI agent integrated with CRM & live KPI dashboard in 14 business days. Fixed price and hyper-care included.',
            de: 'Funktionierender KI-Agent in Ihrem CRM mit KPI-Dashboard in 14 Werktagen. Fester Preis und Hyper-Care.',
            es: 'Agente de IA productivo en tu CRM con dashboard en 14 días laborables. Precio cerrado y soporte hiper-care.',
            szl: 'Fungujōncy agent AI w Twoim CRM z dashboardym w 14 dni roboczych. Pynkno cena i wsparcie.',
            ar: 'وكيل ذكاء اصطناعي يعمل في نظام إدارة العملاء مع لوحة مؤشرات خلال 14 يوم عمل بسعر ثابت وضمان كامل.',
        }
    },
    {
        id: 'repetitive-chaos',
        icon: '🔄',
        label: {
            pl: 'Mój zespół tonie w powtarzalnych zadaniach i przepisywaniu danych',
            en: 'My team is overwhelmed by manual tasks and data entry',
            de: 'Mein Team versinkt in manuellen Aufgaben und Dateneingabe',
            es: 'Mi equipo pierde horas en tareas manuales y traspaso de datos',
            szl: 'Mój zespōł traci czas na ryncznym przepisywaniu danych',
            ar: 'فريقي غارق في المهام اليدوية المتكررة ونقل البيانات',
        },
        targetSlug: 'automation',
        targetTitle: {
            pl: 'Automatyzacje Procesów (n8n / API)',
            en: 'Process Automation (n8n / API)',
            de: 'Prozessautomatisierung (n8n / API)',
            es: 'Automatización de Procesos (n8n / API)',
            szl: 'Automatyzacyje procesōw (n8n / API)',
            ar: 'أتمتة العمليات التجارية (n8n / API)',
        },
        priceTag: 'od 3 500 PLN',
        badge: {
            pl: '24/7 Bez Błędów',
            en: '24/7 Zero Errors',
            de: '24/7 Fehlerfrei',
            es: '24/7 Sin Errores',
            szl: '24/7 Bez Felōw',
            ar: 'على مدار الساعة بدون أخطاء',
        },
        reason: {
            pl: 'Łączymy CRM, ERP, skrzynki e-mail i arkusze w bezobsługowe przepływy n8n. Eliminujemy błędy ludzkie i oszczędzamy setki godzin rocznie.',
            en: 'We connect CRM, ERP, inboxes, and spreadsheets into reliable n8n workflows, saving hundreds of manual hours.',
            de: 'Wir verknüpfen CRM, ERP, E-Mail und Tabellen zu stabilen n8n-Workflows und sparen hunderte Stunden.',
            es: 'Conectamos CRM, ERP, correos y hojas de cálculo con n8n para eliminar errores y ahorrar cientos de horas.',
            szl: 'Łōnczymy Twoje narzędzia w stabilne n8n przepływy bez ryncznyj roboty.',
            ar: 'نربط أنظمتكم وبريدكم وجداولكم في تدفقات n8n موثوقة توفر مئات الساعات سنوياً.',
        }
    },
    {
        id: 'new-product-or-web',
        icon: '🚀',
        label: {
            pl: 'Potrzebuję nowoczesnej strony, sklepu e-commerce lub platformy MVP',
            en: 'I need a high-converting website, e-commerce store, or MVP web app',
            de: 'Ich brauche eine moderne Website, einen E-Commerce-Shop oder ein MVP',
            es: 'Necesito una web moderna de alta conversión, tienda online o MVP',
            szl: 'Potrzebujã nowyj zajty, sklepu abo prototypu MVP',
            ar: 'أحتاج إلى موقع عالي التحويل، متجر إلكتروني، أو تطبيق ويب MVP',
        },
        targetSlug: 'mvp',
        targetTitle: {
            pl: 'MVP & Aplikacje Webowe z AI',
            en: 'MVP & Web Apps with AI',
            de: 'MVP & Web-Apps mit KI',
            es: 'MVP y Aplicaciones Web con IA',
            szl: 'MVP i Aplikacyje z AI',
            ar: 'النماذج الأولية MVP والتطبيقات مع الذكاء الاصطناعي',
        },
        priceTag: 'od 5 000 – 12 000 PLN',
        badge: {
            pl: 'Next.js 14 & AI',
            en: 'Next.js 14 & AI',
            de: 'Next.js 14 & KI',
            es: 'Next.js 14 & IA',
            szl: 'Next.js 14 & AI',
            ar: 'Next.js 14 والذكاء الاصطناعي',
        },
        reason: {
            pl: 'Tworzymy ultra-szybkie serwisy Next.js, sklepy Shopify zintegrowane z Baselinker oraz gotowe do monetyzacji aplikacje SaaS.',
            en: 'We build ultra-fast Next.js portals, Baselinker-powered e-commerce stores, and investor-ready SaaS applications.',
            de: 'Wir entwickeln blitzschnelle Next.js-Portale, Shopify-Stores und investorenreife SaaS-Lösungen.',
            es: 'Construimos portales ultra rápidos con Next.js, tiendas automatizadas y aplicaciones SaaS listas para monetizar.',
            szl: 'Tworzymy gibkie serwisy Next.js, sklepy e-commerce a platformy SaaS.',
            ar: 'نطور مواقع وتطبيقات فائقة السرعة بنظام Next.js ومتاجر وتطبيقات سحابية جاهزة للمستثمرين.',
        }
    },
    {
        id: 'maintain-and-scale',
        icon: '📈',
        label: {
            pl: 'Mamy już AI/narzędzia i chcemy stabilnego rozwoju oraz opieki',
            en: 'We already have AI tools and need continuous improvement & SLA',
            de: 'Wir nutzen bereits KI und wünschen uns kontinuierliche Betreuung',
            es: 'Ya contamos con IA y buscamos soporte técnico continuo y escalabilidad',
            szl: 'Mōmy już AI a chcymy stałygo wsparciŏ i rozwoju',
            ar: 'لدينا بالفعل أنظمة ذكاء اصطناعي ونحتاج إلى دعم مستمر وتطوير دوري',
        },
        targetSlug: 'ai-growth-partner',
        targetTitle: {
            pl: 'AI Growth Partner (Retainer)',
            en: 'AI Growth Partner (Retainer)',
            de: 'AI Growth Partner (Retainer)',
            es: 'AI Growth Partner (Retainer)',
            szl: 'AI Growth Partner (Retainer)',
            ar: 'شريك نمو الذكاء الاصطناعي (اشتراك شهري)',
        },
        priceTag: 'od 2 500 PLN / msc',
        badge: {
            pl: 'Dedykowane SLA',
            en: 'Dedicated SLA',
            de: 'Garantierte SLA',
            es: 'SLA Garantizado',
            szl: 'Pewne SLA',
            ar: 'اتفاقية مستوى خدمة مخصصة',
        },
        reason: {
            pl: 'Monitoring promptów, aktualizacja bazy wiedzy RAG, nowe scenariusze co miesiąc i bezpośrednie wsparcie architekta AI.',
            en: 'Continuous prompt tuning, RAG updates, monthly new workflow sprints, and direct AI architect support.',
            de: 'Laufende Prompt-Optimierung, RAG-Pflege, monatliche neue Workflows und direkter Architekten-Support.',
            es: 'Calibración constante de modelos, actualización de base de datos RAG y sprints mensuales de mejora.',
            szl: 'Pilnowanie promptōw, aktualizacyjo bazy wiedzy a nowe scenariusze kożdy miesiōnc.',
            ar: 'مراقبة النماذج وتحديث قواعد المعرفة وإضافة تدفقات جديدة شهرياً مع دعم مباشر من مهندسينا.',
        }
    }
];

export default function ServicesPage() {
    const { lang } = useLanguage();
    const [activeProblem, setActiveProblem] = useState<string>(PROBLEM_MATRIX[0].id);

    const tp = (key: string): string => {
        return tPage[lang]?.[key] || tPage.en?.[key] || tPage.pl?.[key] || key;
    };

    const selectedProblem = PROBLEM_MATRIX.find(p => p.id === activeProblem) || PROBLEM_MATRIX[0];

    // Filter only 8 core services for catalog grid
    const coreServices = CORE_SERVICE_KEYS.map(key => services[key]).filter(Boolean);
    const addonService = services['ai-governance-agentops'];

    return (
        <div className="lp-wrapper">
            <Navbar />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-grid" style={{
                padding: '180px 20px 80px',
                minHeight: '40vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                background: 'radial-gradient(circle at top, rgba(59, 130, 246, 0.08), transparent 70%)'
            }}>
                <div style={{ position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)', width: '100vw', height: '600px', background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.06) 0%, transparent 70%)', filter: 'blur(100px)', zIndex: 0, pointerEvents: 'none' }} />

                <div className="container relative z-10">
                    <div className="fade-in-up" style={{ maxWidth: '880px', margin: '0 auto' }}>
                        <div className="hero-badge" style={{
                            margin: '0 auto 28px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '10px 24px',
                            borderRadius: '999px',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            backdropFilter: 'blur(20px)',
                            color: '#60a5fa',
                            fontSize: '0.9rem',
                            fontWeight: 600
                        }}>
                            {tp('services.hero.label')}
                        </div>

                        <h1 style={{
                            fontSize: 'clamp(2.5rem, 7vw, 4.5rem)',
                            fontWeight: 800,
                            marginBottom: '24px',
                            letterSpacing: '-0.04em',
                            lineHeight: 1.1,
                            textAlign: 'center'
                        }}>
                            {tp('services.hero.title')}
                        </h1>
                        <p style={{
                            fontSize: '1.2rem',
                            color: 'rgba(255,255,255,0.65)',
                            maxWidth: '720px',
                            margin: '0 auto 32px',
                            lineHeight: 1.7,
                            textAlign: 'center'
                        }}>
                            {tp('services.hero.subtitle')}
                        </p>

                        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <a href="#matrix" className="btn-primary" style={{ padding: '14px 28px', borderRadius: '12px' }}>
                                {tp('services.matrix.title')} ↓
                            </a>
                            <Link href="/wycena" className="btn-secondary" style={{ padding: '14px 28px', borderRadius: '12px' }}>
                                {tp('services.calc.cta')}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* PROBLEM-FIRST DECISION MATRIX ("Z czym dziś przychodzisz?") */}
            <section id="matrix" className="section relative" style={{
                borderTop: '1px solid rgba(255,255,255,0.06)',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                background: 'linear-gradient(180deg, rgba(15,23,42,0.6) 0%, rgba(10,15,30,0.9) 100%)',
                padding: '90px 20px'
            }}>
                <div className="container relative z-10" style={{ maxWidth: '1100px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                        <div style={{
                            display: 'inline-block',
                            padding: '6px 16px',
                            borderRadius: '999px',
                            background: 'rgba(96,165,250,0.1)',
                            border: '1px solid rgba(96,165,250,0.25)',
                            color: '#93c5fd',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            marginBottom: '16px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em'
                        }}>
                            🧭 Matryca Decyzyjna
                        </div>
                        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 2.8rem)', fontWeight: 800, color: 'white', letterSpacing: '-0.03em', marginBottom: '14px' }}>
                            {tp('services.matrix.title')}
                        </h2>
                        <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.6)', maxWidth: '650px', margin: '0 auto' }}>
                            {tp('services.matrix.subtitle')}
                        </p>
                    </div>

                    {/* Problem tabs */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '12px',
                        marginBottom: '32px'
                    }}>
                        {PROBLEM_MATRIX.map(problem => {
                            const isSelected = activeProblem === problem.id;
                            const label = problem.label[lang] || problem.label.pl;
                            return (
                                <button
                                    key={problem.id}
                                    type="button"
                                    onClick={() => setActiveProblem(problem.id)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '16px 20px',
                                        borderRadius: '16px',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        border: isSelected ? '2px solid #60a5fa' : '1px solid rgba(255,255,255,0.08)',
                                        background: isSelected ? 'rgba(96, 165, 250, 0.12)' : 'rgba(255,255,255,0.02)',
                                        color: isSelected ? 'white' : 'rgba(255,255,255,0.7)',
                                    }}
                                >
                                    <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{problem.icon}</span>
                                    <span style={{ fontSize: '0.92rem', fontWeight: isSelected ? 700 : 500, lineHeight: 1.4 }}>
                                        {label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Active recommendation card */}
                    <div className="premium-glass-panel" style={{
                        padding: '36px 40px',
                        borderRadius: '24px',
                        border: '1px solid rgba(96,165,250,0.3)',
                        background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.2) 0%, rgba(15, 23, 42, 0.6) 100%)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{
                                    padding: '6px 14px',
                                    borderRadius: '999px',
                                    background: '#10b981',
                                    color: '#022c22',
                                    fontWeight: 800,
                                    fontSize: '0.78rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.04em'
                                }}>
                                    {selectedProblem.badge[lang] || selectedProblem.badge.pl}
                                </span>
                                <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
                                    Rekomendowany pierwszy krok:
                                </span>
                            </div>
                            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#60a5fa' }}>
                                {selectedProblem.priceTag}
                            </span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                            <div>
                                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'white', marginBottom: '8px' }}>
                                    {selectedProblem.targetTitle[lang] || selectedProblem.targetTitle.pl}
                                </h3>
                                <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, maxWidth: '750px', margin: 0 }}>
                                    {selectedProblem.reason[lang] || selectedProblem.reason.pl}
                                </p>
                            </div>
                            <Link
                                href={`/services/${selectedProblem.targetSlug}`}
                                className="btn-primary"
                                style={{ padding: '14px 28px', borderRadius: '12px', whiteSpace: 'nowrap', fontWeight: 700 }}
                            >
                                {tp('services.details')} →
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* CORE SERVICES GRID (8 CANONICAL SPECIALIZATIONS) */}
            <section className="section bg-grid relative" style={{
                background: 'transparent',
                padding: '90px 0 100px'
            }}>
                <div className="container relative z-10">
                    <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 60px' }}>
                        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 2.6rem)', fontWeight: 800, color: 'white', letterSpacing: '-0.03em', marginBottom: '14px' }}>
                            {tp('services.coreCatalog.title')}
                        </h2>
                        <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.6)' }}>
                            {tp('services.coreCatalog.subtitle')}
                        </p>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
                        gap: '32px',
                        justifyContent: 'center'
                    }}>
                        {coreServices.map((item, idx) => {
                            const title = st(lang, `${item.slug}.title`);
                            const subtitle = st(lang, `${item.slug}.subtitle`);
                            const price = st(lang, `${item.slug}.price`);
                            const isBestseller = item.slug === 'ai-agent-sprint';

                            return (
                                <div key={item.slug} className="premium-glass-panel premium-card-glow fade-in-up" style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    padding: '40px 36px',
                                    borderRadius: '28px',
                                    border: isBestseller ? '2px solid rgba(167, 139, 250, 0.6)' : '1px solid rgba(255,255,255,0.06)',
                                    background: isBestseller ? 'rgba(124, 58, 237, 0.04)' : 'rgba(255,255,255,0.02)',
                                    animationDelay: `${idx * 0.04}s`,
                                    position: 'relative'
                                }}>
                                    {isBestseller && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '-12px',
                                            right: '28px',
                                            background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
                                            color: 'white',
                                            fontSize: '0.72rem',
                                            fontWeight: 800,
                                            padding: '4px 14px',
                                            borderRadius: '999px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                            boxShadow: '0 4px 12px rgba(124, 58, 237, 0.4)'
                                        }}>
                                            ⭐ Bestseller
                                        </div>
                                    )}

                                    {/* Icon & Title */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '22px' }}>
                                        <div style={{
                                            width: '54px', height: '54px', borderRadius: '16px',
                                            background: item.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '1.7rem', boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                                        }}>
                                            {item.icon}
                                        </div>
                                        <div>
                                            <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
                                                Specjalizacja #{idx + 1}
                                            </span>
                                            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em', margin: 0 }}>
                                                {title}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p style={{ fontSize: '0.96rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: '24px', flexGrow: 1 }}>
                                        {subtitle}
                                    </p>

                                    {/* Technologies */}
                                    <div style={{ marginBottom: '24px' }}>
                                        <h4 style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.4)', marginBottom: '10px', fontWeight: 700 }}>
                                            {tp('services.techs')}
                                        </h4>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                            {item.techs.slice(0, 4).map((tech) => (
                                                <span key={tech} style={{
                                                    fontSize: '0.76rem',
                                                    padding: '5px 10px',
                                                    borderRadius: '8px',
                                                    background: 'rgba(255,255,255,0.03)',
                                                    border: '1px solid rgba(255,255,255,0.06)',
                                                    color: 'rgba(255,255,255,0.85)',
                                                    fontWeight: 500
                                                }}>
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Price and Details link */}
                                    <div style={{
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 'auto'
                                    }}>
                                        <div>
                                            <div style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                                                {tp('services.priceLabel')}
                                            </div>
                                            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'white', marginTop: '2px' }}>
                                                {price}
                                            </div>
                                        </div>

                                        <Link href={`/services/${item.slug}`} className="btn-secondary premium-button-shine" style={{
                                            padding: '10px 18px', fontSize: '0.85rem', borderRadius: '10px', fontWeight: 700
                                        }}>
                                            {tp('services.details')} →
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ADDON SERVICE: AI Governance & AgentOps Section */}
            {addonService && (
                <section className="section relative" style={{
                    padding: '40px 20px 80px',
                    background: 'transparent'
                }}>
                    <div className="container relative z-10" style={{ maxWidth: '1100px', margin: '0 auto' }}>
                        <div className="premium-glass-panel" style={{
                            padding: '40px',
                            borderRadius: '28px',
                            border: '1px solid rgba(139, 92, 246, 0.3)',
                            background: 'linear-gradient(135deg, rgba(88, 28, 135, 0.15) 0%, rgba(15, 23, 42, 0.5) 100%)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{
                                        width: '56px', height: '56px', borderRadius: '16px',
                                        background: addonService.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '1.8rem', flexShrink: 0
                                    }}>
                                        {addonService.icon}
                                    </div>
                                    <div>
                                        <div style={{
                                            display: 'inline-block',
                                            padding: '4px 12px',
                                            borderRadius: '999px',
                                            background: 'rgba(168, 85, 247, 0.15)',
                                            color: '#c084fc',
                                            fontSize: '0.75rem',
                                            fontWeight: 700,
                                            textTransform: 'uppercase',
                                            marginBottom: '6px'
                                        }}>
                                            {tp('services.addon.badge')}
                                        </div>
                                        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white', margin: 0 }}>
                                            {tp('services.addon.title')}
                                        </h3>
                                    </div>
                                </div>

                                <Link
                                    href="/services/ai-governance-agentops"
                                    className="btn-secondary"
                                    style={{ padding: '12px 24px', borderRadius: '12px', fontWeight: 700 }}
                                >
                                    {tp('services.addon.btn')} →
                                </Link>
                            </div>

                            <p style={{ fontSize: '0.98rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, maxWidth: '850px', margin: 0 }}>
                                {tp('services.addon.desc')}
                            </p>
                        </div>
                    </div>
                </section>
            )}

            {/* Call to Action Section */}
            <section className="section relative" style={{
                borderTop: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(255,255,255,0.01)',
                padding: '100px 20px'
            }}>
                <div className="container relative z-10">
                    <div className="premium-glass-panel" style={{
                        maxWidth: '920px',
                        margin: '0 auto',
                        padding: '60px 40px',
                        borderRadius: '32px',
                        textAlign: 'center',
                        border: '1px solid rgba(59, 130, 246, 0.25)',
                        boxShadow: '0 30px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)'
                    }}>
                        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.6rem)', fontWeight: 800, color: 'white', marginBottom: '16px', letterSpacing: '-0.03em' }}>
                            {tp('services.cta.title')}
                        </h2>
                        <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.65)', maxWidth: '640px', margin: '0 auto 36px', lineHeight: 1.6 }}>
                            {tp('services.cta.subtitle')}
                        </p>
                        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link href="/kontakt" className="btn-primary" style={{ padding: '16px 36px', fontSize: '1rem', textDecoration: 'none', borderRadius: '12px' }}>
                                {tp('services.cta.button')}
                            </Link>
                            <Link href="/wycena" className="btn-secondary" style={{ padding: '16px 32px', fontSize: '1rem', textDecoration: 'none', borderRadius: '12px' }}>
                                {tp('services.calc.cta')}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

