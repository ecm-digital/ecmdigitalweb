import ServiceLandingTemplate from '@/components/ServiceLandingTemplate';

export const metadata = {
  title: 'MVP Development for Startups | ECM Digital',
  description: 'Validate your startup idea with a minimum viable product. Fast, affordable, and production-ready.',
};

export default function MVPLanding() {
  return (
    <ServiceLandingTemplate
      serviceKey="mvp"
      title="Launch Your Startup Idea Fast"
      subtitle="Build and launch your MVP in weeks, not months. Validate your idea, get user feedback, and raise funding with a production-ready product."
      heroIcon="🚀"
      features={[
        {
          icon: '⚡',
          title: 'Fast Development',
          desc: 'Launch in 4-8 weeks. We focus on core features that users care about.',
        },
        {
          icon: '💰',
          title: 'Cost Effective',
          desc: 'Save 40-60% compared to large agencies. No unnecessary features.',
        },
        {
          icon: '🎯',
          title: 'Focused Features',
          desc: 'Build only what matters. Every feature is validated with your target users.',
        },
        {
          icon: '📈',
          title: 'Scalable Architecture',
          desc: 'Built to scale. As users grow, your MVP grows without technical debt.',
        },
        {
          icon: '👥',
          title: 'User Feedback',
          desc: 'We help you gather feedback and iterate. Product development is a process.',
        },
        {
          icon: '💼',
          title: 'Investor Ready',
          desc: 'Production-grade code, documented, and ready to show investors.',
        },
      ]}
      benefits={[
        'Launch your idea before competitors do',
        'Get real user feedback to validate your business model',
        'Reduce risk with data-driven decisions',
        'Attractive product for raising seed funding',
        'Flexible tech stack tailored to your needs',
        'Clear roadmap for future development',
        'Ongoing support and iteration',
        'Code ownership—your app, your data',
      ]}
      whyUs="We've helped 15+ startups launch their MVPs. We understand startup constraints—limited budget, tight timelines, uncertain requirements. We build smartly, focusing on what matters, and help you make data-driven decisions. Many of our MVP clients have gone on to raise funding and scale."
      caseStudyHighlight={{
        title: 'SaaS Startup MVP Launch',
        result: '500+ Users in 60 Days',
        image: '🚀',
      }}
    />
  );
}
