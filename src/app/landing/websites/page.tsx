import ServiceLandingTemplate from '@/components/ServiceLandingTemplate';

export const metadata = {
  title: 'Modern Websites & Web Apps | ECM Digital',
  description: 'Custom websites and web applications built with latest technologies. Fast, SEO-optimized, and designed for conversions.',
};

export default function WebsitesLanding() {
  return (
    <ServiceLandingTemplate
      serviceKey="websites"
      title="Build a Website That Converts"
      subtitle="Modern, fast, and beautiful websites designed to attract customers and generate leads. Built with latest technologies, fully responsive, and optimized for search engines."
      heroIcon="🌐"
      features={[
        {
          icon: '⚡',
          title: 'Lightning Fast Performance',
          desc: 'Pages load in under 2 seconds. Speed affects both user experience and SEO rankings.',
        },
        {
          icon: '🎨',
          title: 'Custom Design',
          desc: 'Unique designs tailored to your brand. Not templates, not WordPress themes—truly custom.',
        },
        {
          icon: '📱',
          title: 'Mobile First',
          desc: 'Perfect on phones, tablets, and desktops. 60% of visitors use mobile devices.',
        },
        {
          icon: '🔍',
          title: 'SEO Optimized',
          desc: 'Built-in SEO best practices. Rank higher on Google and attract organic traffic.',
        },
        {
          icon: '🛒',
          title: 'E-commerce Ready',
          desc: 'Integrate payments, inventory, and order management. Sell online with confidence.',
        },
        {
          icon: '📊',
          title: 'Analytics & Tracking',
          desc: 'Understand your visitors. Track conversions, user behavior, and ROI.',
        },
      ]}
      benefits={[
        'Custom domain with professional email addresses',
        'SSL certificate included (HTTPS security)',
        'Unlimited monthly visits—no bandwidth charges',
        'Blog integration for content marketing',
        'Contact forms with lead capture',
        'Social media integration',
        'Monthly analytics reports',
        'Fast, reliable hosting included',
        'Easy content updates (CMS)',
      ]}
      whyUs="We build websites that don't just look good—they generate results. Every site is optimized for conversions, built with clean code for performance, and designed to rank on Google. We use modern technologies (Next.js, React) that scale with your business."
      caseStudyHighlight={{
        title: 'Service Agency Website Redesign',
        result: '3.2x Lead Generation',
        image: '📈',
      }}
    />
  );
}
