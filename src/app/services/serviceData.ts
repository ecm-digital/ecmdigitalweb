export interface ServiceData {
    slug: string;
    icon: string;
    gradient: string;
    features: string[];
    techs: string[];
    price: string;
}

export const services: Record<string, ServiceData> = {
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
        techs: ['Next.js', 'Shopify', 'React', 'TypeScript', 'Tailwind CSS', 'Wix & Stripe', 'Vercel'],
        price: 'price',
    },
    'ecommerce': {
        slug: 'ecommerce',
        icon: '🛒',
        gradient: 'linear-gradient(135deg, #10b981, #34d399)',
        features: ['features.1', 'features.2', 'features.3', 'features.4', 'features.5', 'features.6'],
        techs: ['Shopify', 'Wix', 'WooCommerce', 'Stripe', 'Google Analytics', 'Meta Pixel'],
        price: 'price',
    },
    'mobile-apps': {
        slug: 'mobile-apps',
        icon: '📱',
        gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
        features: ['features.1', 'features.2', 'features.3', 'features.4', 'features.5', 'features.6'],
        techs: ['React Native', 'Swift', 'Kotlin', 'Firebase', 'App Store', 'Google Play'],
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
    'ai-executive': {
        slug: 'ai-executive',
        icon: '💼',
        gradient: 'linear-gradient(135deg, #FF2D55, #ff5e7e)',
        features: ['features.1', 'features.2', 'features.3', 'features.4', 'features.5', 'features.6'],
        techs: ['Private LLM', 'LangChain', 'Custom RAG', 'Ollama', 'Security', 'ERP Integration'],
        price: 'price',
    },
    'edu': {
        slug: 'edu',
        icon: '🎓',
        gradient: 'linear-gradient(135deg, #30D158, #59df7a)',
        features: ['features.1', 'features.2', 'features.3', 'features.4', 'features.5', 'features.6'],
        techs: ['ChatGPT', 'Claude', 'Midjourney', 'Zapier', 'Canva AI', 'Prompt Engineering'],
        price: 'price',
    },
    'mvp': {
        slug: 'mvp',
        icon: '🚀',
        gradient: 'linear-gradient(135deg, #ec4899, #f472b6)',
        features: ['features.1', 'features.2', 'features.3', 'features.4', 'features.5', 'features.6'],
        techs: ['React Native', 'Next.js', 'Swift & Kotlin', 'Firebase', 'Stripe', 'App Store & Google Play'],
        price: 'price',
    },
    'ai-audit': {
        slug: 'ai-audit',
        icon: '📊',
        gradient: 'linear-gradient(135deg, #06b6d4, #22d3ee)',
        features: ['features.1', 'features.2', 'features.3', 'features.4', 'features.5', 'features.6'],
        techs: ['Process Mining', 'AI Assessment', 'ROI Analysis', 'Roadmap', 'KPI', 'Benchmarking'],
        price: 'price',
    },
    'social-media': {
        slug: 'social-media',
        icon: '📣',
        gradient: 'linear-gradient(135deg, #8b5cf6, #c084fc)',
        features: ['features.1', 'features.2', 'features.3', 'features.4', 'features.5', 'features.6'],
        techs: ['Meta Business', 'Google Ads', 'TikTok Ads', 'AI Analytics', 'Canva', 'Buffer'],
        price: 'price',
    },
};

export const serviceKeys = Object.keys(services);
