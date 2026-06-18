'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { services as staticServices } from './serviceData';
import { st } from './serviceTranslations';
import ContactSection from '@/components/ContactSection';
import { getAgencyService, ServiceData, getCaseStudies } from '@/lib/firestoreService';
import Image from 'next/image';

const FALLBACK_CASES = [
  {
    slug: 'chatbot-ai-ecommerce',
    color: '#3b82f6',
    img: '/case_study_ai_chatbot_mockup_1772144142535.webp',
    translations: {
      pl: { category: 'AI & Automatyzacja', title: 'Chatbot AI dla e-commerce', description: 'Wdrożyliśmy inteligentnego agenta AI obsługującego klientów 24/7, co zredukowało obciążenie działu wsparcia o 65%.', results: '-65% Ticketów' },
      en: { category: 'AI & Automation', title: 'AI Chatbot for E-commerce', description: 'We implemented a smart AI agent handling support 24/7, reducing ticket load by 65%.', results: '-65% Tickets' },
      de: { category: 'KI & Automatisierung', title: 'KI-Chatbot für E-Commerce', description: 'Wir haben einen intelligenten KI-Agenten implementiert, der den Support rund um die Uhr unterstützt und das Ticketvolumen um 65 % reduziert.', results: '-65% Tickets' },
      es: { category: 'IA y Automatización', title: 'Chatbot de IA para E-commerce', description: 'Implementamos un agente de IA inteligente que atiende soporte 24/7, reduciendo la carga de tickets en un 65%.', results: '-65% de Tickets' },
      szl: { category: 'AI & Automatyzacyjo', title: 'Chatbot AI lo e-commerce', description: 'Wdrożyliśmy inteligentnego agenta AI, co zredukowało obciążenie działu wsparcia o 65%.', results: '-65% Ticketōw' },
      ar: { category: 'الذكاء الاصطناعي والأتمتة', title: 'دردشة ذكاء اصطناعي للتجارة الإلكترونية', description: 'قمنا بتنفيذ وكيل ذكاء اصطناعي ذكي للتعامل مع الدعم على مدار الساعة طوال أيام الأسبوع، مما قلل من عبء التذاكر بنسبة 65٪.', results: '-65% تذاكر أقل' }
    }
  },
  {
    slug: 'sklep-shopify-ai',
    color: '#ec4899',
    img: '/case_study_shopify_ai_mockup_1772144156310.webp',
    translations: {
      pl: { category: 'E-commerce', title: 'Sklep Shopify z AI', description: 'Profesjonalny sklep z rekomendacjami AI i automatycznym marketingiem, który zwiększył sprzedaż o 120%.', results: '+120% Sprzedaż' },
      en: { category: 'E-commerce', title: 'Shopify Store with AI', description: 'Professional store with AI recommendations and automated marketing, boosting sales by 120%.', results: '+120% Sales' },
      de: { category: 'E-Commerce', title: 'Shopify-Shop mit KI', description: 'Professioneller Shop mit KI-Empfehlungen und automatisiertem Marketing, der den Umsatz um 120 % steigerte.', results: '+120% Umsatz' },
      es: { category: 'E-commerce', title: 'Tienda Shopify con IA', description: 'Tienda profesional con recomendaciones de IA y marketing automatizado, aumentando las ventas en un 120%.', results: '+120% de Ventas' },
      szl: { category: 'E-commerce', title: 'Sklep Shopify z AI', description: 'Gryfny sklep z rekomendacjami AI i automatycznym marketingiem, co zwiększyło sprzedaż o 120%.', results: '+120% Przedaj' },
      ar: { category: 'التجارة الإلكترونية', title: 'متجر Shopify بالذكاء الاصطناعي', description: 'متجر احترافي مع توصيات الذكاء الاصطناعي والتسويق المؤتمت، مما أدى إلى زيادة المبيعات بنسبة 120٪.', results: '+120% زيادة في المبيعات' }
    }
  },
  {
    slug: 'automatyzacja-n8n',
    color: '#10b981',
    img: '/case_study_automation_n8n_mockup_1772144173711.webp',
    translations: {
      pl: { category: 'Automatyzacja', title: 'System automatyzacji N8N', description: 'Zautomatyzowaliśmy 15 procesów biznesowych, oszczędzając klientowi 25 godzin tygodniowo.', results: '25h Oszczędność/tyg.' },
      en: { category: 'Automation', title: 'N8N Automation System', description: 'We automated 15 business processes, saving the client 25 hours weekly.', results: '25h saved/week' },
      de: { category: 'Automatisierung', title: 'N8N Automatisierungssystem', description: 'Wir haben 15 Geschäftsprozesse automatisiert und dem Kunden 25 Stunden pro Woche eingespart.', results: '25 Std. gespart/Woche' },
      es: { category: 'Automatización', title: 'Sistema de Automatización N8N', description: 'Automatizamos 15 procesos comerciales, ahorrando al cliente 25 horas semanales.', results: '25h ahorradas/semana' },
      szl: { category: 'Automatyzacyjo', title: 'System automatyzacyje N8N', description: 'Zautomatyzowaliśmy 15 procesōw, oszczędzając klijyntowi 25 godzin tygodniowo.', results: '25h Oszczędności/tyg.' },
      ar: { category: 'الأتمتة', title: 'نظام أتمتة N8N', description: 'لقد قمنا بأتمتة 15 عملية تجارية، مما وفر للعميل 25 ساعة أسبوعياً.', results: 'توفير 25 ساعة أسبوعياً' }
    }
  },
  {
    slug: 'aplikacja-mvp',
    color: '#f59e0b',
    img: '/case_study_mvp_startup_mockup_1772144187874.webp',
    translations: {
      pl: { category: 'Aplikacje Mobilne / Web', title: 'Aplikacja MVP w 10 tygodni', description: 'Od koncepcji do App Store / Web w 10 tygodni. Walidacja pomysłu z prawdziwymi użytkownikami.', results: '10 Tygodni do MVP' },
      en: { category: 'Mobile / Web Apps', title: 'MVP App in 10 Weeks', description: 'From concept to App Store / Web in 10 weeks. Validation of the idea with real users.', results: '10 Weeks to MVP' },
      de: { category: 'Mobile & Web Apps', title: 'MVP-App in 10 Wochen', description: 'Vom Konzept bis zum App Store / Web in 10 Wochen. Validierung der Idee mit echten Nutzern.', results: '10 Wochen zum MVP' },
      es: { category: 'Aplicaciones Móviles / Web', title: 'Aplicación MVP en 10 semanas', description: 'De concepto a App Store / Web en 10 semanas. Validación de la idea con usuarios reales.', results: '10 semanas para MVP' },
      szl: { category: 'Aplikacyje mobilne', title: 'Apka MVP w 10 tydni', description: 'Od pomysłu do gotowyj apki w 10 tydni. Sprawdzynie ze ludźmi.', results: '10 tydni' },
      ar: { category: 'تطبيقات الويب والجوال', title: 'تطبيق MVP في 10 أسابيع', description: 'من الفكرة إلى متجر التطبيقات / الويب في 10 أسابيع. التحقق من الفكرة مع مستخدمين حقيقيين.', results: '10 أسابيع للنموذج الأول' }
    }
  },
  {
    slug: 'automatyzacja-nieruchomosci',
    color: '#eab308',
    img: '/img_case_real_estate_ai.webp',
    translations: {
      pl: { category: 'Agent AI & Automatyzacja', title: 'Automatyzacja Leadów dla Agencji Nieruchomości', description: 'Wdrożenie inteligentnego asystenta AI, który obsługuje zapytania 24/7, kwalifikuje klientów i automatycznie umawia prezentacje luksusowych apartamentów.', results: '400% wzrost prezentacji' },
      en: { category: 'AI Agents & Automation', title: 'Lead Automation for Real Estate Agency', description: 'Implementation of a smart AI assistant that handles inquiries 24/7, qualifies clients, and automatically schedules luxury apartment viewings.', results: '400% viewing growth' },
      de: { category: 'KI-Agenten & Automatisierung', title: 'Lead-Automatisierung für Immobilienagentur', description: 'Implementierung eines intelligenten KI-Assistenten, der Anfragen rund um die Uhr bearbeitet und Besichtigungstermine für Luxusapartments automatisch bucht.', results: '400% mehr Besichtigungen' },
      es: { category: 'Agentes de IA y Automatización', title: 'Automatización de Leads para Inmobiliaria', description: 'Implementación de un asistente de IA inteligente que maneja consultas 24/7, califica clientes y programa visitas a apartamentos de lujo automáticamente.', results: '400% más de visitas' },
      szl: { category: 'Agenci AI & Automatyzacyjo', title: 'Automatyzacyjo Leadōw lo Niyruchomości', description: 'Wdrożynie asystynta AI, kery godo z ludźmi 24/7 i umawio prezentacyje apartamyntōw.', results: '400% wzrost' },
      ar: { category: 'وكلاء الذكاء الاصطناعي والأتمتة', title: 'أتمتة العملاء المحتملين لوكالة عقارية', description: 'تطبيق مساعد ذكاء اصطناعي ذكي يتعامل مع الاستفسارات 24/7، ويؤهل العملاء ويحدد مواعيد عرض الشقق الفاخرة تلقائياً.', results: 'زيادة 400٪ في مواعيد المعاينة' }
    }
  }
];

