'use client';

import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { addCaseStudy, getCaseStudies, updateCaseStudy, addCampaign, getCampaigns, getOffers, getClients, getContextOS, ContextOSData, logAIOSActivity } from '@/lib/firestoreService';
import { traceAICall } from '@/lib/langfuse';

interface Message {
    role: 'user' | 'bot';
    text: string;
    isAction?: boolean;
}

interface AdminAIAssistantProps {
    isOpen: boolean;
    onClose: () => void;
    onActionDetected?: (intent: string, data: any) => void;
}

const SYSTEM_PROMPT = `Jesteś inteligentnym asystentem zarządzania agencją ECM Digital. 
Masz BEZPOŚREDNI dostęp do bazy danych systemu i możesz wykonywać prawdziwe akcje.

MOŻLIWE AKCJE (gdy użytkownik poprosi o wykonanie czegoś, ZAWSZE zwróć JSON na końcu wiadomości):

1. Dodanie Case Study (pełna wersja):
{"action": "ADD_CASE_STUDY", "data": {
  "title": "Tytuł projektu",
  "category": "AI & Automatyzacja",
  "client": "Nazwa klienta",
  "industry": "Branża",
  "year": "2025",
  "duration": "6 tygodni",
  "description": "Ogólny opis projektu",
  "challenge": "Problem/wyzwanie klienta przed projektem",
  "solution": "Nasze podejście i wdrożone rozwiązanie",
  "results": "Krótkie podsumowanie wyników",
  "resultsStats": [{"value": "+300%", "label": "wzrost leadów"}, {"value": "6 tyg.", "label": "czas realizacji"}],
  "technologies": ["n8n", "Gemini AI", "Firebase"],
  "testimonial": {"quote": "Cytat klienta", "author": "Jan Kowalski", "role": "CEO Firma"},
  "color": "#3b82f6"
}}

2. Edycja Case Study:
{"action": "UPDATE_CASE_STUDY", "data": {"searchTitle": "Tytuł do znalezienia", "updates": {"client": "Nowy klient", "results": "Nowe wyniki"}}}

3. Dodanie Kampanii:
{"action": "ADD_CAMPAIGN", "data": {"name": "Nazwa", "platform": "Google Ads|Meta Ads|LinkedIn Ads", "budget": 5000, "clientName": "Własna lub Klient"}}

4. Sprawdzenie CRM i Statystyk:
{"action": "SHOW_STATS", "data": {}}

5. Dodanie Zadania:
{"action": "ADD_TASK", "data": {"title": "Nazwa zadania", "priority": "high|medium|low"}}

ZASADY:
1. Odpowiadaj ZAWSZE po polsku, krótko i konkretnie. Twoim celem jest pomóc zarządzać agencją.
2. Na bieżąco podsumowuj sytuację biznesową (dane, które podaje JSON). 
3. Przy dodawaniu kampanii pytaj o nazwę i budżet jeśli brakuje informacji. Start automatycznie dziś, koniec za 30 dni.
4. Przy edycji case study: dopasuj "searchTitle", wymień aktualizacje.
5. Pamiętaj by zawsze ostatecznie zwracać JSON z akcją z powyżej jeśli chcesz wykonać zadanie.`;

