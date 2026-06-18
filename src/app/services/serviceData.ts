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

export const serviceKeys = Object.keys(services);
