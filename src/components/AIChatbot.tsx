'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Lang } from '@/translations';
import { trackAIChat, trackCTAClick } from '@/lib/ga';
import { saveAIChatMessage, submitAIFeedback, getUserProjects, logAIOSActivity } from '@/lib/firestoreService';
import { useAuth } from '@/context/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { traceAICall } from '@/lib/langfuse';
import { useLanguage } from '@/context/LanguageContext';

interface Message {
    role: 'user' | 'bot';
    text: string;
}

export default function AIChatbot() {
    const pathname = usePathname();
    const { T, lang: globalLang } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [sessionId, setSessionId] = useState<string>('');
    const [feedbackSent, setFeedbackSent] = useState<Record<number, boolean>>({});
    const [isOnline, setIsOnline] = useState(false);
    const { user } = useAuth();
    const scrollRef = useRef<HTMLDivElement>(null);
    const kbData = useRef<any>(null);

    // Hooks must be called before any conditional returns
    const isVisible = !pathname?.startsWith('/admin');

    useEffect(() => {
        setHasMounted(true);

        // Session ID
        let sId = sessionStorage.getItem('ecm-ai-session');
        if (!sId) {
            sId = uuidv4();
            sessionStorage.setItem('ecm-ai-session', sId);
        }
        setSessionId(sId);

        // Load Knowledge Base
        const loadKB = async () => {
            try {
                const kbUrl = `/kb-ecm.json?v=${Date.now()}`;
                const response = await fetch(kbUrl);
                if (response.ok) {
                    kbData.current = await response.json();
                }
            } catch (error) {
                console.error('❌ KB Load Error:', error);
            }
        };
        loadKB();

        // Check Online Status
        const checkGemini = () => {
            const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
                localStorage.getItem('NEXT_PUBLIC_GEMINI_API_KEY') ||
                localStorage.getItem('GEMINI_API_KEY') ||
                localStorage.getItem('gemini_api_key');
            if (apiKey) {
                setIsOnline(true);
            } else {
                console.warn('⚠️ No Gemini API Key found in env or localStorage');
                setIsOnline(false);
            }
        };
        checkGemini();
    }, []);

    // Effect for greeting on language change
    useEffect(() => {
        if (hasMounted && messages.length === 0) {
            const greeting = getGreeting(globalLang);
            addBotMessage(greeting);
        }
    }, [hasMounted, globalLang]);

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
                lang: globalLang,
                userId: user?.uid
            });
        }
    };

    const handleSend = async (text: string, audioBase64?: string) => {
        if (!text.trim() && !audioBase64) return;

        if (text) {
            setMessages(prev => [...prev, { role: 'user', text }]);
        } else if (audioBase64) {
            setMessages(prev => [...prev, { role: 'user', text: T('chatbot.audioMessage') || '🎤 Audio Message' }]);
        }

        setInputValue('');
        setIsTyping(true);
        trackAIChat('message_sent');

        // Save User Message
        if (sessionId) {
            saveAIChatMessage({
                sessionId,
                role: 'user',
                text: text || '[Audio Message]',
                lang: globalLang,
                userId: user?.uid
            });
            logAIOSActivity({
                source: 'chatbot',
                role: 'user',
                text: text || '[Audio Message]',
                lang: globalLang,
                userId: user?.uid,
                metadata: { lang: globalLang, sessionId, hasAudio: !!audioBase64 },
            });
        }

        try {
            // Prepare context
            const historyContext = messages.slice(-5).map(m => `${m.role === 'bot' ? 'Asystent' : 'Użytkownik'}: ${m.text}`).join('\n');

            let clientProjectsContext = '';
            if (user?.uid) {
                try {
                    const projects = await getUserProjects(user.uid);
                    if (projects && projects.length > 0) {
                        clientProjectsContext = `\nZALOGOWANY KLIENT MA OBECNIE NASTĘPUJĄCE PROJEKTY (ZLECENIA) IN PROGRESS:\n`;
                        clientProjectsContext += projects.map(p => `- Projekt: "${p.title}", Status: "${p.status}", Progres: ${p.progress}%`).join('\n');
                    }
                } catch (e) { console.error('Project context error:', e); }
            }

            const systemPrompt = `You are an official AI Assistant for ECM Digital agency. 
Your goal is to help clients with services: Shopify, Wix, AI Agents, n8n automations, Web Development.
Current language: ${globalLang}.

DANE O FIRMIE (BASE):
${kbData.current ? JSON.stringify(kbData.current) : 'ECM Digital - Software & AI Agency.'}

HISTORIA ROZMOWY:
${historyContext}
${clientProjectsContext}

Reply in ${globalLang} language only. Be professional and helpful. If language is 'szl', use Silesian dialect (śląska gwara).`;

            // Call internal API route
            const response = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: text,
                    audio: audioBase64,
                    systemPrompt: systemPrompt
                })
            });

            if (response.ok) {
                const data = await response.json();
                const responseText = data.text;
                setIsOnline(true);
                addBotMessage(responseText.trim());

                traceAICall({
                    name: 'public-chatbot',
                    input: text || '[Audio]',
                    output: responseText.trim(),
                    userId: user?.uid,
                    metadata: { lang: globalLang, sessionId, hasAudio: !!audioBase64 },
                });

                logAIOSActivity({
                    source: 'chatbot',
                    role: 'bot',
                    text: responseText.trim().slice(0, 500),
                    lang: globalLang,
                    userId: user?.uid,
                    sessionId,
                });
            } else {
                throw new Error('API Error');
            }
        } catch (error: any) {
            console.error('❌ Chatbot Fetch Error:', error);
            setIsOnline(false);
            setTimeout(() => {
                const response = getAIResponseFallback(text, globalLang);
                addBotMessage(response);
            }, 800);
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
        ar: ['الأسعار', 'خدمات الذكاء الاصناعي', 'كيف نبدأ؟']
    }[globalLang] || ['Pricing', 'AI Services', 'How to start?'];


    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const reader = new FileReader();
                reader.readAsDataURL(audioBlob);
                reader.onloadend = async () => {
                    const base64Audio = (reader.result as string).split(',')[1];
                    // Send audio to AI
                    handleSend('', base64Audio);
                };
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (err) {
            console.error('Error accessing microphone:', err);
            alert(T('chatbot.noSpeech'));
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const toggleListening = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    if (!hasMounted || !isVisible) return null;

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
                                {msg.role === 'bot' ? T('chatbot.assistant') : T('chatbot.client')}
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
                                            title={T('chatbot.helpful')}
                                        >
                                            <span className="text-[10px]">👍</span>
                                        </button>
                                        <button
                                            onClick={() => handleFeedback(idx, false)}
                                            className="w-5 h-5 flex items-center justify-center rounded-full bg-white/10 hover:bg-red-500/20 border border-white/10 transition-colors"
                                            title={T('chatbot.notHelpful')}
                                        >
                                            <span className="text-[10px]">👎</span>
                                        </button>
                                    </div>
                                )}
                                {msg.role === 'bot' && feedbackSent[idx] && (
                                    <div className="absolute -bottom-5 left-0 text-[8px] opacity-40 uppercase font-black tracking-widest text-green-400">
                                        {T('chatbot.feedbackThanks')}
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
                            onClick={toggleListening}
                            className={`chatbot-mic-btn ${isRecording ? 'active' : ''}`}
                            title={T('chatbot.micTitle')}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                {isRecording ? (
                                    <rect x="6" y="6" width="12" height="12" fill="currentColor" />
                                ) : (
                                    <>
                                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                                        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                                        <line x1="12" y1="19" x2="12" y2="23"></line>
                                        <line x1="8" y1="23" x2="16" y2="23"></line>
                                    </>
                                )}
                            </svg>
                        </button>
                        <input
                            type="text"
                            placeholder={isRecording ? T('chatbot.listening') : T('chatbot.placeholder')}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend(inputValue)}
                            className="chatbot-text-input"
                        />
                        <button
                            className="send-button"
                            onClick={() => handleSend(inputValue)}
                            disabled={!inputValue.trim()}
                            aria-label={T('chatbot.send')}
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
