import type { Metadata } from "next"
import "./globals.css"
import GoogleAnalytics from "./GoogleAnalytics"
import AIChatbot from "@/components/AIChatbot"
import Providers from "@/components/Providers"

const BASE_URL = "https://www.ecm-digital.com";

export const metadata: Metadata = {
  title: "ECM Digital – Agencja Cyfrowa | AI, Strony WWW, Aplikacje, Automatyzacja",
  description: "ECM Digital – profesjonalna agencja cyfrowa. Agenci AI, strony WWW, sklepy Shopify & Wix, aplikacje mobilne, automatyzacj N8N i prototypy MVP.",
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
    },
  },
  openGraph: {
    type: "website",
    url: BASE_URL,
    title: "ECM Digital – Agencja Cyfrowa | AI, Strony WWW, Aplikacje",
    description: "Profesjonalna agencja cyfrowa. Agenci AI, strony WWW, sklepy, aplikacje i automatyzacja.",
    images: ["/assets/images/ecm-digital-og.svg"],
    locale: "pl_PL",
    alternateLocale: ["en_US", "de_DE", "szl_PL", "es_ES", "ar_SA"],
  },
  twitter: {
    card: "summary_large_image",
    title: "ECM Digital – Agencja Cyfrowa",
    description: "Profesjonalna agencja cyfrowa. Agenci AI, strony WWW, sklepy, aplikacje i automatyzacja.",
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ECM Digital",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness"],
  "name": "ECM Digital",
  "url": BASE_URL,
  "logo": `${BASE_URL}/assets/images/ecm-digital-og.svg`,
  "image": `${BASE_URL}/assets/images/ecm-digital-og.svg`,
  "description": "Profesjonalna agencja cyfrowa. Agenci AI, strony WWW, sklepy, aplikacje mobilne i automatyzacja.",
  "foundingDate": "2024",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "PL",
    "addressLocality": "Warszawa",
    "addressRegion": "mazowieckie"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 52.2297,
    "longitude": 21.0122
  },
  "hasMap": "https://maps.app.goo.gl/3moUHXGw4GhmFsJD9",
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "kontakt@ecm-digital.com",
    "telephone": "+48535330323",
    "contactType": "customer service",
    "availableLanguage": ["Polish", "English", "German", "Silesian", "Spanish", "Arabic"]
  },
  "sameAs": [],
  "knowsLanguage": ["pl", "en", "de", "szl", "es", "ar"],
  "areaServed": ["PL", "DE", "EU"],
  "priceRange": "$$",
  "serviceType": [
    "Web Development",
    "AI Agent Development",
    "Mobile App Development",
    "E-commerce (Shopify/Wix)",
    "Business Process Automation (N8N)",
    "MVP Prototyping"
  ]
};

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
        <script
          dangerouslySetInnerHTML={{
            __html: `window.NEXT_PUBLIC_GEMINI_API_KEY = "${process.env.NEXT_PUBLIC_GEMINI_API_KEY || ''}";`
          }}
        />
      </head>
      <body className="font-system">
        <GoogleAnalytics GA_MEASUREMENT_ID="G-LC6Q3MQNDL" />
        <Providers>
          {children}
          <AIChatbot />
        </Providers>
        <script src="/js/gemini-client.js?v=2" defer />
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