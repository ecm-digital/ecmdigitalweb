import { NextRequest, NextResponse } from 'next/server';
import { AIService } from '@/services/aiService';
import { getAgencySettings, saveProspect } from '@/lib/firestoreService';

const TELEGRAM_API = 'https://api.telegram.org/bot';

async function sendTelegramMessage(token: string, chatId: string, text: string) {
    try {
        await fetch(`${TELEGRAM_API}${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text,
                parse_mode: 'Markdown'
            })
        });
    } catch (e) {
        console.error('Telegram Send Error:', e);
    }
}

async function scrapeUrlForTelegram(url: string): Promise<string> {
    try {
        const targetUrl = url.startsWith('http') ? url : `https://${url}`;
        const response = await fetch(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            next: { revalidate: 3600 }
        });
        if (!response.ok) return '';
        const html = await response.text();
        const cleanBody = html
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .substring(0, 3000);
        return cleanBody;
    } catch (e) {
        return '';
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const message = body.message;

        if (!message || !message.text) return NextResponse.json({ ok: true });

        const settings = await getAgencySettings();

        // AUTO-ID CAPTURE MODE: If Chat ID is not set yet, reply with the ID
        if (!settings?.telegramChatId && message?.chat?.id) {
            if (settings?.telegramBotToken) {
                await sendTelegramMessage(settings.telegramBotToken, message.chat.id.toString(),
                    "🧬 *ECM Digital ID Capture Mode*\n\n" +
                    "Wykryłem Twoje ID: `" + message.chat.id + "`.\n\n" +
                    "Skopiuj ten numer i wklej go do panelu admina w ECM Digital, a potem zapisz zmiany."
                );
            }
            return NextResponse.json({ ok: true });
        }

        if (!settings?.telegramBotToken || !settings?.telegramChatId) {
            return NextResponse.json({ error: 'Telegram not configured' });
        }

        // Security: Only allow authorized user
        if (message.chat.id.toString() !== settings.telegramChatId.toString()) {
            return NextResponse.json({ ok: true });
        }

        const text = message.text.trim();
        const token = settings.telegramBotToken;
        const chatId = settings.telegramChatId;

        // Command: /start or /help
        if (text === '/start' || text === '/help') {
            await sendTelegramMessage(token, chatId,
                "⚡️ *ECM Digital Command Center 2026*\n\n" +
                "Wyślij mi URL firmy, aby wykonać *Deep Scan* i wygenerować Battle Card.\n\n" +
                "Komendy:\n" +
                "• Wyślij URL -> Analiza AI\n" +
                "• Wyślij tekst -> Szybki draft posta"
            );
            return NextResponse.json({ ok: true });
        }

        // Pattern Check: Is it a URL?
        const isUrl = text.includes('.') && !text.includes(' ') && text.length > 5;

        if (isUrl) {
            await sendTelegramMessage(token, chatId, "🔍 *Rozpoczynam Deep Scan...* Pobieram dane ze strony.");
            const scraped = await scrapeUrlForTelegram(text);

            await sendTelegramMessage(token, chatId, "🧠 *AI analizuje dane...* Generuję Battle Card.");

            const systemPrompt = `Jesteś Sales Botem ECM Digital. Generuj Battle Card dla: ${text}\nDane ze strony: ${scraped}\nBrand DNA: ${settings.aiKnowledge}\nZwróć TYLKO czysty tekst z sekcjami: Firma, Pain Points, Pitch, Hook Wideo.`;
            const aiRes = await AIService.generateContent("Telegram Battle Card", systemPrompt);

            if (!aiRes.error) {
                await sendTelegramMessage(token, chatId, `✅ *BATTLE CARD GOTOWY*\n\n${aiRes.text}`);

                // Track in Pipeline
                try {
                    // Primitive extraction for tracking
                    const companyName = aiRes.text.split('\n')[0].replace('Firma:', '').trim();
                    await saveProspect({
                        companyName: companyName || text,
                        url: text,
                        status: 'New',
                        painPoints: [{ title: 'Zidentyfikowane przez Telegram', desc: '' }],
                        pitch: { title: 'Wygenerowano mobilnie', desc: '' },
                        videoScript: { hook: '', body: '', cta: '' },
                        agentReasoning: 'Analiza wykonana przez Telegram Bot.'
                    });
                    await sendTelegramMessage(token, chatId, "📈 Lead został dodany do *Pipeline* w panelu admina.");
                } catch (e) { }
            } else {
                await sendTelegramMessage(token, chatId, "❌ Błąd AI podczas generowania analizy.");
            }
        } else {
            // General AI Chat / Post Draft
            await sendTelegramMessage(token, chatId, "✍️ *Generuję szkic...*");
            const systemPrompt = `Jesteś AI Copywriterem ECM Digital. Na podstawie teksu: "${text}" przygotuj krótki, mocny wpis na LinkedIn zgodnie z naszym DNA: ${settings.aiKnowledge}`;
            const aiRes = await AIService.generateContent("Telegram Draft", systemPrompt);
            await sendTelegramMessage(token, chatId, aiRes.text || "Błąd generowania.");
        }

        return NextResponse.json({ ok: true });
    } catch (error: any) {
        console.error('Telegram Logic Error:', error);
        return NextResponse.json({ ok: true }); // Always return 200 to Telegram
    }
}
