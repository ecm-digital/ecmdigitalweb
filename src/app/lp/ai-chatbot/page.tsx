import LandingPage from '../LandingPage';

const campaign = {
    slug: 'ai-chatbot',
    heroEmoji: '🤖',
    headline: 'Chatbot AI Dla Twojego Biznesu — Obsługa 24/7',
    subheadline: 'Zautomatyzuj obsługę klienta z inteligentnym chatbotem AI. Odpowiada na pytania, zbiera leady i rezerwuje wizyty — bez przerw.',
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #e94560 100%)',
    ctaText: 'Zamów Chatbota AI Dla Swojej Firmy',
    ctaSubtext: 'Bezpłatna konsultacja + demo chatbota w 48h.',
    trustBadges: ['🤖 Technologia Google Gemini', '⚡ Wdrożenie w 7 dni', '📈 ROI od 1. miesiąca'],
    stats: [
        { value: '80%', label: 'Mniej zapytań do obsługi' },
        { value: '24/7', label: 'Dostępność chatbota' },
        { value: '3 sek', label: 'Średni czas odpowiedzi' },
        { value: '7 dni', label: 'Czas wdrożenia' },
    ],
    benefits: [
        { icon: '💬', title: 'Obsługa 24/7', desc: 'Chatbot odpowiada natychmiast, nawet o 3 w nocy. Zero kolejek, zero czekania.' },
        { icon: '🧠', title: 'Sztuczna Inteligencja', desc: 'Oparty o Google Gemini — rozumie kontekst, uczy się i odpowiada naturalnie.' },
        { icon: '📋', title: 'Zbieranie Leadów', desc: 'Automatycznie zbiera dane kontaktowe i kwalifikuje potencjalnych klientów.' },
        { icon: '🌍', title: 'Wielojęzyczny', desc: 'Obsługuje po polsku, angielsku, niemiecku i w innych językach jednocześnie.' },
        { icon: '🔗', title: 'Integracje', desc: 'Łączy się z CRM, kalendarzem, e-mailem i systemami płatności.' },
        { icon: '📊', title: 'Analityka', desc: 'Dashboard z ropportami — poznasz najczęstsze pytania klientów i luki w ofercie.' },
    ],
    pricing: [
        {
            name: 'Starter',
            price: 'od 2 500 PLN',
            features: ['Chatbot na stronie WWW', 'Do 100 konwersacji/mies.', 'Baza wiedzy do 50 pytań', 'Zbieranie danych kontaktowych', 'Podstawowe raportowanie'],
        },
        {
            name: 'Business',
            price: 'od 5 000 PLN',
            highlighted: true,
            features: ['Chatbot + WhatsApp/Messenger', 'Do 500 konwersacji/mies.', 'Baza wiedzy bez limitu', 'Integracja z CRM', 'AI uczący się z rozmów', 'Analityka zaawansowana'],
        },
        {
            name: 'Enterprise',
            price: 'Indywidualnie',
            features: ['Bez limitu konwersacji', 'Dedykowany model AI', 'Multi-platform', 'API integracje', 'Priorytetowe wsparcie', 'SLA gwarantowane'],
        },
    ],
    faq: [
        { q: 'Czy chatbot będzie brzmiał naturalnie?', a: 'Tak — używamy technologii Google Gemini, która generuje naturalne odpowiedzi, dostosowane do tonu Twojej marki.' },
        { q: 'Ile trwa wdrożenie chatbota?', a: 'Podstawowy chatbot jest gotowy w 7 dni. Wersja z integracjami CRM i własnymi bazami wiedzy — 14-21 dni.' },
        { q: 'Czy chatbot zastąpi moich pracowników?', a: 'Nie zastępuje — odciąża. Chatbot obsługuje 80% powtarzalnych pytań, a pracownicy mogą skupić się na złożonych sprawach.' },
        { q: 'A co jeśli chatbot nie zna odpowiedzi?', a: 'Przekazuje rozmowę do człowieka z pełnym kontekstem konwersacji. Zero utraty informacji.' },
        { q: 'Jakie są koszty miesięczne?', a: 'Koszty zależą od pakietu i liczby konwersacji. Pakiet Starter kosztuje od 500 PLN/mies. za hosting i utrzymanie AI.' },
    ],
};

export default function Page() {
    return <LandingPage campaign={campaign} />;
}
