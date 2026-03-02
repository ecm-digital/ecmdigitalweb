import { getFirestore } from '@/lib/firebaseAdmin';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const db = getFirestore();

    const strategy = {
      title: "AI Audit + AI Agents GTM Strategy Q1-Q3 2025",
      type: "go-to-market",
      description: "Primary go-to-market strategy focusing on AI Audit as entry point with AI Agents implementation as upsell. Target: SMEs (10-50 osób) worried about AI but knowing they must adopt it.",
      targetMarket: "SME 10-50 osób, Tech & Services sector, Risk-averse but innovation-focused",
      differentiators: "- Kompleksowy audit (nie tylko konsultacja)\n- Konkretny ROI estimate dla każdego procesu\n- Łatwy onboarding (3K entry point)\n- Polish-first positioning\n- Proven case studies",
      timeline: "Q1 2025: Setup + Sales (1-2/month) | Q2 2025: Scale (3-4/month) | Q3 2025: Premium tier launch",
      status: "planning",
      priority: "high",
      content: `# AI Audit + AI Agents GTM Strategy

## Executive Summary
Wyjście na rynek z bundle: **AI Audit (3K one-time) → AI Agent Implementation (5-10K)**

Target market: SMEs (10-50 osób) które wiedzą że muszą AI ale boją się ryzyka.

## Why This Strategy Works

### Market Fit
- ✅ 2025: AI adoption u SME jest HOT topic
- ✅ Competition: Bardzo mało agencji robi audit profesjonalnie
- ✅ Pain point: Każdy biznes pyta "Czy my też potrzebujemy AI?"
- ✅ Budget: 3-10K jest affordable dla SME

### Revenue Model
- Audit: **3 000 PLN** (2 tygodnie, ~60% marża)
- Implementation: **5-10 000 PLN** (4-6 tygodni, ~50% marża)
- Support: **500-1000 PLN/mies** (recurring)

### Proof Points
- ✅ Case study: chatbot-ai-ecommerce (AI Agents working)
- ✅ Case study: automatyzacja-n8n (complementary service)
- ✅ Tech stack: Gemini + LangChain + Firebase (proven)

## Go-To-Market Plan

### Phase 1: Setup & Validation (Weeks 1-4)
1. Create audit template (Process mining checklist)
2. Write 3 case study deep-dives
3. Build landing page: "Is Your SME Ready for AI?"
4. Create pitch deck (10 slides max)

### Phase 2: Launch (Weeks 5-8)
1. Cold outreach: 50 SMEs per week (LinkedIn + email)
2. Pitch: "Free 30-min AI readiness consultation"
3. Convert to paid audit: Target 20% conversion
4. Expected: 1-2 audits/week

### Phase 3: Upsell (During Audit)
1. Deep-dive workshops (2 days on-site)
2. Identify top 5 AI use cases
3. ROI modeling per use case
4. In report: Recommend Agent implementation for #1-2 use cases
5. Expected: 50% audit → agent conversion

### Phase 4: Scale (Months 3+)
1. Systemize audit process (SOP)
2. Train team on delivery
3. Monthly: 3-4 audits → 1-2 agent projects
4. Monthly revenue: ~25K (audits) + 5-10K (agents) + recurring

## Positioning

### Not:
- "We do AI consulting" (too generic)
- "ChatGPT integration" (commodity)
- "Full AI transformation" (too risky for SME)

### YES:
**"AI Strategy Partner for SMEs"**

Tagline: "Discover exactly where AI makes you money. No hype. No guessing."

Value prop:
- Audit identifies concrete use cases (not vague "AI transformation")
- ROI modeling removes risk (SMEs see exact payback)
- Phased implementation (start small, scale fast)

## Sales Messaging

### Pitch:
"Your competition is already looking at AI. We help SMEs figure out WHERE it actually saves money — before you waste 100K on the wrong project.

3000 PLN gets you:
- Analysis of your top 5 business processes
- AI opportunity assessment
- Concrete ROI estimates
- 12-month implementation roadmap
- No obligation to implement"

## Competitive Advantage

1. **Audit-first approach**: Most agencies try to sell you solutions. We diagnose first.
2. **Sane pricing**: 3K to get started (competitors charge 5-10K for basic consulting)
3. **Implementation ready**: We don't just advise, we build (Agent implementation included)
4. **Polish market knowledge**: We understand SME constraints, budgets, risk tolerance

## Success Metrics (KPIs)

### Month 1-2 (Validation)
- Target: 4-6 audits (1-2/week)
- Success rate: Convert 50%+ to agent projects
- NPS: >8/10

### Month 3+ (Scale)
- Target: 3-4 audits/week → 1-2 agent projects/week
- Monthly revenue: 25-50K
- Repeat/referral rate: >30%

## Risk Mitigation

1. **Audit not converting to agent**: De-risk with success-based pricing (audit fee credits toward implementation)
2. **Implementation complexity**: Use N8N for simple cases, custom dev for complex
3. **Competitor undercutting**: Lock in with 12-month support contract

## Next Actions

1. ☐ Create audit template (Week 1)
2. ☐ Write case study deep-dives (Week 1-2)
3. ☐ Build GTM landing page (Week 2)
4. ☐ Create pitch deck (Week 2)
5. ☐ Start cold outreach (Week 3)
6. ☐ Book first audits (Week 4+)

## Resources Needed

- Time: 2-3 days/week for first 2 months (you + 1 dev)
- Tools: Figma for landing page, LinkedIn Sales Navigator
- Budget: $500-1000 (ads, tools)

Expected ROI: First agent project pays back all setup costs 5x over.`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await db.collection('strategies').add(strategy);

    return NextResponse.json({
      success: true,
      message: 'Strategy added successfully',
      id: docRef.id,
    });
  } catch (error) {
    console.error('Error adding strategy:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
