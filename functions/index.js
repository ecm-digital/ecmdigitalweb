const { onRequest } = require("firebase-functions/v2/https");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { getFirestore, Timestamp, FieldValue } = require("firebase-admin/firestore");
const { initializeApp, getApps } = require("firebase-admin/app");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fetch = require("node-fetch");

// Initialize Firebase Admin correctly
if (getApps().length === 0) {
    initializeApp();
}
const db = getFirestore();

const TELEGRAM_API = "https://api.telegram.org/bot";
const GEMINI_API_KEY = "AIzaSyBv52W9jlS79q4OXA0ifXnmR1_bBnwIMpg";

async function sendTelegramMessage(token, chatId, text) {
    try {
        const response = await fetch(`${TELEGRAM_API}${token}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: chatId.toString(),
                text: text,
                parse_mode: "Markdown"
            })
        });
        const result = await response.text();
        console.log("Telegram Response:", response.status, result);
    } catch (e) {
        console.error("Telegram Send Error:", e);
    }
}

async function scrapeUrlForTelegram(url) {
    try {
        const targetUrl = url.startsWith("http") ? url : `https://${url}`;
        const response = await fetch(targetUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            },
            timeout: 15000
        });
        if (!response.ok) return "";
        const html = await response.text();
        const cleanBody = html
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
            .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
            .replace(/<[^>]+>/g, " ")
            .replace(/\s+/g, " ")
            .trim()
            .substring(0, 3000);
        return cleanBody;
    } catch (e) {
        return "";
    }
}

exports.telegramWebhook = onRequest({ cors: true }, async (req, res) => {
    try {
        const message = req.body?.message;
        if (!message || !message.text) {
            res.status(200).send("No message text");
            return;
        }

        const settingsDoc = await db.collection("settings").doc("agency").get();
        const settings = settingsDoc.data() || {};

        const HARDCODED_TOKEN = "8742583260:AAGSqBp7brk-j_gJDWA4y6wmhPNu-MITdXI";
        const token = settings?.telegramBotToken || HARDCODED_TOKEN;
        const chatId = message.chat.id.toString();

        if (settings.telegramChatId && chatId !== settings.telegramChatId.toString()) {
            res.status(200).send("Unauthorized");
            return;
        }

        if (!settings.telegramChatId) {
            await db.collection("settings").doc("agency").set({
                lastTelegramChatId: chatId,
                telegramChatId: chatId,
                updatedAt: FieldValue.serverTimestamp()
            }, { merge: true });

            await sendTelegramMessage(token, chatId,
                "🧬 *ECM Digital ID Capture Mode*\n\n" +
                "Twój numer ID to: `" + chatId + "`\n\n" +
                "Zapisałem go w Twoich ustawieniach. Od teraz jestem Twoim osobistym asystentem AI."
            );

            res.status(200).send("ID Captured and Saved");
            return;
        }

        const text = message.text.trim();

        if (text === "/start" || text === "/help") {
            await sendTelegramMessage(token, chatId,
                "⚡️ *ECM Digital AI Command Center 2026*\n\n" +
                "🚀 *Zarządzanie agencją z Telegrama!*\n\n" +
                "💥 *Wyślij URL firmy* -> Analiza AI & Lead Pipeline\n" +
                "📝 *Wyślij pomysł* -> Szkic LinkedIn AI"
            );
            res.status(200).send("Commands sent");
            return;
        }

        const isUrl = text.includes(".") && !text.includes(" ") && text.length > 5;
        if (isUrl) {
            await sendTelegramMessage(token, chatId, "🔍 *Rozpoczynam Deep Scan...*");
            const scrapedData = await scrapeUrlForTelegram(text);
            await sendTelegramMessage(token, chatId, "🧠 *AI analizuje dane...*");

            const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent(`Sales Bot ECM Digital. Battle Card for: ${text}\nData: ${scrapedData}\nDNA: ${settings.aiKnowledge || "None"}. Focus: Pain Points, Pitch, Hook.`);
            const aiText = result.response.text();

            await sendTelegramMessage(token, chatId, `✅ *BATTLE CARD*\n\n${aiText}`);

            await db.collection("prospects").add({
                companyName: text,
                url: text,
                status: "New",
                pitch: { title: "Telegram AI Analysis", desc: aiText },
                agentReasoning: "Telegram Bot analysis.",
                createdAt: FieldValue.serverTimestamp(),
                updatedAt: FieldValue.serverTimestamp()
            });
            await sendTelegramMessage(token, chatId, "📈 Lead dodany do *Pipeline*.");
        } else {
            await sendTelegramMessage(token, chatId, "✍️ *Generuję szkic...*");
            const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent(`LinkedIn Post Draft for: "${text}" consistent with ECM Digital DNA.`);
            await sendTelegramMessage(token, chatId, result.response.text());
        }

        res.status(200).send("OK");
    } catch (error) {
        console.error("Function Error:", error);
        res.status(200).send("Error: " + error.message);
    }
});

