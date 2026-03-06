import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

interface AnalysisResult {
  scores: {
    seo: number;
    ux: number;
    performance: number;
    mobile: number;
    conversions: number;
    overall: number;
  };
  findings: Array<{
    category: string;
    severity: 'high' | 'medium' | 'low';
    message: string;
  }>;
  recommendations: Array<{
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    effortDays: number;
    priceMin: number;
    priceMax: number;
  }>;
  suggestedServices: Array<{
    name: string;
    emoji: string;
    reason: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  summary: string;
  estimatedBudget: {
    min: number;
    max: number;
  };
}

async function extractWebsiteData(url: string) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const html = await response.text();

    // Extract data using regex and basic parsing
    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
    const metaDescMatch = html.match(/<meta[^>]*name=['"]description['"][^>]*content=['"]([^'"]*)['"]/i);
    const metaKeywordsMatch = html.match(/<meta[^>]*name=['"]keywords['"][^>]*content=['"]([^'"]*)['"]/i);
    const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
    const h2Matches = html.match(/<h2[^>]*>(.*?)<\/h2>/gi);
    const imgMatches = html.match(/<img[^>]*>/gi);
    const linksMatch = html.match(/<a[^>]*href=['"]([^'"]*)['"]/gi);
    const viewportMatch = html.match(/<meta[^>]*name=['"]viewport['"][^>]*>/i);
    const schemaMatch = html.match(/<script[^>]*type=['"]application\/ld\+json['"]>(.*?)<\/script>/is);

    const imageCount = imgMatches?.length || 0;
    const imagesWithoutAlt = (imgMatches || []).filter(img => !img.match(/alt=/i)).length;
    const externalLinks = (linksMatch || []).filter(link => link.includes('http')).length;
    const hasMobileViewport = !!viewportMatch;
    const hasSchema = !!schemaMatch;

    return {
      title: titleMatch?.[1]?.replace(/<[^>]*>/g, '').trim() || 'N/A',
      description: metaDescMatch?.[1] || 'No meta description',
      keywords: metaKeywordsMatch?.[1] || '',
      h1: h1Match?.[1]?.replace(/<[^>]*>/g, '').trim() || 'None found',
      h2Count: h2Matches?.length || 0,
      imageCount,
      imagesWithoutAlt,
      totalLinks: linksMatch?.length || 0,
      externalLinks,
      hasMobileViewport,
      hasSchema,
      pageSize: html.length,
      hasSSL: url.startsWith('https'),
    };
  } catch (error) {
    throw new Error(`Failed to extract website data: ${error}`);
  }
}

async function analyzeWithGemini(url: string, data: any): Promise<AnalysisResult> {
  const prompt = `Analyze this website data and provide a comprehensive SEO, UX, Performance, Mobile, and Conversion analysis.

Website: ${url}
Title: ${data.title}
Meta Description: ${data.description}
H1: ${data.h1}
H2 Count: ${data.h2Count}
Images: ${data.imageCount} (${data.imagesWithoutAlt} missing alt text)
Links: ${data.totalLinks} (${data.externalLinks} external)
Mobile Viewport: ${data.hasMobileViewport ? 'Yes' : 'No'}
Schema Markup: ${data.hasSchema ? 'Yes' : 'No'}
SSL: ${data.hasSSL ? 'Yes' : 'No'}
Page Size: ${(data.pageSize / 1024).toFixed(2)}KB

Also suggest which services from ECM Digital would help:
- AI Agents (customer service automation, lead qualification)
- Websites (web design, performance optimization, UX improvement)
- E-commerce (online store setup, conversion optimization)
- Automation (business process automation, n8n workflows)
- MVP (startup development, product launch)
- AI Audit (comprehensive business AI strategy)

Return a JSON object with:
{
  "scores": {
    "seo": <0-100>,
    "ux": <0-100>,
    "performance": <0-100>,
    "mobile": <0-100>,
    "conversions": <0-100>,
    "overall": <0-100>
  },
  "findings": [{"category": "string", "severity": "high|medium|low", "message": "string"}],
  "recommendations": [{"title": "string", "description": "string", "impact": "high|medium|low", "effortDays": <number>, "priceMin": <number in PLN>, "priceMax": <number in PLN>}],
  "suggestedServices": [{"name": "Service Name", "emoji": "emoji", "reason": "Why this service helps", "priority": "high|medium|low"}],
  "summary": "string",
  "estimatedBudget": {"min": <number>, "max": <number>}
}

Return ONLY the JSON object, no additional text.`;

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  // Extract JSON from response
  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Invalid response format from Gemini');
  }

  return JSON.parse(jsonMatch[0]) as AnalysisResult;
}

export async function POST(req: Request) {
  try {
    const { url, email, name } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Normalize URL
    const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;

    // Extract website data
    const websiteData = await extractWebsiteData(normalizedUrl);

    // Analyze with Gemini
    const analysis = await analyzeWithGemini(normalizedUrl, websiteData);

    // Save to Firestore
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    await addDoc(collection(db, 'website_analyses'), {
      url: normalizedUrl,
      email,
      name,
      ...analysis,
      createdAt: Timestamp.now(),
    });

    // Send SMS notification if email provided
    if (email) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/notify/sms`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            message: `Nowa analiza strony: ${normalizedUrl} (score: ${analysis.scores.overall}/100)`,
          }),
        });
      } catch (smsError) {
        console.error('SMS notification failed:', smsError);
      }
    }

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Website analysis error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