const RELATED_PROJECTS_MAP: Record<string, string[]> = {
  'ai-agents': ['chatbot-ai-ecommerce', 'automatyzacja-nieruchomosci'],
  'automation': ['automatyzacja-n8n', 'automatyzacja-nieruchomosci'],
  'ecommerce': ['sklep-shopify-ai', 'chatbot-ai-ecommerce'],
  'websites': ['sklep-shopify-ai', 'aplikacja-mvp'],
  'mvp': ['aplikacja-mvp'],
  'ai-audit': ['automatyzacja-n8n', 'chatbot-ai-ecommerce']
};

const sectionTitleMap: Record<string, string> = {
  pl: 'Powiązane Realizacje',
  en: 'Related Projects',
  de: 'Ähnliche Projekte',
  es: 'Proyectos Relacionados',
  szl: 'Powiązane Realizacyje',
  ar: 'المشاريع ذات الصلة'
};

const sectionSubtitleMap: Record<string, string> = {
  pl: 'Zobacz, jak pomogliśmy innym klientom w podobnych obszarach.',
  en: 'See how we have helped other clients in similar areas.',
  de: 'Sehen Sie, wie wir anderen Kunden in ähnlichen Bereichen geholfen haben.',
  es: 'Vea cómo hemos ayudado a otros clientes en áreas similares.',
  szl: 'Sprawdź, jak pomogliśmy innym w podobnych sprawach.',
  ar: 'تعرف على كيفية مساعدتنا للعملاء الآخرين في مجالات مماثلة.'
};

