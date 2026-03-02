import ServiceLandingTemplate from '@/components/ServiceLandingTemplate';

export const metadata = {
  title: 'Business Automation with N8N | ECM Digital',
  description: 'Automate workflows, integrate tools, and eliminate manual work. Save 20+ hours per week with N8N automation.',
};

export default function AutomationLanding() {
  return (
    <ServiceLandingTemplate
      serviceKey="automation"
      title="Automate Your Workflows with N8N"
      subtitle="Connect your business tools and eliminate manual work. Automate workflows between your CRM, email, spreadsheets, payments, and 1000+ other apps."
      heroIcon="⚡"
      features={[
        {
          icon: '🔗',
          title: 'Tool Integration',
          desc: 'Connect 1000+ apps: CRM, email, Slack, Google Sheets, Zapier, Stripe, and more.',
        },
        {
          icon: '📋',
          title: 'Workflow Automation',
          desc: 'Create complex workflows without coding. If-then logic, triggers, and conditional actions.',
        },
        {
          icon: '📊',
          title: 'Data Sync',
          desc: 'Keep data synchronized across all your tools automatically. No more copy-paste.',
        },
        {
          icon: '🎯',
          title: 'Lead Management',
          desc: 'Automatically route leads, send follow-up emails, and update your CRM.',
        },
        {
          icon: '💰',
          title: 'Payment Processing',
          desc: 'Automate invoicing, payment tracking, and financial reporting.',
        },
        {
          icon: '📧',
          title: 'Email & Notifications',
          desc: 'Send personalized emails, Slack messages, and SMS based on triggers.',
        },
      ]}
      benefits={[
        'Save 20-40 hours per week on manual tasks',
        'Reduce human errors in data entry and processing',
        'Instant notifications when important events occur',
        'Automatically generate reports and analytics',
        'Scale operations without hiring more staff',
        'Improve customer response time from days to minutes',
        'Centralized control of all business workflows',
        'Track automation performance and ROI',
      ]}
      whyUs="We're N8N experts with deep experience in complex automation. We don't just create simple workflows—we build intelligent automation systems that handle edge cases, scale with your business, and integrate seamlessly with your existing infrastructure. Our automations are maintainable, documented, and easy to update."
      caseStudyHighlight={{
        title: 'Sales Workflow Automation',
        result: '35 Hours/Week Saved',
        image: '⏱️',
      }}
    />
  );
}
