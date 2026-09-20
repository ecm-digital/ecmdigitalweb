import ServiceLandingTemplate from '@/components/ServiceLandingTemplate';

export const metadata = {
  title: '14-Day AI Agent Sprint | ECM Digital',
  description: 'Go live with a fully functional, CRM-integrated AI Agent and KPI Dashboard in just 2 weeks. Fast, measurable, and zero technical debt.',
};

export default function AIAgentSprintLanding() {
  return (
    <ServiceLandingTemplate
      serviceKey="ai-agent-sprint"
      title="14-Day AI Agent Sprint"
      subtitle="Deploy a production-grade AI Agent integrated with your CRM and custom KPI reporting in just 14 days. Sprints that deliver instant operational ROI."
      heroIcon="⏱️"
      featuresTitle="Most commonly deployed processes"
      features={[
        {
          icon: '🎯',
          title: 'Sales Lead Qualification',
          desc: 'Automated chat with incoming form inquiries, intent & profile scoring, and direct routing of qualified leads into CRM.',
        },
        {
          icon: '💬',
          title: '24/7 Customer Support Agent',
          desc: 'Instant answers to FAQs, multilingual ticket management, and automated escalation of complex cases to humans.',
        },
        {
          icon: '📄',
          title: 'Credit Agent & Document Analysis',
          desc: 'Scanning applications, validating financial or ID document data accuracy, and generating preliminary credit decisions.',
        },
        {
          icon: '📈',
          title: 'CRM & Reporting Automation',
          desc: 'Automatic call note creation, appending firmographic data in CRM, and generating automated conversion dashboards.',
        },
        {
          icon: '💻',
          title: 'AI for Product Teams & Software Houses',
          desc: 'Assistants facilitating technical documentation lookup, auto-generating release notes, and streamlining developer onboarding.',
        },
        {
          icon: '💼',
          title: 'Back-Office Agent (Invoices, Docs, Admin)',
          desc: 'Automated OCR data extraction from expense invoices, smart document categorization, and distribution to accounting systems.',
        },
      ]}
      benefits={[
        'Full production deployment in 14 days, skipping long development cycles',
        'Direct bidirectional sync with HubSpot, Pipedrive, Salesforce, and more',
        'Interactive KPI dashboard for transparent, real-time value measurement',
        'Zero vendor lock-in—you fully own the visual workflows and the data',
        'Low-code workflow design makes future adjustments fast and simple',
        'Cut manual lead qualification and operations handling costs by up to 70%',
        'Includes custom bazy wiedzy (knowledge base) and team handover training',
        'Clear, fixed-price package pricing with no unexpected hidden costs',
      ]}
      methodology={[
        { title: 'AI Readiness Audit', desc: 'Analysis of infrastructure, corporate data, and organizational readiness for AI deployment.' },
        { title: 'Business Process Mapping', desc: 'Detailed flow-charting of target workflows, operations, and handoffs.' },
        { title: 'Agent & Integration Design', desc: 'Outlining agent persona, prompt logic, vector knowledge base context, and CRM mappings.' },
        { title: 'Implementation & Testing', desc: 'Building workflows in n8n/Make, LLM prompt engineering, and functional dry-runs.' },
        { title: 'KPI Measurement & Optimization', desc: 'Launching custom visual dashboards and calibrating prompts based on live client interactions.' },
        { title: 'Development under AI Growth Partner', desc: 'Long-term support, model updates, security maintenance, and rolling out new workflows.' }
      ]}
      whyUs="We focus strictly on speed-to-value and measurable results. Our 14-Day Sprint framework bypasses unnecessary meetings and long specifications. We build transparently, and we deliver your AI agent directly integrated with your everyday CRM system. You own the code, the hosting, and the workflows from day one."
      caseStudyHighlight={{
        title: 'Lead Handling & CRM Sync',
        result: '14-Day Delivery',
        image: '⏱️',
      }}
    />
  );
}
