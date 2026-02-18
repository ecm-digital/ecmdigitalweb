import LandingPage from '../LandingPage';

const campaign = {
    slug: 'strony-www',
    heroEmoji: '🌐',
    headline: 'Profesjonalna Strona Internetowa w 14 Dni',
    subheadline: 'Nowoczesne, szybkie i responsywne strony WWW, które konwertują odwiedzających w klientów. Bez ukrytych kosztów.',
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 40%, #3b82f6 100%)',
    ctaText: 'Zamów Darmową Wycenę Strony WWW',
    ctaSubtext: 'Odpowiadamy w ciągu 24h. Wycena i konsultacja gratis.',
    trustBadges: ['✅ 50+ zrealizowanych projektów', '⚡ Realizacja od 14 dni', '🏆 Gwarancja jakości'],
    stats: [
        { value: '50+', label: 'Zrealizowanych stron' },
        { value: '14 dni', label: 'Średni czas realizacji' },
        { value: '99%', label: 'Zadowolonych klientów' },
        { value: '24h', label: 'Czas odpowiedzi' },
    ],
    benefits: [
        { icon: '⚡', title: 'Szybkość', desc: 'Strony ładują się w mniej niż 2 sekundy dzięki najnowszym technologiom.' },
        { icon: '📱', title: 'Responsywność', desc: 'Idealne wyświetlanie na każdym urządzeniu — od telefonu po monitor 4K.' },
        { icon: '🔍', title: 'SEO Ready', desc: 'Zoptymalizowane pod Google — meta tagi, structured data, sitemap.' },
        { icon: '🎨', title: 'Unikalny Design', desc: 'Indywidualny projekt dopasowany do Twojej marki. Bez szablonów.' },
        { icon: '🔒', title: 'SSL i Bezpieczeństwo', desc: 'Certyfikat SSL, ochrona DDOS i regularne aktualizacje.' },
        { icon: '📊', title: 'Analytics', desc: 'Google Analytics 4 + raporty konwersji w cenie każdego projektu.' },
    ],
    pricing: [
        {
            name: 'Wizytówka',
            price: 'od 2 000 PLN',
            features: ['Do 5 podstron', 'Design responsywny', 'Formularz kontaktowy', 'Certyfikat SSL', 'Hosting na 12 miesięcy'],
        },
        {
            name: 'Firmowa',
            price: 'od 5 000 PLN',
            highlighted: true,
            features: ['Do 15 podstron', 'CMS do edycji treści', 'Blog firmowy', 'SEO optymalizacja', 'Google Analytics', 'Wsparcie 3 miesiące'],
        },
        {
            name: 'E-commerce',
            price: 'od 8 000 PLN',
            features: ['Sklep internetowy', 'Panel administracyjny', 'Płatności online', 'Integracja z kurierami', 'Marketing automation', 'Wsparcie 6 miesięcy'],
        },
    ],
    faq: [
        { q: 'Jak długo trwa realizacja strony?', a: 'Strona wizytówka to 7-14 dni, strona firmowa 14-30 dni, sklep e-commerce 30-60 dni. Czas zależy od złożoności projektu.' },
        { q: 'Czy mogę samodzielnie edytować treści?', a: 'Tak! Instalujemy intuicyjny panel CMS, dzięki któremu możesz edytować texty, zdjęcia i dodawać nowe podstrony bez programisty.' },
        { q: 'Co obejmuje cena?', a: 'Cena obejmuje projekt graficzny, kodowanie, wdrożenie, SSL, hosting na 12 miesięcy oraz szkolenie z obsługi strony.' },
        { q: 'Czy pomagacie z pozycjonowaniem (SEO)?', a: 'Każda strona jest zoptymalizowana pod SEO bazowo. Oferujemy też miesięczne pakiety pozycjonowania od 1 500 PLN/mies.' },
        { q: 'Jakie technologie używacie?', a: 'Pracujemy z Next.js, React, TypeScript, i Firebase. Używamy najnowszych technologii, które zapewniają szybkość i bezpieczeństwo.' },
    ],
};

export default function Page() {
    return <LandingPage campaign={campaign} />;
}
