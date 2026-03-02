import ServiceLandingTemplate from '@/components/ServiceLandingTemplate';

export const metadata = {
  title: 'AI Agents for Business | ECM Digital',
  description: 'Automate your business with custom AI agents. Reduce costs by 70%, improve efficiency, and scale operations.',
};

export default function AIAgentsLanding() {
  return (
    <ServiceLandingTemplate
      serviceKey="ai-agents"
      title="Automate Your Business with AI Agents"
      subtitle="Deploy intelligent agents that work 24/7 to handle customer inquiries, data processing, lead qualification, and more. Reduce costs by up to 70% and improve efficiency."
      heroIcon="🤖"
      features={[
        {
          icon: '💬',
          title: 'Customer Service Agents',
          desc: 'Handle customer inquiries 24/7, resolve common issues, and escalate complex problems to humans.',
        },
        {
          icon: '📊',
          title: 'Data Processing',
          desc: 'Automatically process, validate, and organize data from various sources in real-time.',
        },
        {
          icon: '🎯',
          title: 'Lead Qualification',
          desc: 'Automatically qualify leads, ask discovery questions, and score by conversion likelihood.',
        },
        {
          icon: '⚡',
          title: 'Task Automation',
          desc: 'Execute repetitive tasks automatically: scheduling, emails, file management, and more.',
        },
        {
          icon: '🔗',
          title: 'API Integration',
          desc: 'Connect to your existing tools: CRM, email, databases, payment systems, and APIs.',
        },
        {
          icon: '🧠',
          title: 'Custom Logic',
          desc: 'Build agents tailored to your specific business workflows and requirements.',
        },
      ]}
      benefits={[
        '24/7 automated customer support without hiring additional staff',
        'Process thousands of inquiries simultaneously with consistent quality',
        'Reduce response time from hours to seconds',
        'Improve customer satisfaction with instant replies',
        'Save 20-40 hours per week on manual tasks',
        'Scale operations without proportional cost increases',
        'Detailed analytics on agent performance and customer interactions',
        'Easy integration with your existing business tools',
      ]}
      whyUs="We specialize in building production-grade AI agents that actually work. Our agents are trained on your specific use cases, integrated with your existing systems, and continuously improved based on real-world performance. With 100+ successful deployments, we know how to avoid the pitfalls and deliver results quickly."
      caseStudyHighlight={{
        title: 'E-commerce Customer Support',
        result: '85% Automation Rate',
        image: '📦',
      }}
    />
  );
}
