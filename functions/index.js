const { onRequest } = require("firebase-functions/v2/https");
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
        await fetch(`${TELEGRAM_API}${token}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: chatId.toString(),
                text: text,
                parse_mode: "Markdown"
            })
        });
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
