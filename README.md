# 🚀 ECM Digital Website (2026)

Oficjalny serwis internetowy agencji **ECM Digital** — nowoczesnej agencji **AI & Digital Systems**, specjalizującej się w zwinnych wdrożeniach Agentów AI, automatyzacji procesów biznesowych (n8n), aplikacjach Next.js i stałym partnerstwie technologicznym.

🌐 **Produkcja:** [https://www.ecm-digital.com](https://www.ecm-digital.com)  
🔥 **Firebase Hosting:** [https://ecmdigital-28074.web.app](https://ecmdigital-28074.web.app)  
📘 **Kanoniczna Oferta & Cennik:** [`dokumentacja-ecm/KANONICZNA-OFERTA-I-CENNIK-2026.md`](dokumentacja-ecm/KANONICZNA-OFERTA-I-CENNIK-2026.md)

---

## 🪜 Drabina Wartości ECM Digital (4 Filary Oferty 2026)

Oferta agencji opiera się na 4-etapowej drabinie wartości (Value Ladder):

1. **Audyt Gotowości AI & Procesów** *(od 3 900 PLN)*  
   Diagnoza infrastruktury i wytypowanie 3–5 Quick-Wins. **100% kwoty audytu jest odliczane** przy wdrożeniu kolejnego etapu.
2. **AI Agent Sprint — 14 Dni ⭐ [BESTSELLER]** *(od 9 900 PLN Fixed-Price)*  
   Szybkie, mierzalne wdrożenie autonomicznego agenta AI zintegrowanego z CRM (HubSpot, Pipedrive, Salesforce) i dedykowanym dashboardem KPI.
3. **Dedykowane Systemy & Automatyzacje** *(od 3 500 – 12 000+ PLN)*  
   Workflowy n8n, platformy headless e-commerce (Shopify / Baselinker), serwisy Next.js oraz prototypy MVP aplikacji webowych.
4. **AI Growth Partner (Abonament / Retainer)** *(od 2 500 PLN / msc)*  
   Stałe utrzymanie, monitoring stabilności, prompt tuning pod nowe modele LLM, aktualizacje bazy RAG i dedykowane wsparcie SLA.

---

## 🛠️ Stack Technologiczny

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router, Static Site Generation SSG, Route Handlers)
- **Język:** TypeScript 5.x
- **Styling:** Tailwind CSS, Lucide React, Glassmorphism 2.0 UI
- **Sztuczna Inteligencja:** Google Gemini API (`@google/generative-ai`), LangChain, Pinecone, Langfuse
- **Backend & Baza:** Firebase Hosting, Cloud Firestore, Firebase Admin SDK
- **Analityka & Eventy:** PostHog, Google Analytics
- **Internacjonalizacja (i18n):** Wielojęzyczność (PL, EN, DE, ES, SZL, AR)

---

## 📁 Struktura Projektu

```
.
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── admin/                # Panel zarządzania agencją (CRM, lead scoring, oferty)
│   │   ├── api/                  # Route Handlers (Gemini, audyt, webhooki)
│   │   ├── blog/                 # Blog technologiczny i artykuły SEO
│   │   ├── cases/                # Dynamiczne i statyczne case studies
│   │   ├── lp/                   # Dedykowane strony lądowania (Google Ads / kampanie)
│   │   ├── services/             # Podstrony 8 specjalizacji ofertowych
│   │   ├── wycena/               # Interaktywny Kalkulator Wyceny
│   │   ├── layout.tsx            # Główny layout aplikacji
│   │   └── page.tsx              # Strona główna z sekcją 4 Filarów Usług
│   ├── components/               # Komponenty UI, sekcje homepage, kalkulator
│   ├── context/                  # Konteksty React (język, notyfikacje)
│   └── translations/             # Słowniki tłumaczeń (PL, EN, DE, ES, SZL, AR)
├── dokumentacja-ecm/             # Oficjalna dokumentacja agencji i cenniki
│   ├── KANONICZNA-OFERTA-I-CENNIK-2026.md # Główny dokument referencyjny
│   ├── cennik/                   # Karty cennikowe poszczególnych usług
│   └── oferta-uslug/             # Szczegółowe opisy wdrożeń i procesów
├── public/                       # Statyczne zasoby, ikony, kb-ecm.json
├── .github/workflows/deploy.yml  # Automatyczny deploy GitHub Actions na Firebase
└── deploy.sh                     # Skrypt do lokalnego deploymentu na produkcję
```

---

## 🚀 Uruchomienie i Development

### Wymagania wstępne:
- Node.js w wersji **20.x**
- npm 10+

### Instalacja zależności:
```bash
npm install
```

### Uruchomienie serwera deweloperskiego:
```bash
npm run dev
```
Aplikacja uruchamia się lokalnie pod adresem: [http://localhost:3001](http://localhost:3001).

### Zmienne środowiskowe (`.env.local`):
Wymagane zmienne konfiguracyjne:
```env
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ecmdigital-28074
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
```

---

## 📦 Budowanie i Wdrożenie Produkcyjne

### 1. Kompilacja projektu:
```bash
npm run build
```
Next.js kompiluje aplikację i generuje zoptymalizowane pliki produkcyjne w katalogu `out/`.

### 2. Publikacja na Firebase Hosting:
Zautomatyzowany skrypt przygotowuje zasoby i publikuje projekt na żywo:
```bash
./deploy.sh
```
Lub bezpośrednio za pomocą Firebase CLI:
```bash
firebase deploy --only hosting
```

---

© 2026 ECM Digital. Wszelkie prawa zastrzeżone.