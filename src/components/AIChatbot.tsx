'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Lang, t } from '@/translations';
import { trackAIChat, trackCTAClick } from '@/lib/ga';
import { saveAIChatMessage, submitAIFeedback } from '@/lib/firestoreService';
import { useAuth } from '@/context/AuthContext';
import { v4 as uuidv4 } from 'uuid';

interface Message {
    role: 'user' | 'bot';
    text: string;
}

export default function AIChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [lang, setLang] = useState<Lang>('pl');
    const [sessionId, setSessionId] = useState<string>('');
    const [feedbackSent, setFeedbackSent] = useState<Record<number, boolean>>({});
    const [isOnline, setIsOnline] = useState(false);
    const { user } = useAuth();
    const scrollRef = useRef<HTMLDivElement>(null);
    const kbData = useRef<any>(null);


    useEffect(() => {
        setHasMounted(true);
        const stored = localStorage.getItem('ecm-lang') as Lang;
        if (stored) setLang(stored);

        // Session ID
        let sId = sessionStorage.getItem('ecm-ai-session');
        if (!sId) {
            sId = uuidv4();
            sessionStorage.setItem('ecm-ai-session', sId);
        }
        setSessionId(sId);

        // Initial greeting
        if (messages.length === 0) {
            setTimeout(() => {
                const greeting = getGreeting(stored || 'pl');
                addBotMessage(greeting);
            }, 1000);
        }

        // Load Knowledge Base
        const loadKB = async () => {
            try {
                // Add version/timestamp to bypass cache
                const kbUrl = `/kb-ecm.json?v=${Date.now()}`;
                const response = await fetch(kbUrl);

                if (!response.ok) {
                    console.warn(`⚠️ KB Load Failed: ${response.status} ${response.statusText} for ${kbUrl}`);
                    return;
                }

                const data = await response.json();
                kbData.current = data;
            } catch (error) {
                console.error('❌ KB Syntax/Network Error:', error);
            }
        };
        loadKB();

        // Ensure Gemini client check
        const checkGemini = () => {
            const winKey = (window as any).NEXT_PUBLIC_GEMINI_API_KEY;
            const envKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
            const localKey = localStorage.getItem('GEMINI_API_KEY');

            // Filter out "undefined" or empty strings
            const apiKey = [winKey, envKey, localKey].find(k => k && k !== 'undefined' && k !== '');
            const hasClientClass = !!(window as any).GeminiClient;

            if (apiKey && hasClientClass) {
                if (!(window as any).geminiClient) {
                    (window as any).geminiClient = new (window as any).GeminiClient({ apiKey });
                    console.log('✅ Gemini client initialized (found key)');
                }
                setIsOnline(true);
            } else {
                console.warn('⚠️ Gemini client NOT initialized:', {
                    hasKey: !!apiKey,
                    hasClientClass: hasClientClass
                });
                setIsOnline(false);
            }
        };
        // Retry a few times as scripts might still be loading (custom defer behavior)
        checkGemini();
        setTimeout(checkGemini, 2000);
        setTimeout(checkGemini, 5000);
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const getGreeting = (l: Lang) => {
        const greetings = {
            pl: 'Cześć! Jestem inteligentnym asystentem ECM Digital. W czym mogę Ci dzisiaj pomóc? Znam naszą pełną ofertę, cennik oraz procesy technologiczne.',
            en: 'Hi! I am the ECM Digital AI assistant. How can I help you today? I know our full services, pricing, and tech processes.',
            de: 'Hallo! Ich bin der KI-Assistent von ECM Digital. Wie kann ich Ihnen heute helfen? Ich kenne unsere Dienstleistungen, Preise und Prozesse.',
            szl: 'Szczęść Boże! Jo żech jest inteligentny asystent od ECM Digital. W czym Ci moga pomóc? Znom cało oferta, cennik i jak my to robimy.',
            es: '¡Hola! Soy el asistente de IA de ECM Digital. ¿Cómo puedo ayudarte hoy? Conozco todos nuestros servicios, precios y procesos tecnológicos.',
            ar: 'مرحباً! أنا مساعد الذكاء الاصطناعي لـ ECM Digital. كيف يمكنني مساعدتك اليوم؟ أعرف خدماتنا الكاملة، والأسعار، والعمليات التقنية.'
        };
        return greetings[l];
    };

    const addBotMessage = (text: string) => {
        setMessages(prev => [...prev, { role: 'bot', text }]);
        // Save to Firestore
        if (sessionId) {
            saveAIChatMessage({
                sessionId,
                role: 'bot',
                text,
                lang,
                userId: user?.uid
            });
        }
    };

    const handleSend = async (text: string) => {
        if (!text.trim()) return;

        setMessages(prev => [...prev, { role: 'user', text }]);
        setInputValue('');
        setIsTyping(true);
        trackAIChat('message_sent');

        // Save User Message
        if (sessionId) {
            saveAIChatMessage({
                sessionId,
                role: 'user',
                text,
                lang,
                userId: user?.uid
            });
        }

        try {
            // Re-check gemini client just in case
            if (!(window as any).geminiClient) {
                const winKey = (window as any).NEXT_PUBLIC_GEMINI_API_KEY;
                const envKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
                const localKey = localStorage.getItem('GEMINI_API_KEY');
                const apiKey = [winKey, envKey, localKey].find(k => k && k !== 'undefined' && k !== '');

                if (apiKey && (window as any).GeminiClient) {
                    (window as any).geminiClient = new (window as any).GeminiClient({ apiKey });
                }
            }

            const gemini = (window as any).geminiClient;
            if (gemini && gemini.apiKey) {
                // Prepare context from last 5 messages
                const historyContext = messages.slice(-5).map(m => `${m.role === 'bot' ? 'Asystent' : 'Użytkownik'}: ${m.text}`).join('\n');

                const systemPrompt = `Jesteś oficjalnym asystentem firmy ECM Digital (Agencja Cyfrowa). 
                Twoim zadaniem jest pomagać klientom, odpowiadać na pytania o usługi i zachęcać do kontaktu.
                
                DANE O FIRMIE I OFERCIE (KNOWLEDGE BASE):
                ${JSON.stringify(kbData.current)}
                
                HISTORIA BIEŻĄCEJ ROZMOWY (CONTEXT):
                ${historyContext}
                
                Język odpowiedzi: ${lang === 'pl' ? 'Polski' : lang === 'de' ? 'Niemiecki' : lang === 'szl' ? 'Śląski (Gwara)' : lang === 'es' ? 'Hiszpański' : lang === 'ar' ? 'Arabski' : 'Angielski'}. 
                WAŻNE: Jeśli język to 'szl', ODPOWIADAJ PO ŚLĄSKU (śląska godka). Bądź autentyczny, używaj gwary. Jeśli 'ar', odpowiadaj po ARABSKU. Jeśli 'es' po HISZPAŃSKU.
                
                Zasady:
                1. Bądź profesjonalny i konkretny.
                2. ZAWSZE opieraj się na dostarczonej bazie wiedzy. Jeśli pytają o ceny, podaj konkretne kwoty z bazy (np. Strona BASIC od 3500 PLN).
                3. Jeśli w bazie nie ma informacji, o którą pyta użytkownik, nie zmyślaj. Powiedz, że nie posiadasz tych danych i zachęć do kontaktu na hello@ecm-digital.com.
                4. Skup się na korzyściach płynących ze współpracy z ECM Digital (np. wysoki ROI, nowoczesny tech stack).
                5. Odpowiadaj w formacie tekstowym, używając emoji w sposób umiarkowany i profesjonalny.
                6. Znasz kontekst poprzednich pytań użytkownika z HISTORII ROZMOWY powyżej.`;

                const response = await gemini.generateContent(systemPrompt, text);
                addBotMessage(response);
            } else {
                // Fallback to simulated logic
                setTimeout(() => {
                    const response = getAIResponseFallback(text, lang);
                    addBotMessage(response);
                }, 1000);
            }
        } catch (error) {
            console.error('Gemini Error (Falling back to offline):', error);
            // If API fails, fallback to offline response instead of generic error
            setIsOnline(false);
            setTimeout(() => {
                const response = getAIResponseFallback(text, lang);
                addBotMessage(response);
            }, 1000);
        } finally {
            setIsTyping(false);
        }
    };

    const handleFeedback = async (msgIdx: number, helpful: boolean) => {
        if (feedbackSent[msgIdx]) return;

        try {
            await submitAIFeedback({
                messageId: `msg-${msgIdx}-${sessionId}`,
                sessionId,
                helpful,
                userId: user?.uid
            });
            setFeedbackSent(prev => ({ ...prev, [msgIdx]: true }));
        } catch (err) {
            console.error('Feedback error:', err);
        }
    };

    const getAIResponseFallback = (input: string, l: Lang): string => {
        const q = input.toLowerCase();

        if (l === 'pl') {
            if (q.includes('slasku') || q.includes('śląsku') || q.includes('godosz')) {
                return 'Ja, pewnie że rozumia! My som nowoczesno agencja, ale tradycja szanujemy. Czym moga służyć? (v1.5-Silesia)';
            }
            if (q.includes('starter') && (q.includes('shopify') || q.includes('sklep'))) {
                return 'Najnowsza oferta: Pakiet Shopify STARTER kosztuje od 4,500 do 8,000 PLN netto. Zawiera: customizację szablonu, konfigurację płatności i wysyłki, import produktów (do 50), SEO i szkolenie. Czas: 2-3 tyg. (v1.1)';
            }
            if (q.includes('cena') || q.includes('koszt') || q.includes('ile')) {
                return 'Nasze aktualne usługi: Strony WWW (od 3,5k PLN), Sklepy Shopify (od 4,5k PLN), Agenci AI (od 12k PLN). Dokładna wycena zależy od wybranych funkcjonalności. (v1.1)';
            }
            if (q.includes('usług') || q.includes('oferta')) {
                return 'Specjalizujemy się w: Strony WWW, Sklepy Shopify, Agenci AI, Automatyzacje i MVP. Który obszar Cię interesuje?';
            }
            return 'Obecnie działam w trybie demonstracyjnym (offline). Nasz pełny system AI (Gemini) jest chwilowo niedostępny, ale chętnie zaoferuję pomoc na podstawie standardowego cennika. (v1.5)';
        } else if (l === 'szl') {
            if (q.includes('cena') || q.includes('wiela')) {
                return 'Nasze usługi: Strony WWW (od 3,5k PLN), Sklepy (od 4,5k PLN), Agenty AI (od 12k PLN). Zależy co chcesz. (v1.5-Silesia)';
            }
            return 'Teraz żech jest w trybie demo (offline). Ale jak chcesz pogadać o robocie, to pisz śmiało. (v1.5-Silesia)';
        } else if (l === 'es') {
            return 'Actualmente estoy en modo de demostración (sin conexión). Nuestro sistema completo de IA (Gemini) no está disponible temporalmente, pero estaré encantado de ayudarle basándome en nuestra lista de precios estándar.';
        } else if (l === 'ar') {
            return 'أنا حاليا في الوضع التجريبي (غير متصل). نظام الذكاء الاصطناعي الكامل الخاص بنا (Gemini) غير متاح مؤقتًا، ولكن يسعدني تقديم المساعدة بناءً على قائمة الأسعار القياسية لدينا.';
        } else {
            return 'I am currently in safe mode. Our Shopify Starter package starts from 4,500 PLN. Please ask for details or contact us at hello@ecm-digital.com.';
        }
    };

    const suggestions = {
        pl: ['Cennik usług', 'Oferta AI', 'Jak zacząć?'],
        en: ['Pricing', 'AI Services', 'How to start?'],
        de: ['Preise', 'KI-Dienste', 'Wie fange ich an?'],
        szl: ['Wiela za to?', 'Co robicie?', 'Jak zaczynomy?'],
        es: ['Precios', 'Servicios IA', '¿Cómo empezar?'],
        ar: ['الأسعار', 'خدمات الذكاء الاصطناعي', 'كيف نبدأ؟']
    }[lang] || ['Pricing', 'AI Services', 'How to start?'];


    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;

            recognitionRef.current.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setInputValue(prev => prev + (prev ? ' ' : '') + transcript);
                setIsListening(false);
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error('Speech recognition error', event.error);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    }, []);

    const toggleListening = () => {
        if (!recognitionRef.current) {
            alert(lang === 'pl' ? 'Twoja przeglądarka nie obsługuje rozpoznawania mowy.' : 'Your browser does not support speech recognition.');
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            const langMap: Record<string, string> = {
                'pl': 'pl-PL', 'de': 'de-DE', 'en': 'en-US', 'szl': 'pl-PL', 'es': 'es-ES', 'ar': 'ar-SA'
            };
            recognitionRef.current.lang = langMap[lang] || 'en-US';
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    if (!hasMounted) return null;

    return (
        <div className={`ai-chatbot-wrapper ${isOpen ? 'open' : ''}`}>
            {/* Trigger Button */}
            <button
                className="chatbot-trigger"
                onClick={() => {
                    const nextState = !isOpen;
                    setIsOpen(nextState);
                    if (nextState) {
                        trackCTAClick('Chatbot', 'FloatingTrigger');
                        trackAIChat('chat_start');
                    }
                }}
                aria-label="Open AI Assistant"
            >
                {isOpen ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                ) : (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                )}
            </button>

            {/* Chat Window */}
            <div className="chatbot-window">
                <div className="chatbot-header">
                    <div className="chatbot-header-main">
                        <div className="chatbot-status-wrap">
                            <span className={`status-dot ${isOnline ? '' : 'offline'}`}></span>
                            <span className="chatbot-status-text">
                                {isOnline ? 'AI Online (Gemini)' : 'AI Offline (Demo)'}
                            </span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="chatbot-close-btn" aria-label="Close">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                    <p className="chatbot-subtitle">AI Powered Assistant</p>
                </div>

                <div className="chatbot-messages" ref={scrollRef}>
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`message ${msg.role}`}>
                            <div className="message-label text-[10px] font-bold uppercase tracking-wider opacity-40 mb-1">
                                {msg.role === 'bot' ? 'Asystent ECM' : 'Klient'}
                            </div>
                            <div className={`message-bubble relative group p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'bot'
                                ? 'bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-tl-none shadow-xl shadow-black/5'
                                : 'bg-brand-accent/10 border border-brand-accent/20 text-gray-900 rounded-tr-none ml-auto'
                                }`}>
                                {msg.text}
                                {msg.role === 'bot' && idx > 0 && !feedbackSent[idx] && (
                                    <div className="absolute -bottom-6 left-0 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <button
                                            onClick={() => handleFeedback(idx, true)}
                                            className="w-5 h-5 flex items-center justify-center rounded-full bg-white/10 hover:bg-green-500/20 border border-white/10 transition-colors"
                                            title="Pomocne"
                                        >
                                            <span className="text-[10px]">👍</span>
                                        </button>
                                        <button
                                            onClick={() => handleFeedback(idx, false)}
                                            className="w-5 h-5 flex items-center justify-center rounded-full bg-white/10 hover:bg-red-500/20 border border-white/10 transition-colors"
                                            title="Niepomocne"
                                        >
                                            <span className="text-[10px]">👎</span>
                                        </button>
                                    </div>
                                )}
                                {msg.role === 'bot' && feedbackSent[idx] && (
                                    <div className="absolute -bottom-5 left-0 text-[8px] opacity-40 uppercase font-black tracking-widest text-green-400">
                                        Dziękujemy za feedback!
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="message bot typing">
                            <div className="typing-dots">
                                <span></span><span></span><span></span>
                            </div>
                        </div>
                    )}
                </div>

                {messages.length < 5 && (
                    <div className="chatbot-suggestions">
                        {suggestions.map((s, i) => (
                            <button key={i} className="suggestion-btn" onClick={() => handleSend(s)}>
                                {s}
                            </button>
                        ))}
                    </div>
                )}

                <div className="chatbot-input-area">
                    <div className="chatbot-input-wrapper">
                        <button
                            className={`mic-button ${isListening ? 'listening' : ''}`}
                            onClick={toggleListening}
                            title={lang === 'pl' ? 'Kliknij, aby mówić' : 'Click to speak'}
                        >
                            {isListening ? '⏹️' : (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                                    <line x1="12" y1="19" x2="12" y2="23"></line>
                                    <line x1="8" y1="23" x2="16" y2="23"></line>
                                </svg>
                            )}
                            {isListening && <span className="mic-pulse"></span>}
                        </button>
                        <input
                            type="text"
                            placeholder={isListening ? (lang === 'pl' ? 'Słucham...' : 'Listening...') : (lang === 'pl' ? 'Zadaj pytanie...' : 'Ask a question...')}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend(inputValue)}
                            className="chatbot-text-input"
                        />
                        <button
                            className="send-button"
                            onClick={() => handleSend(inputValue)}
                            disabled={!inputValue.trim()}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
