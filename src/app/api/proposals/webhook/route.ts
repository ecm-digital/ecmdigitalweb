import { NextRequest, NextResponse } from 'next/server';
import { addGensparkProposal, GensparkProposal } from '@/lib/firestoreService';
import { serverTimestamp } from 'firebase-admin/firestore';

const WEBHOOK_SECRET = process.env.GENSPARK_WEBHOOK_SECRET || 'default-secret';

interface WebhookPayload {
  token: string;
  client: string;
  email?: string;
  platform: 'email' | 'linkedin' | 'useme' | 'other';
  subject: string;
  body: string;
  value?: number;
  currency?: string;
  sentAt?: string;
}

export async function POST(req: NextRequest) {
  try {
    const payload: WebhookPayload = await req.json();

    // Verify webhook token
    if (payload.token !== WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate required fields
    if (!payload.client || !payload.subject || !payload.body || !payload.platform) {
      return NextResponse.json(
        { error: 'Missing required fields: client, subject, body, platform' },
        { status: 400 }
      );
    }

    // Create proposal document
    const proposalData: Omit<GensparkProposal, 'id' | 'updatedAt'> = {
      client: payload.client,
      email: payload.email,
      platform: payload.platform,
      subject: payload.subject,
      body: payload.body,
      value: payload.value,
      currency: payload.currency || 'PLN',
      status: 'Wysłana',
      sentAt: payload.sentAt ? new Date(payload.sentAt) : new Date(),
    };

    // Save to Firestore
    const docId = await addGensparkProposal(proposalData as any);

    return NextResponse.json(
      { success: true, id: docId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
