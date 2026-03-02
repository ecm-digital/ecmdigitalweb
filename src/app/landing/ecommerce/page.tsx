import ServiceLandingTemplate from '@/components/ServiceLandingTemplate';

export const metadata = {
  title: 'E-commerce Solutions | ECM Digital',
  description: 'Build or migrate your online store. Shopify, custom platforms, integrations, and conversion optimization.',
};

export default function EcommerceLanding() {
  return (
    <ServiceLandingTemplate
      serviceKey="ecommerce"
      title="Build Your Online Store That Sells"
      subtitle="Complete e-commerce solutions from setup to scale. Custom stores, integrations with your supplier, and conversion optimization."
      heroIcon="🛍️"
      features={[
        {
          icon: '🛒',
          title: 'Store Setup',
          desc: 'Professional e-commerce store setup on Shopify, custom platforms, or your choice.',
        },
        {
          icon: '💳',
          title: 'Payment Integration',
          desc: 'Accept all payment methods: cards, PayPal, Apple Pay, Google Pay, bank transfers.',
        },
        {
          icon: '📦',
          title: 'Inventory Management',
          desc: 'Real-time inventory tracking, automated stock updates, and supplier integration.',
        },
        {
          icon: '📊',
          title: 'Sales Analytics',
          desc: 'Deep insights into customer behavior, product performance, and revenue trends.',
        },
        {
          icon: '🚚',
          title: 'Shipping Integration',
          desc: 'Automated shipping, tracking, and integrations with major carriers.',
        },
        {
          icon: '🎯',
          title: 'Conversion Optimization',
          desc: 'Increase average order value, reduce cart abandonment, and improve customer retention.',
        },
      ]}
      benefits={[
        'Professional storefront that builds customer trust',
        'Mobile-optimized checkout for higher conversion rates',
        'Automated email sequences for abandoned carts and follow-ups',
        'SEO-optimized product pages to attract organic traffic',
        'Multiple sales channels: web, marketplace, social',
        'Customer dashboard and order history',
        'Flexible discounts, coupons, and promotional campaigns',
        'Detailed customer data for targeted marketing',
      ]}
      whyUs="We've launched 50+ successful e-commerce stores. We understand the entire customer journey—from discovery to delivery. We optimize every step for conversions while ensuring scalable operations. Whether you're starting from scratch or migrating existing stores, we handle everything."
      caseStudyHighlight={{
        title: 'E-commerce Store Migration',
        result: '2.8x Revenue Growth',
        image: '💹',
      }}
    />
  );
}
