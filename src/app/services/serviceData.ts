export interface ServiceData {
    slug: string;
    icon: string;
    gradient: string;
    features: string[];
    techs: string[];
    price: string;
}

export const services: Record<string, ServiceData> = {
    'ai-audit': {
        slug: 'ai-audit',
        icon: '🔎',
        gradient: 'linear-gradient(135deg, #06b6d4, #22d3ee)',
        features: ['features.1', 'features.2', 'features.3', 'features.4', 'features.5', 'features.6'],
        techs: ['Process Mining', 'AI Assessment', 'ROI Analysis', 'Roadmap', 'KPI', 'Benchmarking'],
        price: 'price',
    },
    'automation': {
        slug: 'automation',
        icon: '⚡',
        gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
        features: ['features.1', 'features.2', 'features.3', 'features.4', 'features.5', 'features.6'],
        techs: ['N8N', 'Zapier', 'Make', 'REST API', 'Webhooks', 'Cron'],
        price: 'price',
    },
    'ai-agents': {
        slug: 'ai-agents',
        icon: '🤖',
        gradient: 'linear-gradient(135deg, #e94560, #ff6b81)',
        features: ['features.1', 'features.2', 'features.3', 'features.4', 'features.5', 'features.6'],
        techs: ['Google Gemini', 'OpenAI', 'LangChain', 'N8N', 'Firebase', 'REST API'],
        price: 'price',
    },
    'ai-agent-sprint': {
        slug: 'ai-agent-sprint',
        icon: '⏱️',
        gradient: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
        features: ['features.1', 'features.2', 'features.3', 'features.4', 'features.5', 'features.6'],
        techs: ['n8n / Make', 'Google Gemini', 'HubSpot / Pipedrive', 'KPI Dashboard', 'Process Audit', 'Next Steps Guide'],
        price: 'price',
    },
    'ai-growth-partner': {
        slug: 'ai-growth-partner',
        icon: '📈',
        gradient: 'linear-gradient(135deg, #10b981, #059669)',
        features: ['features.1', 'features.2', 'features.3', 'features.4', 'features.5', 'features.6'],
        techs: ['AI Tuning', 'Workflow Optimization', 'RAG Maintenance', 'Analytics', 'Monthly Sprints', 'Priority Support'],
        price: 'price',
    },
    'ai-governance-agentops': {
        slug: 'ai-governance-agentops',
        icon: '🛡️',
        gradient: 'linear-gradient(135deg, #8b5cf6, #c084fc)',
        features: ['features.1', 'features.2', 'features.3', 'features.4', 'features.5', 'features.6'],
        techs: ['LLM Observability', 'AI Gateway', 'IAM', 'Langfuse', 'OpenTelemetry', 'n8n'],
        price: 'price',
    },
    'websites': {
        slug: 'websites',
        icon: '🌐',
        gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
        features: ['features.1', 'features.2', 'features.3', 'features.4', 'features.5', 'features.6'],
        techs: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'GA4', 'Tag Manager', 'CRM'],
        price: 'price',
    },
    'ecommerce': {
        slug: 'ecommerce',
        icon: '🛒',
        gradient: 'linear-gradient(135deg, #10b981, #34d399)',
        features: ['features.1', 'features.2', 'features.3', 'features.4', 'features.5', 'features.6'],
        techs: ['Shopify', 'WooCommerce', 'Stripe', 'Baselinker', 'N8N', 'GA4', 'Meta Pixel'],
        price: 'price',
    },
    'mvp': {
        slug: 'mvp',
        icon: '🚀',
        gradient: 'linear-gradient(135deg, #ec4899, #f472b6)',
        features: ['features.1', 'features.2', 'features.3', 'features.4', 'features.5', 'features.6'],
        techs: ['Next.js', 'React', 'Firebase', 'Supabase', 'Stripe', 'OpenAI', 'Gemini'],
        price: 'price',
    },
};

export const CORE_SERVICE_KEYS = [
    'ai-audit',
    'ai-agent-sprint',
    'automation',
    'websites',
    'ecommerce',
    'mvp',
    'ai-agents',
    'ai-growth-partner'
];

export const ADDON_SERVICE_KEYS = [
    'ai-governance-agentops'
];

export const serviceKeys = Object.keys(services);
