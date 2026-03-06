import type { Metadata } from "next"
import "./globals.css"
import "./nextgen2026.css"
import "../mobile-ux.css"
import GoogleAnalytics from "./GoogleAnalytics"
import AIChatbot from "@/components/AIChatbot"
import Providers from "@/components/Providers"
import DynamicSEO from "@/components/DynamicSEO"
import { PostHogProvider } from "@/components/PostHogProvider"
import CookieBanner from "@/components/CookieBanner"
import Hotjar from "@/components/Hotjar"
import Script from "next/script"

const BASE_URL = "https://www.ecm-digital.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "ECM Digital – Agencja Cyfrowa | AI, Strony WWW, Aplikacje, Automatyzacja",
  description: "ECM Digital – profesjonalna agencja cyfrowa. Agenci AI, strony WWW, sklepy Shopify & Wix, aplikacje mobilne, automatyzacja N8N i prototypy MVP.",
  keywords: "agencja cyfrowa, AI, sztuczna inteligencja, strony WWW, sklepy internetowe, aplikacje mobilne, automatyzacja, MVP",
  authors: [{ name: "ECM Digital" }],
  alternates: {
    canonical: `${BASE_URL}/`,
    languages: {
      'pl': `${BASE_URL}/?lang=pl`,
      'en': `${BASE_URL}/?lang=en`,
      'de': `${BASE_URL}/?lang=de`,
      'szl': `${BASE_URL}/?lang=szl`,
      'es': `${BASE_URL}/?lang=es`,
      'ar': `${BASE_URL}/?lang=ar`,
      'x-default': `${BASE_URL}/`,
    } as any,
  },
  openGraph: {
    type: "website",
    url: BASE_URL,
    title: "ECM Digital – Agencja Cyfrowa | AI, Strony WWW, Aplikacje",
    description: "Profesjonalna agencja cyfrowa. Agenci AI, strony WWW, sklepy, aplikacje i automatyzacja.",
    images: ["/assets/images/ecm-og-premium.png"],
    locale: "pl_PL",
    alternateLocale: ["en_US", "de_DE", "szl_PL", "es_ES", "ar_SA"],
  },
  twitter: {
    card: "summary_large_image",
    title: "ECM Digital – Agencja Cyfrowa",
    description: "Profesjonalna agencja cyfrowa. Agenci AI, strony WWW, sklepy, aplikacje i automatyzacja.",
    images: ["/assets/images/ecm-og-premium.png"],
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ECM Digital",
  },
}

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness", "ProfessionalService"],
    "name": "ECM Digital",
    "alternateName": ["ECM Digital - Agencja AI Warszawa", "AI Agency Warsaw"],
    "url": BASE_URL,
    "logo": `${BASE_URL}/assets/images/ecm-og-premium.png`,
    "image": `${BASE_URL}/assets/images/ecm-og-premium.png`,
    "description": "Profesjonalna agencja cyfrowa specjalizująca się w AI Agents. Agenci AI, strony WWW, sklepy, aplikacje mobilne i automatyzacja dla firm w Warszawie i Polsce.",
    "foundingDate": "2024",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "PL",
      "addressLocality": "Warszawa",
      "addressRegion": "mazowieckie",
      "streetAddress": "Warszawa"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 52.2297,
      "longitude": 21.0122
    },
    "hasMap": "https://maps.app.goo.gl/QNFQFWqBxsWEkNETA",
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "email": "kontakt@ecm-digital.com",
        "telephone": "+48535330323",
        "contactType": "customer service",
        "availableLanguage": ["Polish", "English", "German", "Silesian", "Spanish", "Arabic"]
      },
      {
        "@type": "ContactPoint",
        "contactType": "Sales",
        "email": "kontakt@ecm-digital.com",
        "telephone": "+48535330323"
      }
    ],
    "sameAs": [
      "https://www.linkedin.com/company/ecm-digital/",
      "https://www.facebook.com/ecmdigital"
    ],
    "knowsLanguage": ["pl", "en", "de", "szl", "es", "ar"],
    "areaServed": [
      {
        "@type": "City",
        "name": "Warszawa",
        "addressCountry": "PL"
      },
      {
        "@type": "Country",
        "name": "Poland"
      },
      {
        "@type": "Country",
        "name": "Germany"
      },
      "EU"
    ],
    "priceRange": "$$",
    "serviceType": [
      "AI Agent Development",
      "AI Audit",
      "Web Development",
      "E-commerce (Shopify/Wix)",
      "Mobile App Development",
      "Business Process Automation",
      "MVP Prototyping"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "AI & Digital Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "name": "AI Agents",
          "description": "Custom AI agents for business automation",
          "priceCurrency": "PLN",
          "price": "5000-50000"
        },
        {
          "@type": "Offer",
          "name": "AI Audit",
          "description": "Professional AI readiness assessment",
          "priceCurrency": "PLN",
          "price": "3000"
        },
        {
          "@type": "Offer",
          "name": "Web Development",
          "description": "Custom websites and web applications",
          "priceCurrency": "PLN",
          "price": "3000-25000"
        }
      ]
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": BASE_URL,
    "name": "ECM Digital",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${BASE_URL}/?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "ECM Digital",
        "item": BASE_URL
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Services",
        "item": `${BASE_URL}/services`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "AI Agents",
        "item": `${BASE_URL}/services/ai-agents`
      }
    ]
  }
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pl">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <meta name="theme-color" content="#050505" />
        <meta name="mobile-web-app-capable" content="yes" />
        {/* Performance: Preconnect to critical third-party origins */}
        <link rel="preconnect" href="https://firestore.googleapis.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://static.hotjar.com" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="alternate" hrefLang="pl" href={`${BASE_URL}/?lang=pl`} />
        <link rel="alternate" hrefLang="en" href={`${BASE_URL}/?lang=en`} />
        <link rel="alternate" hrefLang="de" href={`${BASE_URL}/?lang=de`} />
        <link rel="alternate" hrefLang="szl" href={`${BASE_URL}/?lang=szl`} />
        <link rel="alternate" hrefLang="es" href={`${BASE_URL}/?lang=es`} />
        <link rel="alternate" hrefLang="ar" href={`${BASE_URL}/?lang=ar`} />
        <link rel="alternate" hrefLang="x-default" href={`${BASE_URL}/`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-system">
        <GoogleAnalytics GA_MEASUREMENT_ID="G-LC6Q3MQNDL" />
        <Hotjar />
        <PostHogProvider>
          <Providers>
            <DynamicSEO />
            {children}
            <AIChatbot />
            <CookieBanner />
          </Providers>
        </PostHogProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(reg) { console.log('SW registered:', reg.scope); })
                    .catch(function(err) { console.log('SW registration failed:', err); });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}