function resolveImage(item: any, title: string): string {
  if (item.coverImage || item.img || item.image) return item.coverImage || item.img || item.image;
  if (title.includes('Nieruchomości') && title.includes('Automatyzacja')) return '/img_case_real_estate_ai.webp';
  if (title.toLowerCase().includes('doradcy kredytowego')) return '/img_case_credit_advisor.webp';
  if (title.toLowerCase().includes('kingsmith')) return '/img_case_fitness_app.webp';
  if (title.toLowerCase().includes('agencji nieruchomości') && title.toLowerCase().includes('strona')) return '/img_case_real_estate_web.webp';
  if (title.toLowerCase().includes('kursami z zakresu ai')) return '/img_case_ai_education.webp';
  return '/case_study_mvp_startup_mockup_1772144187874.webp';
}

export default function ServicePage({ serviceKey }: { serviceKey: string }) {
    const { lang } = useLanguage();
    const [dynamicService, setDynamicService] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [relatedCases, setRelatedCases] = useState<any[]>([]);

    const staticService = staticServices[serviceKey];

    // T function that delegates to dynamic or static translations
    const T = (key: string) => {
        if (dynamicService?.translations) {
            const trans = dynamicService.translations[lang] || dynamicService.translations.en || dynamicService.translations.pl;

            if (trans) {
                if (key.includes('.features.')) {
                    const idxStr = key.split('.features.')[1];
                    const idx = parseInt(idxStr) - 1;
                    if (trans.features && trans.features[idx]) return trans.features[idx];
                    return st(lang, key);
                }
                if (key.endsWith('.title')) return trans.title || st(lang, key);
                if (key.endsWith('.subtitle')) return trans.subtitle || st(lang, key);
                if (key.endsWith('.long')) return trans.long || st(lang, key);
                if (key.endsWith('.testimonial.quote')) return trans.testimonialQuote || st(lang, key);
                if (key.endsWith('.testimonial.author')) return trans.testimonialAuthor || st(lang, key);
                if (key.endsWith('.testimonial.role')) return trans.testimonialRole || st(lang, key);
            }
            if (key.endsWith('.price')) return dynamicService.price || st(lang, key);
        }
        return st(lang, key);
    };

    useEffect(() => {
        const fetchDynamic = async () => {
            try {
                const data = await getAgencyService(serviceKey);
                if (data) setDynamicService(data);
            } catch {
                setDynamicService(null);
            } finally {
                setLoading(false);
            }
        };
        fetchDynamic();

        const fetchCases = async () => {
            try {
                const dbCases = await getCaseStudies();
                const slugsToFind = RELATED_PROJECTS_MAP[serviceKey] || [];
                const matched: any[] = [];
                
                slugsToFind.forEach(slug => {
                    const foundInDb = dbCases.find((c: any) => c.slug === slug);
                    if (foundInDb) {
                        matched.push(foundInDb);
                    } else {
                        const foundInFallback = FALLBACK_CASES.find(c => c.slug === slug);
                        if (foundInFallback) {
                            matched.push(foundInFallback);
                        }
                    }
                });
                setRelatedCases(matched);
            } catch {
                const slugsToFind = RELATED_PROJECTS_MAP[serviceKey] || [];
                const matched = FALLBACK_CASES.filter(c => slugsToFind.includes(c.slug));
                setRelatedCases(matched);
            }
        };
        fetchCases();

        const observer = new IntersectionObserver(
            (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
            { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
        );
        document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .fade-in-up').forEach(el => observer.observe(el));

        // APPLY SEO META TAGS
        if (dynamicService?.translations) {
            const l = lang as 'pl' | 'en';
            const trans = dynamicService.translations[l] || dynamicService.translations.pl;
            if (trans.metaTitle) document.title = trans.metaTitle;
            if (trans.metaDescription) {
                const metaDesc = document.querySelector('meta[name="description"]');
                if (metaDesc) metaDesc.setAttribute('content', trans.metaDescription);
            }
        }

        return () => observer.disconnect();
    }, [serviceKey, dynamicService, lang]);

    const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    };

    if (!staticService && !dynamicService) return <div>Service not found</div>;

    // Use dynamic data if available, otherwise static
    const displayIcon = dynamicService?.icon || staticService?.icon;
    const displayGradient = dynamicService?.gradient || staticService?.gradient;
    const displayTechs = dynamicService?.techs || staticService?.techs || [];
    const accentColor = displayGradient.match(/#([0-9a-fA-F]{6})/)?.[0] || '#3b82f6';

    return (
        <div className="lp-wrapper">
            <div className="scroll-progress-bar" />
            <Navbar />

            {/* Premium Hero */}
            <section className="relative overflow-hidden" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', paddingTop: '160px', paddingBottom: '80px', background: 'var(--brand-primary)' }}>
                <div style={{ position: 'absolute', top: '10%', left: '20%', width: '40vw', height: '40vw', background: `radial-gradient(circle, ${accentColor}25 0%, transparent 70%)`, filter: 'blur(80px)', zIndex: 0, animation: 'float 10s infinite alternate', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '-20%', right: '10%', width: '30vw', height: '30vw', background: `radial-gradient(circle, ${accentColor}15 0%, transparent 70%)`, filter: 'blur(100px)', zIndex: 0, animation: 'float 14s infinite alternate-reverse', pointerEvents: 'none' }} />

                <div className="container relative z-10">
                    <div className="fade-in-up" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
                        <div style={{
                            fontSize: '4rem', width: '100px', height: '100px', margin: '0 auto 32px',
                            background: `linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02))`,
                            border: `1px solid rgba(255,255,255,0.1)`,
                            boxShadow: `0 0 30px ${accentColor}40`,
                            borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            backdropFilter: 'blur(10px)'
                        }}>
                            {displayIcon}
                        </div>
                        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '24px' }}>
                            {T(`${serviceKey}.title`)}
                        </h1>
                        <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '32px' }}>
                            {T(`${serviceKey}.subtitle`)}
                        </p>

                        <div style={{ display: 'inline-flex', alignItems: 'center', padding: '12px 24px', background: `${accentColor}15`, border: `1px solid ${accentColor}30`, borderRadius: '999px', fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>
                            {T(`${serviceKey}.price`)}
                        </div>
                    </div>
                </div>
            </section>

            {/* Description & Process */}
            <section className="section relative">
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '40px' }}>
                        <div className="fade-in-up" style={{ gridColumn: 'span 12', gridArea: 'auto/span 7' }}>
                            <div className="premium-glass-panel" style={{ padding: '48px', borderRadius: '32px', height: '100%' }}>
                                <h2 style={{ fontSize: '2rem', marginBottom: '24px', color: 'white' }}>{st(lang, 'about.title')}</h2>
                                <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>
                                    {T(`${serviceKey}.long`)}
                                </p>
                            </div>
                        </div>

                        <div className="fade-in-up" style={{ gridColumn: 'span 12', gridArea: 'auto/span 5', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '8px', paddingLeft: '16px' }}>{st(lang, 'process.title')}</h3>
                            {[1, 2, 3, 4].map((idx) => (
                                <div key={idx} className="premium-glass-panel premium-hover-lift" style={{
                                    padding: '24px', borderRadius: '20px', display: 'flex', alignItems: 'flex-start', gap: '16px', transitionDelay: `${idx * 0.1}s`
                                }}>
                                    <div style={{
                                        minWidth: '36px', height: '36px', borderRadius: '10px',
                                        background: `${accentColor}15`, border: `1px solid ${accentColor}30`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '0.85rem', fontWeight: 800, color: accentColor
                                    }}>0{idx}</div>
                                    <span style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.5 }}>{st(lang, `process.step${idx}`)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Glass Bento */}
            <section className="section bg-grid relative" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'linear-gradient(to bottom, transparent, rgba(5,5,7,0.8))' }}>
                <div className="container">
                    <div className="section-header fade-in-up">
                        <span className="section-label" style={{ padding: '8px 16px', background: `${accentColor}15`, color: accentColor, borderRadius: '999px', border: `1px solid ${accentColor}30` }}>{st(lang, 'discover.label')}</span>
                        <h2 className="section-title">{st(lang, 'features.title')}</h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                        {[1, 2, 3, 4, 5, 6].map((i) => {
                            const featText = T(`${serviceKey}.features.${i}`);
                            if (!featText || featText === `${serviceKey}.features.${i}`) return null;

                            return (
                                <div key={i} className="premium-glass-panel premium-hover-lift fade-in-up" style={{ padding: '32px', borderRadius: '24px', display: 'flex', gap: '16px', alignItems: 'flex-start', animationDelay: `${i * 0.1}s` }}>
                                    <div style={{
                                        minWidth: '36px', height: '36px', borderRadius: '12px',
                                        background: `${accentColor}15`, color: accentColor,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '16px', fontWeight: 'bold', border: `1px solid ${accentColor}30`,
                                        boxShadow: `0 0 15px ${accentColor}20`
                                    }}>✓</div>
                                    <span style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
                                        {featText}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Technologies */}
            <section className="section">
                <div className="container text-center">
                    <h2 className="section-title fade-in-up" style={{ fontSize: '2rem', marginBottom: '40px' }}>{st(lang, 'techs.title')}</h2>
                    <div className="fade-in-up" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
                        {displayTechs.map((tech: string) => (
                            <span key={tech} className="premium-glass-panel premium-hover-lift" style={{
                                padding: '12px 24px', borderRadius: '16px', fontSize: '1rem',
                                fontWeight: 700, letterSpacing: '0.05em', color: 'white',
                                boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
                            }}>{tech}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonial Social Proof */}
            <section className="section relative" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="container" style={{ maxWidth: '760px' }}>
                    <div className="section-header fade-in-up text-center">
                        <h2 className="section-title" style={{ fontSize: '1.8rem' }}>{st(lang, 'testimonial.title')}</h2>
                    </div>
                    <div className="premium-glass-panel fade-in-up" style={{ padding: '48px', borderRadius: '28px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '60%', height: '120px', background: `radial-gradient(circle, ${accentColor}20 0%, transparent 70%)`, filter: 'blur(40px)', pointerEvents: 'none' }} />
                        <div style={{ fontSize: '3rem', color: `${accentColor}60`, marginBottom: '24px', lineHeight: 1, position: 'relative', zIndex: 1 }}>"</div>
                        <p style={{ fontSize: '1.15rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.8, marginBottom: '32px', fontStyle: 'italic', position: 'relative', zIndex: 1 }}>
                            {T(`${serviceKey}.testimonial.quote`)}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
                            <div style={{
                                width: '48px', height: '48px', borderRadius: '50%',
                                background: `linear-gradient(135deg, ${accentColor}, ${accentColor}80)`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 700, fontSize: '1.1rem', color: 'white',
                                boxShadow: `0 0 20px ${accentColor}40`
                            }}>
                                {T(`${serviceKey}.testimonial.author`).charAt(0) || 'T'}
                            </div>
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'white' }}>
                                    {T(`${serviceKey}.testimonial.author`)}
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
                                    {T(`${serviceKey}.testimonial.role`)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Projects */}
            {relatedCases.length > 0 && (
                <section className="section relative" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: 'linear-gradient(to bottom, transparent, rgba(5,5,7,0.8))' }}>
                    <div className="container">
                        <div className="section-header fade-in-up text-center w-full max-w-none" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span className="section-label" style={{ padding: '8px 16px', background: `${accentColor}15`, color: accentColor, borderRadius: '999px', border: `1px solid ${accentColor}30` }}>
                                {lang === 'ar' ? 'معرض الأعمال' : lang === 'szl' ? 'Realizacyje' : 'Portfolio'}
                            </span>
                            <h2 className="section-title">{sectionTitleMap[lang] || sectionTitleMap.en}</h2>
                            <p className="section-subtitle">{sectionSubtitleMap[lang] || sectionSubtitleMap.en}</p>
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', padding: '20px 0 40px', justifyContent: 'center' }}>
                            {relatedCases.map((item: any, idx) => {
                                const slug = item.slug || `case-${idx}`;
                                const color = item.color || accentColor;
                                const category = item.translations?.[lang]?.category || item.translations?.en?.category || item.category || 'Project';
                                const title = item.translations?.[lang]?.title || item.translations?.en?.title || item.title || 'Project Title';
                                const description = item.translations?.[lang]?.description || item.translations?.en?.description || item.description || 'Description';
                                const image = resolveImage(item, title);

                                return (
                                    <a
                                        key={slug + idx}
                                        href={item.translations ? `/cases/view?slug=${slug}` : `/cases/${slug}`}
                                        onMouseMove={handleMouseMove}
                                        className="premium-glass-panel premium-card-glow fade-in-up"
                                        style={{
                                            padding: '40px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            textDecoration: 'none',
                                            color: 'inherit',
                                            borderRadius: '28px',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            minHeight: '420px',
                                            width: '100%',
                                            maxWidth: '480px',
                                            border: '1px solid rgba(255,255,255,0.05)',
                                            background: 'rgba(255,255,255,0.02)'
                                        }}
                                    >
                                        {image && (
                                            <div style={{ position: 'relative', width: '100%', height: '220px', borderRadius: '20px', overflow: 'hidden', marginBottom: '24px' }}>
                                                <Image src={image.startsWith('http') || image.startsWith('/') ? image : `/${image}`} alt={title} fill style={{ objectFit: 'cover' }} />
                                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.6) 100%)' }} />
                                            </div>
                                        )}
                                        <div style={{ position: 'absolute', top: 0, right: 0, width: '180px', height: '180px', background: `radial-gradient(circle, ${color}30 0%, transparent 70%)`, filter: 'blur(30px)', pointerEvents: 'none', zIndex: 1 }} />
                                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px', display: 'inline-flex', alignItems: 'center', gap: '8px', position: 'relative', zIndex: 2 }}>
                                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: color, flexShrink: 0 }} />
                                            {category}
                                        </div>
                                        <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', lineHeight: 1.3, position: 'relative', zIndex: 2, fontWeight: 800 }}>{title}</h3>
                                        <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.6)', marginBottom: '32px', flexGrow: 1, lineHeight: 1.6, position: 'relative', zIndex: 2 }}>{description}</p>

                                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px' }}>
                                            {item.translations?.[lang]?.results || item.translations?.en?.results ? (
                                                <div style={{ fontSize: '0.9rem', color: 'white', fontWeight: 700, lineHeight: 1.5 }}>
                                                    🚀 {item.translations?.[lang]?.results || item.translations?.en?.results}
                                                </div>
                                            ) : (
                                                <div style={{ display: 'flex', gap: '32px' }}>
                                                    <div>
                                                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>100%</div>
                                                        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '4px' }}>ROI</div>
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>2x</div>
                                                        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '4px' }}>Wzrost</div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* Premium CTA */}
            <section className="relative overflow-hidden" style={{ padding: '120px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: displayGradient, opacity: 0.15, zIndex: 0 }} />
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100vw', height: '100vw', background: `radial-gradient(circle, ${accentColor}30 0%, transparent 60%)`, filter: 'blur(100px)', zIndex: 0, pointerEvents: 'none' }} />

                <div className="container relative z-10 text-center fade-in-up">
                    <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, marginBottom: '24px', letterSpacing: '-0.02em', color: 'white' }}>{st(lang, 'cta.title')}</h2>
                    <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.7)', marginBottom: '48px', maxWidth: '600px', margin: '0 auto 48px' }}>{st(lang, 'cta.subtitle')}</p>
                    <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="btn-primary" style={{ padding: '20px 56px', fontSize: '1.2rem', borderRadius: '999px', fontWeight: 700, letterSpacing: '0.05em', background: 'white', color: '#050507', boxShadow: `0 20px 40px ${accentColor}40`, transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)', border: 'none', cursor: 'pointer' }}>
                        {st(lang, 'cta.button')}
                    </button>
                </div>
            </section>

            <ContactSection />
            <Footer />
        </div>
    );

}
