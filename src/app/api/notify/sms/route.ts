import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, company, service, message } = body;

        // Configuration from environment variables
        const SMSAPI_TOKEN = process.env.SMSAPI_TOKEN;
        const NOTIFY_PHONE = process.env.NOTIFY_PHONE || process.env.NEXT_PUBLIC_CONTACT_PHONE;

        if (!SMSAPI_TOKEN || !NOTIFY_PHONE) {
            console.warn('SMS notification skipped: Missing SMSAPI_TOKEN or NOTIFY_PHONE');
            return NextResponse.json({ success: false, error: 'Missing configuration' }, { status: 500 });
        }

        // Prepare SMS message
        const smsMessage = `Nowy Lead: ${name} (${email}). Usługa: ${service || 'Brak'}. Firma: ${company || 'Brak'}. Wiadomość: ${message?.substring(0, 100)}...`;

        // SMSAPI.pl REST API call
        const smsApiUrl = `https://api.smsapi.pl/sms.do?to=${NOTIFY_PHONE}&message=${encodeURIComponent(smsMessage)}&format=json&access_token=${SMSAPI_TOKEN}`;

        const res = await fetch(smsApiUrl, { method: 'POST' });
        const result = await res.json();

        if (result.error) {
            console.error('SMSAPI error:', result.error);
            return NextResponse.json({ success: false, error: result.error }, { status: 400 });
        }

        return NextResponse.json({ success: true, messageId: result.list?.[0]?.id });
    } catch (error) {
        console.error('SMS Notification error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
