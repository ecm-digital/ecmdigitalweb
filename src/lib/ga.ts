'use client';

// Centralized Google Analytics 4 (GA4) Tracking Utility

export const GA_MEASUREMENT_ID = 'G-LC6Q3MQNDL';

/**
 * Log a custom event to GA4
 * @param action The name of the event
 * @param params Additional parameters for the event
 */
export const trackEvent = (action: string, params: Record<string, any> = {}) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', action, {
            ...params,
            send_to: GA_MEASUREMENT_ID,
        });

        // Debug log for development environment
        if (process.env.NODE_ENV === 'development') {
            console.log(`[GA Event]: ${action}`, params);
        }
    }
};

/**
 * Track Lead Generation
 * @param source Where the lead came from (e.g., 'ContactForm', 'Hero', 'LandingPage')
 * @param service The service the lead is interested in
 */
export const trackLead = (source: string, service?: string) => {
    trackEvent('generate_lead', {
        event_category: 'Conversion',
        event_label: source,
        service_type: service || 'not_specified',
    });
};

/**
 * Track Offer Interactions in Client Portal
 * @param offerId The unique ID of the offer
 * @param status 'Accepted' or 'Rejected'
 */
export const trackOfferAction = (offerId: string, status: 'Accepted' | 'Rejected') => {
    trackEvent('offer_interaction', {
        event_category: 'ClientPortal',
        event_label: status,
        offer_id: offerId,
        value: status === 'Accepted' ? 1 : 0,
    });
};

/**
 * Track CTA (Call to Action) Clicks
 * @param type 'WhatsApp', 'Email', 'Phone', 'Chatbot'
 * @param location Where the CTA was clicked (e.g., 'Navbar', 'Footer', 'FloatingBar')
 */
export const trackCTAClick = (type: string, location: string) => {
    trackEvent('cta_click', {
        event_category: 'Engagement',
        event_label: type,
        click_location: location,
    });
};

/**
 * Track AI Chatbot Interactions
 * @param action 'chat_start', 'message_sent', 'lead_captured'
 */
export const trackAIChat = (action: string) => {
    trackEvent('ai_chat_interaction', {
        event_category: 'AI_Chatbot',
        event_label: action,
    });
};