exports.onLeadCreate = onDocumentCreated("agency_clients/{clientId}", async (event) => {
    try {
        const snapshot = event.data;
        if (!snapshot) return;
        const lead = snapshot.data();

        // 1. Only process new leads (avoid trigger on updates if status changes, but onDocumentCreated only runs on creation)
        if (lead.status !== 'Lead') {
            console.log(`Lead status is ${lead.status}, skipping integrations.`);
            return;
        }

        const name = lead.name || '';
        const email = lead.email || '';
        const company = lead.company || '';
        const service = lead.service || '';
        const message = lead.notes || ''; // in firestoreService addLead, notes stores the message

        console.log(`Processing integrations for lead: ${name} (${email})`);

        // Get secrets from environment variables or fallback to Firestore settings
        let HUBSPOT_ACCESS_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN;
        let SMSAPI_TOKEN = process.env.SMSAPI_TOKEN;
        let NOTIFY_PHONE = process.env.NOTIFY_PHONE || process.env.NEXT_PUBLIC_CONTACT_PHONE;

        const settingsDoc = await db.collection("settings").doc("agency").get();
        const settings = settingsDoc.data() || {};

        HUBSPOT_ACCESS_TOKEN = HUBSPOT_ACCESS_TOKEN || settings.hubspotAccessToken;
        SMSAPI_TOKEN = SMSAPI_TOKEN || settings.smsapiToken;
        NOTIFY_PHONE = NOTIFY_PHONE || settings.notifyPhone || settings.contactPhone;

        // --- HubSpot Forms Submission API Integration ---
        try {
            // Split name
            const nameParts = name.trim().split(/\s+/);
            const firstname = nameParts[0] || '';
            const lastname = nameParts.slice(1).join(' ') || '';

            const hsPortalId = '145940599';
            const hsFormId = 'fac0d462-6388-49ef-86ea-a34ee139ddb2';
            const hsUrl = `https://api-eu1.hsforms.com/submissions/v3/integration/submit/${hsPortalId}/${hsFormId}`;

            const hsPayload = {
                fields: [
                    { name: 'email', value: email },
                    { name: 'firstname', value: firstname },
                    { name: 'lastname', value: lastname },
                    { name: 'company', value: company || '' },
                    { name: 'message', value: `Selected Service: ${service || 'None'}\nMessage: ${message || ''}` }
                ],
                context: {
                    pageUri: 'https://ecmdigital.pl/kontakt',
                    pageName: 'Kontakt'
                }
            };

            const hsRes = await fetch(hsUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(hsPayload)
            });

            if (hsRes.ok) {
                console.log('✅ Lead successfully submitted to HubSpot Forms API');
            } else {
                const rawError = await hsRes.text();
                console.error('❌ HubSpot Forms API submission failed:', hsRes.status, rawError);
            }
        } catch (hsError) {
            console.error('❌ HubSpot Forms API integration exception:', hsError);
        }

        // --- SMS API Notification ---
        if (SMSAPI_TOKEN && NOTIFY_PHONE) {
            try {
                const smsMessage = `Nowy Lead: ${name} (${email}). Usługa: ${service || 'Brak'}. Firma: ${company || 'Brak'}. Wiadomość: ${message?.substring(0, 100)}...`;
                const smsApiUrl = `https://api.smsapi.pl/sms.do?to=${NOTIFY_PHONE}&message=${encodeURIComponent(smsMessage)}&format=json&access_token=${SMSAPI_TOKEN}`;

                const smsRes = await fetch(smsApiUrl, { method: 'POST' });
                const result = await smsRes.json();

                if (result.error) {
                    console.error('SMSAPI error:', result.error);
                } else {
                    console.log('✅ SMS notification sent successfully:', result.list?.[0]?.id);
                }
            } catch (smsError) {
                console.error('❌ SMS notification exception:', smsError);
            }
        } else {
            console.warn('SMS notification skipped: Missing SMSAPI_TOKEN or NOTIFY_PHONE');
        }

    } catch (err) {
        console.error("onLeadCreate trigger failed:", err);
    }
});

