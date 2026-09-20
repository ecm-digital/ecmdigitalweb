import LandingPage from '../LandingPage';

const campaign = {
    slug: 'automatyzacja',
    heroEmoji: '⚡',
    headline: 'Automatyzacja Procesów Biznesowych — Oszczędź 20h Tygodniowo',
    subheadline: 'Zautomatyzuj powtarzalne zadania z N8N, Zapier i AI. Fakturowanie, maile, raporty — wszystko działa samo.',
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #f59e0b 100%)',
    ctaText: 'Zamów Bezpłatny Audyt Procesów',
    ctaSubtext: 'Sprawdzimy, które procesy w Twojej firmie można zautomatyzować.',
    trustBadges: ['⚡ N8N & Zapier Certified', '🕐 Oszczędność 20h/tydzień', '💰 ROI w 3 miesiące'],
    stats: [
        { value: '20h', label: 'Oszczędności tygodniowo' },
        { value: '85%', label: 'Mniej błędów ludzkich' },
        { value: '3x', label: 'Szybsze procesy' },
        { value: '300%', label: 'Średni ROI w 6 mies.' },
    ],
    benefits: [
        { icon: '📧', title: 'Automatyzacja Maili', desc: 'Automatyczne odpowiedzi, follow-upy i newslettery — bez ręcznego wysyłania.' },
        { icon: '📄', title: 'Fakturowanie', desc: 'Automatyczne generowanie i wysyłka faktur po zakończeniu zlecenia.' },
        { icon: '📊', title: 'Raporty', desc: 'Codzienne/tygodniowe raporty KPI generowane i wysyłane automatycznie.' },
        { icon: '🔄', title: 'Synchronizacja Danych', desc: 'CRM, ERP, Excel, Google Sheets — wszystko zsynchronizowane w czasie rzeczywistym.' },
        { icon: '🎯', title: 'Lead Nurturing', desc: 'Automatyczne sekwencje marketingowe dopasowane do etapu lejka sprzedażowego.' },
        { icon: '🔔', title: 'Powiadomienia', desc: 'Slack, email, SMS — alerty o ważnych zdarzeniach w czasie rzeczywistym.' },
    ],
    pricing: [
        {
            name: 'Pojedynczy Workflow (Starter)',
            price: 'od 3 500 – 6 500 PLN',
            features: ['1-2 kluczowe procesy', 'Integracja 2-3 systemów (np. CRM + Formularz + Email)', 'N8N / webhook setup', 'Monitoring 1 miesiąc', 'Dokumentacja techniczna i instrukcja'],
        },
        {
            name: 'System Integracyjny (Growth)',
            price: 'od 8 000 – 14 000 PLN',
            highlighted: true,
            features: ['System 3-6 procesów biznesowych', 'Integracje CRM, ERP, Baselinker, fakturowanie', 'Automatyczne przetwarzanie dokumentów z AI (OCR/LLM)', 'Monitoring 3 miesiące', 'Szkolenie zespołu', 'Wsparcie priorytetowe'],
        },
        {
            name: 'Złożona Infrastruktura (Enterprise)',
            price: 'od 14 000 – 18 000+ PLN',
            features: ['Architektura enterprise n8n na własnym serwerze', 'Custom API integracje i dwukierunkowa synchronizacja', 'Zaawansowana obsługa błędów i kolejki zadań', 'Monitoring 12 miesięcy', 'Dedykowany opiekun techniczny', 'Gwarantowane SLA'],
        },
    ],
    faq: [
        { q: 'Jakie procesy można zautomatyzować?', a: 'Praktycznie wszystko co jest powtarzalne: maile, fakturowanie, raporty, synchronizacja danych, lead scoring, onboarding klientów, i wiele więcej.' },
        { q: 'Ile trwa wdrożenie automatyzacji?', a: 'Proste automatyzacje (np. auto-maile) to 3-5 dni. Złożone procesy z AI i wieloma integracjami to 2-6 tygodni.' },
        { q: 'Czy to bezpieczne?', a: 'Tak — używamy szyfrowanej komunikacji, tokenów API i ograniczonych uprawnień. Dane nie wychodzą poza Twoje systemy.' },
        { q: 'Jakie narzędzia używacie?', a: 'Głównie N8N (self-hosted dla pełnej kontroli), Zapier, Make i custom Python skrypty. Dobieramy narzędzie do potrzeb.' },
        { q: 'Co jeśli coś się zepsuje?', a: 'Każda automatyzacja ma monitoring i alerty. W razie awarii powiadamiam natychmiast i naprawiam w ramach SLA.' },
    ],
};

export default function Page() {
    return <LandingPage campaign={campaign} />;
}
