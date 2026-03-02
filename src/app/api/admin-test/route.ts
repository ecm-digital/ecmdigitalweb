import { getFirestore } from '@/lib/firebaseAdmin';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Example API route using Firebase Admin SDK
 * DELETE this file in production - it's just for testing
 */
export async function GET(request: NextRequest) {
  try {
    const db = getFirestore();

    // Example: Get services from Firestore
    const servicesSnapshot = await db.collection('services').limit(5).get();

    const services = servicesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({
      success: true,
      message: 'Firebase Admin SDK is working!',
      servicesCount: services.length,
      samples: services,
    });
  } catch (error) {
    console.error('Firebase Admin error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