export default function AdminAIAssistant({ isOpen, onClose, onActionDetected }: AdminAIAssistantProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [apiKeyStatus, setApiKeyStatus] = useState<'checking' | 'ok' | 'missing'>('checking');
    const [executingAction, setExecutingAction] = useState<string | null>(null);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [voiceEnabled, setVoiceEnabled] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const recognitionRef = useRef<any>(null);
    const [contextOS, setContextOS] = useState<ContextOSData | null>(null);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{
                role: 'bot',
                text: '👋 Cześć! Jestem Twoim asystentem AI z dostępem do bazy danych i **Context OS** firmy. Znam Twój Tone of Voice, procedury (SOPs) i cele biznesowe.\n\nCo chcesz zrobić?'
            }]);
            setTimeout(() => inputRef.current?.focus(), 300);
            // Load Context OS on open
            getContextOS().then(ctx => setContextOS(ctx)).catch(e => console.error('Context OS load error:', e));
        }
    }, [isOpen]);

    useEffect(() => {
        const winKey = (window as any).NEXT_PUBLIC_GEMINI_API_KEY;
        const envKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        const localKey = typeof localStorage !== 'undefined' ? localStorage.getItem('GEMINI_API_KEY') : null;
        const key = [winKey, envKey, localKey].find(k => k && k !== 'undefined' && k !== '');
        setApiKeyStatus(key ? 'ok' : 'missing');
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping, executingAction]);

    // ── Text-to-speech ──────────────────────────────────────────────
    const speak = (text: string) => {
        if (!voiceEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        // Strip markdown bold/italic and action emojis for cleaner speech
        const clean = text.replace(/\*\*/g, '').replace(/[✅❌⚠️🚀]/g, '').trim();
        const utter = new SpeechSynthesisUtterance(clean);
        utter.lang = 'pl-PL';
        utter.rate = 1.05;
        utter.pitch = 1.0;
        utter.onstart = () => setIsSpeaking(true);
        utter.onend = () => setIsSpeaking(false);
        utter.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utter);
    };

    const stopSpeaking = () => {
        window.speechSynthesis?.cancel();
        setIsSpeaking(false);
    };

    // ── Speech recognition ──────────────────────────────────────────
    const toggleListening = () => {
        const SpeechRecognition =
            (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('Twoja przeglądarka nie obsługuje rozpoznawania mowy. Spróbuj Chrome.');
            return;
        }

        if (isListening && recognitionRef.current) {
            recognitionRef.current.stop();
            return;
        }

        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.lang = 'pl-PL';
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;
        recognition.continuous = false;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = () => setIsListening(false);

        recognition.onresult = (event: any) => {
            const transcript = Array.from(event.results)
                .map((r: any) => r[0].transcript)
                .join('');
            setInput(transcript);
            // Auto-send when speech ends
            if (event.results[event.results.length - 1].isFinal) {
                setTimeout(() => {
                    handleSend(transcript);
                    setInput('');
                }, 300);
            }
        };

        recognition.start();
    };

    const getApiKey = (): string | null => {
        const winKey = (window as any).NEXT_PUBLIC_GEMINI_API_KEY;
        const envKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        const localKey = typeof localStorage !== 'undefined' ? localStorage.getItem('GEMINI_API_KEY') : null;
        return [winKey, envKey, localKey].find(k => k && k !== 'undefined' && k !== '') || null;
    };

    const executeAction = async (action: string, data: any): Promise<string> => {
        setExecutingAction(action);
        try {
            switch (action) {
                case 'ADD_CASE_STUDY': {
                    const existingCases = await getCaseStudies();
                    const maxOrder = existingCases.reduce((max, c) => Math.max(max, c.order || 0), 0);
                    const slug = data.slug || (data.title || '').toLowerCase()
                        .replace(/[ąśćźżłóęń]/g, (c: string) => ({ ą: 'a', ś: 's', ć: 'c', ź: 'z', ż: 'z', ł: 'l', ó: 'o', ę: 'e', ń: 'n' }[c] || c))
                        .replace(/\s+/g, '-')
                        .replace(/[^a-z0-9-]/g, '');

                    await addCaseStudy({
                        slug,
                        color: data.color || '#3b82f6',
                        order: maxOrder + 1,
                        featured: false,
                        year: data.year || new Date().getFullYear().toString(),
                        duration: data.duration || undefined,
                        translations: {
                            pl: {
                                category: data.category || 'Case Study',
                                title: data.title,
                                client: data.client || undefined,
                                industry: data.industry || undefined,
                                description: data.description || '',
                                challenge: data.challenge || undefined,
                                solution: data.solution || undefined,
                                results: data.results || undefined,
                                resultsStats: Array.isArray(data.resultsStats) && data.resultsStats.length ? data.resultsStats : undefined,
                                technologies: Array.isArray(data.technologies) && data.technologies.length ? data.technologies : undefined,
                                testimonial: data.testimonial?.quote ? data.testimonial : undefined,
                            }
                        }
                    });
                    onActionDetected?.('ADD_CASE_STUDY', data);
                    window.dispatchEvent(new CustomEvent('case-study-added'));
                    return `✅ Case study **"${data.title}"** zostało dodane i pojawi się na liście automatycznie!`;
                }

                case 'UPDATE_CASE_STUDY': {
                    if (!data.searchTitle || !data.updates) return `❌ Brak parametru searchTitle lub updates do edycji.`;
                    const existingCases = await getCaseStudies();

                    // Proste wyszukiwanie po tytule lub slugu
                    const term = data.searchTitle.toLowerCase();
                    const target = existingCases.find((c: any) => {
                        const t = c.translations?.pl?.title?.toLowerCase() || '';
                        return t.includes(term) || c.slug.includes(term);
                    });

                    if (!target) {
                        return `❌ Nie znaleziono case study pasującego do tytułu: "${data.searchTitle}". Posiadamy m.in.: ${existingCases.slice(0, 3).map((c: any) => c.translations?.pl?.title || c.slug).join(', ')}`;
                    }

                    const tUpdates = data.updates;
                    const u: any = {};
                    if (tUpdates.year) u.year = tUpdates.year;
                    if (tUpdates.duration) u.duration = tUpdates.duration;
                    if (tUpdates.color) u.color = tUpdates.color;

                    // Merge existing translation with updates
                    const existingPl = (target.translations?.pl || {}) as any;
                    const mergedPl: any = { ...existingPl };

                    ['title', 'category', 'client', 'industry', 'description', 'challenge', 'solution', 'results'].forEach(k => {
                        if (tUpdates[k] !== undefined) mergedPl[k] = tUpdates[k];
                    });
                    if (tUpdates.resultsStats !== undefined) mergedPl.resultsStats = tUpdates.resultsStats;
                    if (tUpdates.technologies !== undefined) mergedPl.technologies = tUpdates.technologies;
                    if (tUpdates.testimonial !== undefined) mergedPl.testimonial = tUpdates.testimonial;

                    u.translations = { ...target.translations, pl: mergedPl };

                    await updateCaseStudy(target.id, u);
                    onActionDetected?.('UPDATE_CASE_STUDY', data);
                    window.dispatchEvent(new CustomEvent('case-study-added')); // Re-fetch
                    return `✅ Zaktualizowano case study: **"${existingPl.title}"**. Zmiany wkrótce pojawią się na liście.`;
                }

                case 'ADD_CAMPAIGN': {
                    const today = new Date();
                    const nextMonth = new Date();
                    nextMonth.setMonth(today.getMonth() + 1);

                    await addCampaign({
                        name: data.name,
                        platform: data.platform || 'Google Ads',
                        status: 'Planowana',
                        budget: data.budget || 0,
                        spent: 0,
                        clicks: 0,
                        conversions: 0,
                        cpa: 0,
                        clientId: 'assistant-created',
                        clientName: data.clientName || 'Klient AI',
                        startDate: today.toISOString().split('T')[0],
                        endDate: nextMonth.toISOString().split('T')[0],
                    });

                    window.dispatchEvent(new CustomEvent('campaign-added'));
                    return `✅ Kampania **"${data.name}"** (${data.platform}) z budżetem ${data.budget} PLN została pomyślnie utworzona i ustawiona jako "Planowana".`;
                }

                case 'SHOW_STATS': {
                    const campaigns = await getCampaigns();
                    const cases = await getCaseStudies();
                    const offers = await getOffers();
                    const clientsList = await getClients();

                    const totalBudget = campaigns.reduce((sum: number, c: any) => sum + (c.budget || 0), 0);
                    const totalSpent = campaigns.reduce((sum: number, c: any) => sum + (c.spent || 0), 0);
                    const pendingOffers = offers.filter((o: any) => o.status === 'pending').length;

                    return `📊 **Szybkie podsumowanie agencji:**
- **Klienci (CRM):** Masz ${clientsList.length} klientów w bazie. Stali klienci: ${clientsList.filter(c => c.status === 'Klient').length}.
- **Kampanie reklamowe:** ${campaigns.length} uruchomionych/zaplanowanych. Wykorzystano ${totalSpent} PLN z ${totalBudget} PLN budżetu.
- **Lead / Oferty:** ${pendingOffers} otwartych spraw / oczekujących formularzy.
- **Case Studies:** ${cases.length} publikacji w portfolio.

W czym jeszcze mogę Ci pomóc?`;
                }

                case 'ADD_TASK': {
                    onActionDetected?.('ADD_TASK', data);
                    return `✅ Zadanie **"${data.title}"** zostało zapisane.`;
                }

                default:
                    return `⚠️ Nieznana akcja: ${action}`;
            }
        } catch (error: any) {
            console.error('Action error:', error);
            return `❌ Błąd wykonania akcji: ${error.message}`;
        } finally {
            setExecutingAction(null);
        }
    };

    const addMsg = (msg: Message) => setMessages(prev => [...prev, msg]);

    const handleSend = async (text: string = input) => {
        if (!text.trim()) return;
        const userMessage = text.trim();
        setInput('');
        addMsg({ role: 'user', text: userMessage });
        setIsTyping(true);

        try {
            const apiKey = getApiKey();
            if (!apiKey) {
                addMsg({ role: 'bot', text: '⚠️ Brak klucza API Gemini. Ustaw `NEXT_PUBLIC_GEMINI_API_KEY` w `.env.local`.' });
                return;
            }

            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

            const historyContext = messages.slice(-8).map(m =>
                `${m.role === 'bot' ? 'Asystent' : 'Admin'}: ${m.text}`
            ).join('\n');

            // Inject Context OS into prompt
            let contextBlock = '';
            if (contextOS) {
                contextBlock = `\n\n═══ CONTEXT OS (wiedza firmy – ZAWSZE uwzględniaj) ═══\n`;
                if (contextOS.toneOfVoice) contextBlock += `\n[TONE OF VOICE]\n${contextOS.toneOfVoice}\n`;
                if (contextOS.sops) contextBlock += `\n[PROCEDURY SOP]\n${contextOS.sops}\n`;
                if (contextOS.businessGoals) contextBlock += `\n[CELE BIZNESOWE]\n${contextOS.businessGoals}\n`;
                if (contextOS.customInstructions) contextBlock += `\n[DODATKOWE INSTRUKCJE]\n${contextOS.customInstructions}\n`;
                if (contextOS.meetingNotes) contextBlock += `\n[OSTATNIE NOTATKI ZE SPOTKAŃ]\n${contextOS.meetingNotes.slice(0, 2000)}\n`;
                contextBlock += `═══ KONIEC CONTEXT OS ═══\n`;
            }

            const fullPrompt = `${SYSTEM_PROMPT}${contextBlock}\n\nHistoria:\n${historyContext}\n\nAdmin: ${userMessage}\nAsystent:`;
            const result = await model.generateContent(fullPrompt);
            let responseText = result.response.text().trim();

            // Trace with Langfuse
            traceAICall({
                name: 'admin-assistant',
                input: userMessage,
                output: responseText,
                metadata: { historyLength: messages.length },
            });

            // AIOS Activity Log
            logAIOSActivity({
                source: 'admin-assistant',
                role: 'user',
                text: userMessage,
                lang: 'pl',
            });
            logAIOSActivity({
                source: 'admin-assistant',
                role: 'bot',
                text: responseText.slice(0, 500),
                lang: 'pl',
                metadata: { hasAction: responseText.includes('"action"') },
            });

            // Find JSON action using balanced-brace approach (regex fails on nested objects)
            const findActionJSON = (text: string): { json: any; raw: string } | null => {
                const startIdx = text.indexOf('{"action"');
                if (startIdx === -1) return null;
                let depth = 0;
                let endIdx = -1;
                for (let i = startIdx; i < text.length; i++) {
                    if (text[i] === '{') depth++;
                    else if (text[i] === '}') {
                        depth--;
                        if (depth === 0) { endIdx = i; break; }
                    }
                }
                if (endIdx === -1) return null;
                const raw = text.slice(startIdx, endIdx + 1);
                try {
                    return { json: JSON.parse(raw), raw };
                } catch { return null; }
            };

            const actionResult = findActionJSON(responseText);

            if (actionResult) {
                const textWithoutJson = responseText.replace(actionResult.raw, '').trim();
                if (textWithoutJson) addMsg({ role: 'bot', text: textWithoutJson });
                setIsTyping(false);
                const execResult = await executeAction(actionResult.json.action, actionResult.json.data);
                addMsg({ role: 'bot', text: execResult, isAction: true });
                // Speak the action result
                speak(textWithoutJson || execResult);
            } else {
                addMsg({ role: 'bot', text: responseText });
                speak(responseText);
            }
        } catch (error: any) {
            console.error('Admin AI error:', error);
            addMsg({ role: 'bot', text: `❌ Błąd połączenia z AI: ${error.message}` });
        } finally {
            setIsTyping(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 200,
            display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end',
            padding: '24px', pointerEvents: 'none',
        }}>
            <div onClick={onClose} style={{
                position: 'fixed', inset: 0,
                background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
                pointerEvents: 'all',
            }} />

            <div style={{
                position: 'relative', width: '440px', height: '620px',
                background: 'rgba(10,10,20,0.97)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '24px', display: 'flex', flexDirection: 'column',
                overflow: 'hidden',
                boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)',
                pointerEvents: 'all', backdropFilter: 'blur(20px)',
            }}>
                {/* Glow */}
                <div style={{
                    position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                    width: '200px', height: '100px',
                    background: 'radial-gradient(ellipse, rgba(59,130,246,0.25) 0%, transparent 70%)',
                    filter: 'blur(20px)', pointerEvents: 'none', zIndex: 0,
                }} />

                {/* Header */}
                <div style={{
                    padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    position: 'relative', zIndex: 1,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                            width: 42, height: 42, borderRadius: 13,
                            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                        }}>🤖</div>
                        <div>
                            <div style={{ fontSize: 15, fontWeight: 700, color: 'white' }}>Asystent AI</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <div style={{
                                    width: 6, height: 6, borderRadius: '50%',
                                    background: apiKeyStatus === 'ok' ? '#10b981' : '#f59e0b',
                                    boxShadow: apiKeyStatus === 'ok' ? '0 0 6px #10b981' : '0 0 6px #f59e0b',
                                }} />
                                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
                                    {apiKeyStatus === 'ok' ? 'Gemini • Dostęp do bazy danych' : 'Brak klucza API'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {/* TTS toggle */}
                        <button
                            onClick={() => { setVoiceEnabled(v => !v); if (isSpeaking) stopSpeaking(); }}
                            title={voiceEnabled ? 'Wyłącz mowę' : 'Włącz mowę'}
                            style={{
                                width: 32, height: 32, borderRadius: 10,
                                background: voiceEnabled ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.05)',
                                border: voiceEnabled ? '1px solid rgba(59,130,246,0.3)' : '1px solid rgba(255,255,255,0.08)',
                                color: voiceEnabled ? '#3b82f6' : 'rgba(255,255,255,0.3)',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15,
                            }}
                        >{voiceEnabled ? '🔊' : '🔇'}</button>
                        <button onClick={onClose} style={{
                            width: 32, height: 32, borderRadius: 10,
                            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                            color: 'rgba(255,255,255,0.4)', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                        }}>✕</button>
                    </div>
                </div>

                {/* Messages */}
                <div ref={scrollRef} style={{
                    flex: 1, overflowY: 'auto', padding: '16px',
                    display: 'flex', flexDirection: 'column', gap: 12,
                }}>
                    {messages.map((msg, idx) => (
                        <div key={idx} style={{
                            display: 'flex',
                            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        }}>
                            <div style={{
                                maxWidth: '88%',
                                padding: '11px 15px',
                                borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                background: msg.isAction
                                    ? 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05))'
                                    : msg.role === 'user'
                                        ? 'linear-gradient(135deg, #3b82f6, #6366f1)'
                                        : 'rgba(255,255,255,0.06)',
                                border: msg.isAction
                                    ? '1px solid rgba(16,185,129,0.3)'
                                    : msg.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.08)',
                                fontSize: 13.5, lineHeight: 1.65,
                                color: 'white', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                            }}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div style={{ display: 'flex', gap: 5, padding: '8px 14px', alignItems: 'center' }}>
                            {[0, 1, 2].map(i => (
                                <div key={i} style={{
                                    width: 8, height: 8, borderRadius: '50%',
                                    background: 'rgba(59,130,246,0.7)',
                                    animation: `bounce 1.2s ${i * 0.2}s infinite`,
                                }} />
                            ))}
                        </div>
                    )}
                    {executingAction && (
                        <div style={{
                            padding: '10px 16px', borderRadius: 14,
                            background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)',
                            fontSize: 12, color: 'rgba(255,255,255,0.6)',
                            display: 'flex', alignItems: 'center', gap: 8
                        }}>
                            <div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid #3b82f6', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
                            Wykonuję: {executingAction}...
                        </div>
                    )}
                </div>

                {/* Quick actions */}
                <div style={{ padding: '8px 14px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {['Dodaj case study', 'Podaj statystyki agencji', 'Zaplanuj kampanię'].map(s => (
                        <button key={s} onClick={() => handleSend(s)} style={{
                            padding: '6px 12px', borderRadius: 999,
                            background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)',
                            color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 600,
                            cursor: 'pointer', transition: 'all 0.2s',
                        }}>{s}</button>
                    ))}
                </div>

                {/* Input */}
                <div style={{
                    padding: '12px 14px', borderTop: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex', gap: 8, alignItems: 'center',
                }}>
                    {/* Mic button */}
                    <button
                        onClick={toggleListening}
                        title={isListening ? 'Zatrzymaj nagrywanie' : 'Nagraj polecenie głosowe'}
                        style={{
                            width: 44, height: 44, borderRadius: 14, border: 'none',
                            background: isListening
                                ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                                : 'rgba(255,255,255,0.07)',
                            cursor: 'pointer', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', fontSize: 18, flexShrink: 0,
                            boxShadow: isListening ? '0 0 0 3px rgba(239,68,68,0.3)' : 'none',
                            animation: isListening ? 'micPulse 1.2s infinite' : 'none',
                            transition: 'all 0.2s',
                        }}
                    >{isListening ? '⏹' : '🎤'}</button>

                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                        placeholder={isListening ? '🎙 Słucham...' : 'Napisz lub powiedz polecenie...'}
                        style={{
                            flex: 1, padding: '12px 16px',
                            background: isListening ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.05)',
                            border: isListening ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 14, color: 'white', fontSize: 14, outline: 'none',
                            transition: 'all 0.3s',
                        }}
                    />

                    {/* Stop speaking / Send */}
                    {isSpeaking ? (
                        <button onClick={stopSpeaking} style={{
                            width: 44, height: 44, borderRadius: 14,
                            background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.3)',
                            cursor: 'pointer', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', color: '#fbbf24', fontSize: 18, flexShrink: 0,
                        }}>⏸</button>
                    ) : (
                        <button onClick={() => handleSend()} disabled={!input.trim() || isTyping} style={{
                            width: 44, height: 44, borderRadius: 14,
                            background: input.trim() ? 'linear-gradient(135deg, #3b82f6, #6366f1)' : 'rgba(255,255,255,0.05)',
                            border: 'none', cursor: input.trim() ? 'pointer' : 'default',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontSize: 18, transition: 'all 0.2s', flexShrink: 0,
                            boxShadow: input.trim() ? '0 4px 15px rgba(59,130,246,0.4)' : 'none',
                        }}>→</button>
                    )}
                </div>

                <style>{`
                    @keyframes bounce { 0%,80%,100%{transform:scale(0.6);opacity:0.4} 40%{transform:scale(1);opacity:1} }
                    @keyframes spin { to{transform:rotate(360deg)} }
                    @keyframes micPulse { 0%,100%{box-shadow:0 0 0 3px rgba(239,68,68,0.3)} 50%{box-shadow:0 0 0 8px rgba(239,68,68,0.1)} }
                `}</style>
            </div>
        </div>
    );
}
