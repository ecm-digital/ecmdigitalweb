import LandingPage from '../LandingPage';

const campaign = {
    slug: 'ai-agent-sprint',
    heroEmoji: '⏱️',
    headline: 'AI Agent Sprint — Wdrożenie Agenta AI w 14 Dni',
    subheadline: 'Zautomatyzuj obsługę leadów i procesy firmowe w zaledwie 2 tygodnie. Uwolnij do 20 godzin pracy tygodniowo w swoim zespole i skróć czas kwalifikacji leadów do 15 sekund dzięki Agentom AI zintegrowanym z CRM.',
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #311042 40%, #7c3aed 100%)',
    ctaText: 'Umów Bezpłatną Wycenę Sprintu AI',
    ctaSubtext: 'Bezpłatna konsultacja strategiczna + dobór quick-win w 48h.',
    trustBadges: ['⏱️ Wdrożenie w 14 dni', '🔌 Integracja z Twoim CRM', '📊 Panel KPI w zestawie'],
    stats: [
        { value: '14 dni', label: 'Czas realizacji' },
        { value: '100%', label: 'Integracja z CRM' },
        { value: 'od 9,9k', label: 'Przewidywalna cena' },
        { value: '24/7', label: 'Działanie AI' },
    ],
    benefitsTitle: 'Najczęściej wdrażane procesy',
    benefitsLabel: '● Procesy',
    benefits: [
        { icon: 'Target', title: 'Kwalifikacja leadów sprzedażowych', desc: 'Automatyczna rozmowa z zapytaniami z formularzy, ocena intencji i profilu klienta oraz przekazywanie gotowych leadów do CRM.' },
        { icon: 'MessageSquare', title: 'Agent obsługi klienta 24/7', desc: 'Natychmiastowe odpowiedzi na najczęstsze pytania, obsługa zgłoszeń w wielu językach i automatyczne eskalowanie trudnych spraw do zespołu.' },
        { icon: 'FileText', title: 'Agent kredytowy i analiza dokumentów', desc: 'Skanowanie wniosków, weryfikacja poprawności danych w dokumentach finansowych/tożsamości i wstępna decyzja kredytowa.' },
        { icon: 'TrendingUp', title: 'Automatyzacja CRM i raportowania', desc: 'Samoczynne tworzenie notatek z rozmów, uzupełnianie brakujących danych o firmach w CRM oraz generowanie raportów o konwersji.' },
        { icon: 'Cpu', title: 'AI dla zespołów produktowych i software house’ów', desc: 'Asystenci ułatwiający przeszukiwanie dokumentacji technicznej, automatyczne generowanie release notes oraz usprawnienie onboardingu deweloperów.' },
        { icon: 'Briefcase', title: 'Agent back-office (faktury, dokumenty, administracja)', desc: 'Automatyczne odczytywanie danych z faktur kosztowych, kategoryzacja dokumentów i ich dystrybucja do systemów księgowych.' },
    ],
    methodology: [
        { title: 'AI Readiness Audit', desc: 'Analizujemy infrastrukturę, dane i gotowość Twojej firmy do wdrożenia AI.' },
        { title: 'Mapowanie procesu biznesowego', desc: 'Precyzyjnie rozpisujemy wybrany przepływ operacyjny i punkty styku.' },
        { title: 'Projekt agenta i integracji', desc: 'Określamy personę agenta, strukturę bazy wiedzy oraz architekturę połączeń z CRM.' },
        { title: 'Wdrożenie oraz testy', desc: 'Budujemy stabilne workflow w n8n, promptujemy LLM i przeprowadzamy testy jakościowe.' },
        { title: 'Pomiar KPI i optymalizacja', desc: 'Uruchamiamy dedykowany dashboard KPI i kalibrujemy promptowanie na bazie rzeczywistych interakcji.' },
        { title: 'Rozwój w ramach AI Growth Partner', desc: 'Zapewniamy stałą opiekę po wdrożeniu, aktualizacje modeli oraz wdrażanie kolejnych automatyzacji.' }
    ],
    pricing: [
        {
            name: 'Pakiet Standard (14 Dni)',
            price: '9 900 PLN',
            subtext: 'Fixed price. Faktura VAT. Płatność: 50% zaliczki przed startem, 50% po odbiorze.',
            features: [
                'Zmapowanie i optymalizacja 1 procesu biznesowego',
                'Projekt persony, promptu i logiki Agenta AI',
                'Wdrożenie workflow produkcyjnego w n8n / chmurze',
                'Pełna integracja z CRM (HubSpot / Pipedrive / API)',
                'Dedykowany wizualny Dashboard KPI',
                '14 dni asysty hiper-care po uruchomieniu'
            ]
        },
        {
            name: 'Pakiet Sprint + Custom CRM',
            price: '12 500 – 15 000 PLN',
            highlighted: true,
            subtext: 'Faktura VAT. Stała cena uzgodniona przed startem.',
            features: [
                'Wszystko z pakietu Standard (14 Dni) +',
                'Zaawansowane bazy wiedzy RAG / pliki PDF i procedury',
                'Wielokanałowość: Formularz WWW + E-mail + CRM',
                'Dwukierunkowa zaawansowana synchronizacja danych',
                '2-godzinny warsztat wdrożeniowy dla zespołu',
                '30 dni bezpłatnego wsparcia po wdrożeniu'
            ],
        },
        {
            name: 'Pakiet Enterprise / Multi-Agent',
            price: 'Wycena indywidualna',
            subtext: 'Faktura VAT. Warunki rozliczenia dopasowane do projektu.',
            features: [
                'Systemy multi-agentowe i złożone procesy wieloetapowe',
                'Dedykowane instancje na prywatnym hostingu / VPC',
                'Zaawansowane bazy wektorowe i polityka AI Governance',
                'Integracja z systemami ERP i własnymi API',
                'Gwarantowane wsparcie SLA i priorytetowy kontakt',
                'Płynne przejście do AI Growth Partner (stała opieka)'
            ]
        }
    ],
    testimonials: [
        {
            quote: "14-dniowy sprint AI z ECM Digital całkowicie odmienił naszą obsługę leadów. Agent AI kwalifikuje zapytania i zapisuje je bezpośrednio w CRM, a my widzimy wszystkie wyniki na dashboardzie KPI.",
            author: "Tomasz Wiśniewski",
            role: "Właściciel, RentCar Premium",
            avatar: "T"
        },
        {
            quote: "Dzięki automatyzacji n8n i agentowi kredytowemu skanującemu dokumenty, czas weryfikacji wniosków spadł z 2 dni do 5 minut. Zwrot z inwestycji nastąpił już w pierwszym miesiącu.",
            author: "Andrzej Kowalski",
            role: "Dyrektor Operacyjny, FinTech Solution",
            avatar: "A"
        }
    ],
    bookingUrl: 'https://calendly.com/ecm-digital/konsultacja',
    faq: [
        { q: 'Co dokładnie otrzymuję w 14 dni?', a: 'W pełni działającego i przetestowanego produkcyjnie Agenta AI zintegrowanego z Twoim CRM (np. HubSpot, Pipedrive) oraz dashboard z metrykami KPI, a także kompletną dokumentację i szkolenie dla zespołu.' },
        { q: 'Dlaczego n8n lub Make?', a: 'Dzięki tym narzędziom low-code tworzymy procesy wizualnie. Nie generuje to długu technologicznego — Twój zespół może sam edytować prompty lub logikę w przyszłości bez programisty.' },
        { q: 'Z jakimi CRM integruje się agent?', a: 'Z dowolnym CRM posiadającym otwarte API. Standardowo integrujemy z HubSpot, Pipedrive, Salesforce, Zoho oraz Livespace.' },
        { q: 'Czy otrzymuję kod i przepływy na własność?', a: 'Tak, całe wdrożenie n8n, bazy wektorowe i konfiguracja stają się Twoją pełną własnością (brak opłat licencyjnych z naszej strony).' },
        { q: 'Jakie są koszty utrzymania po wdrożeniu?', a: 'Uruchomiony workflow n8n działa na Twoim hostingu (lub chmurze). Koszty modeli AI zależą od skali (dla małej skali to zwykle kilkadziesiąt PLN/mies.). Oferujemy też stały pakiet wsparcia abonamentowego AI Growth Partner.' }
    ],
};

export default function Page() {
    return <LandingPage campaign={campaign} />;
}
