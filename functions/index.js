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

        // --- HubSpot CRM Integration ---
        if (HUBSPOT_ACCESS_TOKEN) {
            try {
                // Split name
                const nameParts = name.trim().split(/\s+/);
                const firstname = nameParts[0] || '';
                const lastname = nameParts.slice(1).join(' ') || '';

                const combinedMessage = `Selected Service: ${service || 'None'}\nMessage: ${message || ''}`;

                const contactData = {
                    properties: {
                        email: email,
                        firstname: firstname,
                        lastname: lastname,
                        company: company || '',
                        message: combinedMessage
                    }
                };

                const hubspotUrl = 'https://api.hubapi.com/crm/v3/objects/contacts';

                // Attempt to create contact
                const createRes = await fetch(hubspotUrl, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(contactData)
                });

                if (createRes.status === 201 || createRes.status === 200) {
                    const data = await createRes.json();
                    console.log('✅ Contact created successfully in HubSpot:', data.id);
                } else if (createRes.status === 409) {
                    const errorData = await createRes.json();
                    const match = (errorData.message || '').match(/Existing ID:\s*(\d+)/i);
                    const contactId = match ? match[1] : null;

                    if (contactId) {
                        console.log(`ℹ️ Contact already exists with ID ${contactId}. Updating contact...`);
                        
                        const updateData = {
                            properties: {
                                firstname: firstname,
                                lastname: lastname,
                                company: company || '',
                                message: combinedMessage
                            }
                        };

                        const updateRes = await fetch(`${hubspotUrl}/${contactId}`, {
                            method: 'PATCH',
                            headers: {
                                'Authorization': `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(updateData)
                        });

                        if (updateRes.ok) {
                            console.log('✅ Contact updated successfully in HubSpot:', contactId);
                        } else {
                            const updateError = await updateRes.text();
                            console.error('❌ HubSpot contact update failed:', updateError);
                        }
                    }
                } else {
                    const rawError = await createRes.text();
                    console.error('❌ HubSpot contact creation failed:', rawError);
                }
            } catch (hsError) {
                console.error('❌ HubSpot integration exception:', hsError);
            }
        } else {
            console.warn('HubSpot integration skipped: Missing access token');
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

