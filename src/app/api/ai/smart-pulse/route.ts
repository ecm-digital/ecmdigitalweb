import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy, Timestamp, doc, getDoc } from 'firebase/firestore';

export async function POST(req: Request) {
    try {
        const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
        if (!API_KEY) {
            return NextResponse.json({ error: 'AI Configuration missing' }, { status: 500 });
        }

        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

        // ═══ 1. Load Context OS ═══
        let contextOSBlock = '';
        try {
            const ctxDoc = await getDoc(doc(db, 'context_os', 'main'));
            if (ctxDoc.exists()) {
                const ctx = ctxDoc.data();
                if (ctx.toneOfVoice) contextOSBlock += `\n[TONE OF VOICE firmy]: ${ctx.toneOfVoice}\n`;
                if (ctx.businessGoals) contextOSBlock += `[CELE BIZNESOWE]: ${ctx.businessGoals}\n`;
                if (ctx.sops) contextOSBlock += `[PROCEDURY SOP]: ${ctx.sops}\n`;
                if (ctx.customInstructions) contextOSBlock += `[INSTRUKCJE DODATKOWE]: ${ctx.customInstructions}\n`;
            }
        } catch (e) {
            console.error('Context OS load failed:', e);
        }

        // ═══ 2. Fetch Chat Logs (24h) ═══
        let chatSummary = 'Brak nowych wpisów na czacie bota.';
        try {
            const yesterday = Timestamp.fromDate(new Date(Date.now() - 24 * 60 * 60 * 1000));
            const chatQ = query(collection(db, 'ai_chat_logs'), where('createdAt', '>=', yesterday), orderBy('createdAt', 'desc'));
            const chatSnap = await getDocs(chatQ);
            if (!chatSnap.empty) {
                const logs = chatSnap.docs.map(doc => doc.data());
                chatSummary = logs.slice(0, 20).map(l => `[${l.role?.toUpperCase()}] (${l.lang || 'pl'}): ${l.text}`).join('\n');
            }
        } catch (e) { console.error('Chat logs fetch failed:', e); }

        // ═══ 3. Fetch Active Projects ═══
        let projectsSummary = 'Brak aktywnych projektów.';
        try {
            const projQ = query(collection(db, 'user_projects'), where('status', '!=', 'Ukończone'));
            const projSnap = await getDocs(projQ);
            if (!projSnap.empty) {
                const projects = projSnap.docs.map(doc => doc.data());
                projectsSummary = projects.map(p => `- "${p.title}" | Status: ${p.status} | Postęp: ${p.progress}%`).join('\n');
            }
        } catch (e) { console.error('Projects fetch failed:', e); }

        // ═══ 4. Fetch CRM Clients ═══
        let clientsSummary = '';
        try {
            const clientsSnap = await getDocs(collection(db, 'clients'));
            if (!clientsSnap.empty) {
                const clients = clientsSnap.docs.map(doc => doc.data());
                const leads = clients.filter(c => c.status === 'Lead').length;
                const prospects = clients.filter(c => c.status === 'Prospekt').length;
                const active = clients.filter(c => c.status === 'Klient' || c.status === 'VIP').length;
                const totalValue = clients.reduce((s, c) => s + (c.value || 0), 0);
                clientsSummary = `Łącznie ${clients.length} klientów: ${leads} Leadów, ${prospects} Prospektów, ${active} Aktywnych. Łączna wartość: ${totalValue.toLocaleString('pl-PL')} PLN.`;
            }
        } catch (e) { console.error('Clients fetch failed:', e); }

        // ═══ 5. Fetch Campaigns ═══
        let campaignsSummary = '';
        try {
            const campSnap = await getDocs(collection(db, 'campaigns'));
            if (!campSnap.empty) {
                const campaigns = campSnap.docs.map(doc => doc.data());
                const totalBudget = campaigns.reduce((s, c) => s + (c.budget || 0), 0);
                const totalSpent = campaigns.reduce((s, c) => s + (c.spent || 0), 0);
                const utilization = totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(0) : 0;
                campaignsSummary = `${campaigns.length} kampanii. Budżet: ${totalBudget.toLocaleString('pl-PL')} PLN, Wydano: ${totalSpent.toLocaleString('pl-PL')} PLN (${utilization}% wykorzystania).`;
            }
        } catch (e) { console.error('Campaigns fetch failed:', e); }

        // ═══ 6. Fetch Offers ═══
        let offersSummary = '';
        try {
            const offSnap = await getDocs(collection(db, 'offers'));
            if (!offSnap.empty) {
                const offers = offSnap.docs.map(doc => doc.data());
                const pending = offers.filter(o => o.status === 'Wysłana' || o.status === 'Robocza');
                const accepted = offers.filter(o => o.status === 'Zaakceptowana');
                const pendingVal = pending.reduce((s, o) => s + (o.totalPrice || 0), 0);
                const acceptedVal = accepted.reduce((s, o) => s + (o.totalPrice || 0), 0);
                offersSummary = `${offers.length} ofert: ${accepted.length} zaakceptowanych (${acceptedVal.toLocaleString('pl-PL')} PLN), ${pending.length} oczekujących (${pendingVal.toLocaleString('pl-PL')} PLN potencjału).`;
            }
        } catch (e) { console.error('Offers fetch failed:', e); }

        // ═══ 7. Fetch Kanban Tasks ═══
        let tasksSummary = '';
        try {
            const taskSnap = await getDocs(collection(db, 'kanban_tasks'));
            if (!taskSnap.empty) {
                const tasks = taskSnap.docs.map(doc => doc.data());
                const todo = tasks.filter(t => t.status === 'todo').length;
                const inProgress = tasks.filter(t => t.status === 'in-progress').length;
                const done = tasks.filter(t => t.status === 'done').length;
                const highPrio = tasks.filter(t => t.priority === 'high').length;
                tasksSummary = `${tasks.length} zadań: ${todo} do zrobienia, ${inProgress} w trakcie, ${done} ukończonych. Priorytet wysoki: ${highPrio}.`;
            }
        } catch (e) { console.error('Tasks fetch failed:', e); }

        // ═══ 8. Fetch Meetings (today + upcoming) ═══
        let meetingsSummary = '';
        try {
            const meetSnap = await getDocs(collection(db, 'meetings'));
            if (!meetSnap.empty) {
                const meetings = meetSnap.docs.map(doc => doc.data());
                const today = new Date().toISOString().split('T')[0];
                const todayMeetings = meetings.filter(m => m.date === today);
                const upcoming = meetings.filter(m => m.date > today).slice(0, 5);
                if (todayMeetings.length > 0) {
                    meetingsSummary += `DZIŚ: ${todayMeetings.map(m => `${m.time} - ${m.title} (${m.clientName || 'wewnętrzne'})`).join('; ')}. `;
                }
                if (upcoming.length > 0) {
                    meetingsSummary += `Nadchodzące: ${upcoming.map(m => `${m.date} ${m.time} - ${m.title}`).join('; ')}.`;
                }
                if (!meetingsSummary) meetingsSummary = 'Brak spotkań na dziś i w najbliższych dniach.';
            }
        } catch (e) { console.error('Meetings fetch failed:', e); }

        // ═══ BUILD THE DAILY BRIEF PROMPT ═══
        const today = new Date();
        const dayName = today.toLocaleDateString('pl-PL', { weekday: 'long' });
        const dateStr = today.toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });

        const systemPrompt = `Jesteś "Daily Brief OS" - inteligentnym systemem raportowania dla agencji ECM Digital.
Generujesz PORANNY RAPORT DNIA dla właściciela agencji.

${contextOSBlock ? `═══ CONTEXT OS (wiedza o firmie) ═══\n${contextOSBlock}\n═══ KONIEC CONTEXT OS ═══\n` : ''}

FORMAT RAPORTU (MUSISZ go ściśle przestrzegać):

Zacznij od powitania z imieniem dnia: "${dayName}, ${dateStr}"

Następnie podaj sekcje (każda z emoji na początku):

📅 AGENDA DNIA
- Wymień spotkania na dziś i najbliższe terminy. Jeśli brak, zaproponuj co warto zrobić.

📊 PULSE BIZNESOWY
- Podsumuj stan CRM, pipeline, konwersję. Wymień kluczowe liczby (przychód, potencjał).
- Porównaj z celami biznesowymi z Context OS (jeśli dostępne).

📢 KAMPANIE REKLAMOWE
- Stan budżetów, wykorzystanie. Czy coś wymaga uwagi?

📋 ZADANIA & PROJEKTY
- Status Kanbana. Ile pilnych? Czy coś się blokuje?

💡 REKOMENDACJA AI
- 2-3 konkretne, strategiczne rekomendacje na dziś oparte na danych.
- Bądź proaktywny – np. "Wyślij follow-up do Leada X", "Przygotuj ofertę dla Y".

🔥 MOTYWACJA
- Krótkie zdanie motywujące na koniec, dostosowane do kontekstu.

ZASADY:
- Pisz po polsku, konkretnie, bez lania wody.
- Formatuj z emoji i pogrubieniami (markdown).
- Raport max 400 słów, ale treściwy.
- Jeśli dane są puste, nie wymyślaj – napisz "brak danych" i zaproponuj uzupełnienie.

═══ DANE Z SYSTEMU (${dateStr}) ═══

[CRM - KLIENCI]:
${clientsSummary || 'Brak danych CRM.'}

[OFERTY / PIPELINE]:
${offersSummary || 'Brak ofert w systemie.'}

[KAMPANIE REKLAMOWE]:
${campaignsSummary || 'Brak kampanii.'}

[ZADANIA KANBAN]:
${tasksSummary || 'Brak zadań w Kanbanie.'}

[SPOTKANIA]:
${meetingsSummary || 'Brak zaplanowanych spotkań.'}

[PROJEKTY KLIENTÓW]:
${projectsSummary}

[LOGI CHATBOTA (24h)]:
${chatSummary}
═══ KONIEC DANYCH ═══`;

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: systemPrompt }] }],
                generationConfig: {
                    temperature: 0.4,
                    maxOutputTokens: 2048,
                }
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json({ error: data.error?.message || 'Gemini API Error' }, { status: response.status });
        }

        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        return NextResponse.json({ report: text });

    } catch (error) {
        console.error('Daily Brief OS Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
