/**
 * Firebase & Analytics Configuration
 * Comprehensive tracking for ECM Digital website using Firebase SDK
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBXWWeTo7kzedHynbVHrpR_7cUWHljqRZo",
    authDomain: "ecmdigital-28074.firebaseapp.com",
    projectId: "ecmdigital-28074",
    storageBucket: "ecmdigital-28074.firebasestorage.app",
    messagingSenderId: "780205830091",
    appId: "1:780205830091:web:067fd063adace1ea55d04e",
    measurementId: "G-LC6Q3MQNDL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Use the Measurement ID from Firebase config
const GA_MEASUREMENT_ID = firebaseConfig.measurementId;

// Initialize dataLayer
window.dataLayer = window.dataLayer || [];
function gtag() {
    dataLayer.push(arguments);
}
// Make gtag global
window.gtag = gtag;

// Configure GA4 with enhanced measurement
gtag('js', new Date());
gtag('config', GA_MEASUREMENT_ID, {
    // Enhanced measurement
    enhanced_measurement: true,

    // Page view settings
    send_page_view: true,
    page_title: document.title,
    page_location: window.location.href,

    // Privacy settings
    anonymize_ip: true,
    allow_google_signals: true,
    allow_ad_personalization_signals: false,

    // Custom dimensions
    custom_map: {
        'custom_parameter_1': 'user_type',
        'custom_parameter_2': 'page_category',
        'custom_parameter_3': 'content_type',
        'custom_parameter_4': 'language'
    },

    // Debug mode (disable in production)
    debug_mode: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
});

// Track page view on load
function trackPageView() {
    const path = window.location.pathname + window.location.search;
    gtag('config', GA_MEASUREMENT_ID, {
        page_path: path,
        page_title: document.title,
        page_location: window.location.href
    });
}

// Track custom events
window.trackEvent = function (eventName, eventParams = {}) {
    gtag('event', eventName, {
        ...eventParams,
        event_category: eventParams.category || 'general',
        event_label: eventParams.label || '',
        value: eventParams.value || 0
    });
};

// Track form submissions
function trackFormSubmission(formId, formName) {
    trackEvent('form_submit', {
        category: 'engagement',
        label: formName || formId,
        form_id: formId,
        form_name: formName
    });
}

// Track button clicks
function trackButtonClick(buttonText, buttonLocation) {
    trackEvent('button_click', {
        category: 'engagement',
        label: buttonText,
        button_location: buttonLocation,
        button_text: buttonText
    });
}

// Track CTA clicks
function trackCTAClick(ctaText, ctaLocation) {
    trackEvent('cta_click', {
        category: 'conversion',
        label: ctaText,
        cta_location: ctaLocation,
        cta_text: ctaText
    });
}

// Track file downloads
function trackFileDownload(fileName, fileExtension) {
    trackEvent('file_download', {
        category: 'engagement',
        label: fileName,
        file_name: fileName,
        file_extension: fileExtension
    });
}

// Track outbound links
function trackOutboundLink(url, linkText) {
    trackEvent('outbound_click', {
        category: 'engagement',
        label: linkText || url,
        outbound_url: url,
        link_text: linkText
    });
}

// Track scroll depth
let scrollDepthTracked = {
    25: false,
    50: false,
    75: false,
    90: false
};

function trackScrollDepth() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.round((scrollTop / docHeight) * 100);

    Object.keys(scrollDepthTracked).forEach(depth => {
        if (scrollPercent >= parseInt(depth) && !scrollDepthTracked[depth]) {
            scrollDepthTracked[depth] = true;
            trackEvent('scroll', {
                category: 'engagement',
                label: `${depth}%`,
                scroll_depth: parseInt(depth)
            });
        }
    });
}

// Track time on page
let timeOnPageStart = Date.now();
let timeOnPageTracked = false;

function trackTimeOnPage() {
    if (timeOnPageTracked) return;

    const timeSpent = Math.round((Date.now() - timeOnPageStart) / 1000);

    // Track at 30 seconds
    if (timeSpent >= 30 && !timeOnPageTracked) {
        trackEvent('time_on_page', {
            category: 'engagement',
            label: '30s',
            time_spent: 30
        });
    }

    // Track at 60 seconds
    if (timeSpent >= 60) {
        trackEvent('time_on_page', {
            category: 'engagement',
            label: '60s',
            time_spent: 60
        });
        timeOnPageTracked = true;
    }
}

// Track chatbot interactions
window.trackChatbotEvent = function (action, message = '') {
    trackEvent('chatbot_interaction', {
        category: 'engagement',
        label: action,
        chatbot_action: action,
        chatbot_message: message
    });
};

// Track service interest
window.trackServiceInterest = function (serviceName, serviceCategory) {
    trackEvent('service_interest', {
        category: 'conversion',
        label: serviceName,
        service_name: serviceName,
        service_category: serviceCategory
    });
};

// Track contact form conversion
window.trackContactConversion = function (formType = 'contact') {
    trackEvent('contact_conversion', {
        category: 'conversion',
        label: formType,
        form_type: formType,
        conversion_value: 1
    });
};

// Track language change
window.trackLanguageChange = function (newLanguage) {
    trackEvent('language_change', {
        category: 'engagement',
        label: newLanguage,
        language: newLanguage
    });
};

// Track search (if implemented)
window.trackSearch = function (searchTerm, resultsCount = 0) {
    trackEvent('search', {
        category: 'engagement',
        label: searchTerm,
        search_term: searchTerm,
        results_count: resultsCount
    });
};

// Track video engagement (if videos are present)
window.trackVideoPlay = function (videoTitle) {
    trackEvent('video_play', {
        category: 'engagement',
        label: videoTitle,
        video_title: videoTitle
    });
};

// Error tracking
window.addEventListener('error', function (event) {
    trackEvent('javascript_error', {
        category: 'error',
        label: event.message,
        error_message: event.message,
        error_filename: event.filename,
        error_line: event.lineno,
        error_column: event.colno
    });
});

// Track unhandled promise rejections
window.addEventListener('unhandledrejection', function (event) {
    trackEvent('unhandled_promise_rejection', {
        category: 'error',
        label: event.reason?.toString() || 'Unknown error',
        error_reason: event.reason?.toString() || 'Unknown error'
    });
});

// Setup event listeners
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupListeners);
} else {
    setupListeners();
}

function setupListeners() {
    // Track initial page view
    trackPageView();

    // Track form submissions
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function (e) {
            const formId = form.id || 'unknown';
            const formName = form.getAttribute('name') || formId;
            trackFormSubmission(formId, formName);
        });
    });

    // Track CTA button clicks
    const ctaButtons = document.querySelectorAll('.btn-cta, a[href="#contact"], button[data-cta]');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            const buttonText = button.textContent.trim() || button.getAttribute('data-i18n') || 'CTA';
            const buttonLocation = button.closest('section')?.id || 'unknown';
            trackCTAClick(buttonText, buttonLocation);
        });
    });

    // Track service card clicks
    const serviceCards = document.querySelectorAll('[data-service], .service-card');
    serviceCards.forEach(card => {
        card.addEventListener('click', function (e) {
            const serviceName = card.getAttribute('data-service') ||
                card.querySelector('h3, h4, h5')?.textContent?.trim() ||
                'Unknown Service';
            const serviceCategory = card.closest('section')?.id || 'services';
            trackServiceInterest(serviceName, serviceCategory);
        });
    });

    // Track file downloads
    const downloadLinks = document.querySelectorAll('a[download], a[href$=".pdf"], a[href$=".doc"], a[href$=".docx"], a[href$=".zip"]');
    downloadLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = link.getAttribute('href') || '';
            const fileName = href.split('/').pop() || 'unknown';
            const fileExtension = fileName.split('.').pop() || '';
            trackFileDownload(fileName, fileExtension);
        });
    });

    // Track outbound links
    const outboundLinks = document.querySelectorAll('a[href^="http"]:not([href*="' + window.location.hostname + '"])');
    outboundLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const url = link.getAttribute('href');
            const linkText = link.textContent.trim() || url;
            trackOutboundLink(url, linkText);
        });
    });

    // Track scroll depth
    let scrollTimeout;
    window.addEventListener('scroll', function () {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(trackScrollDepth, 100);
    });

    // Track time on page
    setInterval(trackTimeOnPage, 1000);

    // Track language changes (if i18n is used)
    if (window.changeLanguage) {
        const originalChangeLanguage = window.changeLanguage;
        window.changeLanguage = function (lang) {
            trackLanguageChange(lang);
            return originalChangeLanguage(lang);
        };
    }
}

// Track page visibility changes
document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
        // Page is hidden - user switched tabs
        trackEvent('page_hidden', {
            category: 'engagement',
            label: 'tab_switch'
        });
    } else {
        // Page is visible again
        trackEvent('page_visible', {
            category: 'engagement',
            label: 'tab_return'
        });
    }
});

// Expose tracking functions globally
window.analytics = {
    trackEvent: trackEvent,
    trackFormSubmission: trackFormSubmission,
    trackButtonClick: trackButtonClick,
    trackCTAClick: trackCTAClick,
    trackFileDownload: trackFileDownload,
    trackOutboundLink: trackOutboundLink,
    trackChatbotEvent: window.trackChatbotEvent,
    trackServiceInterest: window.trackServiceInterest,
    trackContactConversion: window.trackContactConversion,
    trackLanguageChange: window.trackLanguageChange,
    trackSearch: window.trackSearch,
    trackVideoPlay: window.trackVideoPlay
};

console.log('[Analytics] Firebase initialized & GA4 enhanced tracking active (' + GA_MEASUREMENT_ID + ')');
