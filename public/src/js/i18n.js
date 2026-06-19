// Multilingual system ECM Digital
class I18nManager {
    constructor() {
        this.currentLanguage = 'pl';
        this.translations = {};
        this.initialized = false;
    }

    // Inicjalizacja systemu
    async init() {
        try {
            console.log('🔄 Initializing I18n system...');
            
            // Try to load translations from files
            await this.loadTranslations();
            this.initialized = true;
            
            // Set default language
            this.setLanguage(this.getStoredLanguage() || 'pl');
            
            // Update page content after initialization
            this.updatePageContent();
            
            console.log('✅ I18n system initialized successfully');
            console.log('📊 Available translations:', Object.keys(this.translations));
        } catch (error) {
            console.error('❌ Failed to initialize I18n system:', error);
            // Fallback to embedded translations
            this.translations = {
                pl: this.getEmbeddedTranslations('pl'),
                en: this.getEmbeddedTranslations('en'),
                de: this.getEmbeddedTranslations('de')
            };
            this.setLanguage('pl');
            this.updatePageContent();
        }
    }

    // Ładowanie plików tłumaczeń
    async loadTranslations() {
        try {
            // Dynamicznie określ ścieżkę do plików tłumaczeń
            const basePath = this.getBasePath();
            console.log('🔍 Base path determined:', basePath);
            console.log('🔍 Current pathname:', window.location.pathname);
            console.log('🔍 Current hostname:', window.location.hostname);

            // Spróbuj najpierw załadować z plików - zawsze używaj ścieżki bezwzględnej
            const translationPaths = [
                '/locales/pl.json',
                '/locales/en.json',
                '/locales/de.json'
            ];

            console.log('📁 Attempting to load translations from:', translationPaths);
            
            const [plTranslations, enTranslations, deTranslations] = await Promise.all([
                fetch(translationPaths[0]).then(res => res.json()).catch(() => this.getEmbeddedTranslations('pl')),
                fetch(translationPaths[1]).then(res => res.json()).catch(() => this.getEmbeddedTranslations('en')),
                fetch(translationPaths[2]).then(res => res.json()).catch(() => this.getEmbeddedTranslations('de'))
            ]);

            this.translations = {
                pl: plTranslations,
                en: enTranslations,
                de: deTranslations
            };
            
            console.log('✅ Translations loaded successfully');
            console.log('🇵🇱 Polish keys:', Object.keys(plTranslations));
        } catch (error) {
            console.error('❌ Failed to load translations:', error);
            // Fallback do wbudowanych tłumaczeń
            this.translations = {
                pl: this.getEmbeddedTranslations('pl'),
                en: this.getEmbeddedTranslations('en'),
                de: this.getEmbeddedTranslations('de')
            };
        }
    }

    // Wbudowane tłumaczenia dla krytycznych sekcji (fallback gdy pliki nie są dostępne)
    getEmbeddedTranslations(lang) {
        const embeddedTranslations = {
            pl: {
                "sections.about.title": "O ECM Digital",
                "sections.about.subtitle": "Zespół ekspertów AI, którzy transformują biznes poprzez inteligentne rozwiązania",
                "sections.services.title": "Nasze Usługi",
                "sections.services.subtitle": "Kompleksowe rozwiązania AI i automatyzacji, które transformują Twój biznes i zwiększają efektywność",
                "sections.team.title": "Nasz Zespół",
                "sections.team.subtitle": "Poznaj ekspertów, którzy tworzą Twoje projekty",
                "hero.title": "Wdrażamy AI w Twojej Firmie",
                "hero.subtitle": "Transformujemy Twoją firmę dzięki sztucznej inteligencji. Od chatbotów po zaawansowane automatyzacje - AI, które naprawdę działa i generuje realne korzyści biznesowe.",
                "hero.stats.aiProjects": "50+",
                "hero.stats.aiProjectsLabel": "Projektów AI",
                "hero.stats.costReduction": "70%",
                "hero.stats.costReductionLabel": "Redukcja Kosztów",
                "hero.stats.support": "24/7",
                "hero.stats.supportLabel": "AI Wsparcie",
                "hero.stats.satisfaction": "95%",
                "hero.stats.satisfactionLabel": "Satysfakcja",
                "sections.team.members.tomasz.name": "Tomasz Gnat",
                "sections.team.members.tomasz.position": "Konsultant Discovery",
                "sections.team.members.tomasz.description": "Ekspert w odkrywaniu potrzeb biznesowych i strategii AI. Pomaga firmom identyfikować obszary do automatyzacji.",
                "sections.team.members.tomasz.skills.businessAnalysis": "Business Analysis",
                "sections.team.members.tomasz.skills.aiStrategy": "AI Strategy",
                "sections.team.members.karol.name": "Karol Czechowski",
                "sections.team.members.karol.position": "QA & AI Developer",
                "sections.team.members.karol.description": "Specjalista od zapewnienia jakości rozwiązań AI i automatycznego testowania. Gwarantuje niezawodność systemów.",
                "sections.team.members.karol.skills.aiTesting": "Testowanie AI",
                "sections.team.members.karol.skills.qualityAssurance": "Zapewnienie Jakości",
                "sections.team.members.marta.name": "Marta Górska",
                "sections.team.members.marta.position": "Projektant UX/UI",
                "sections.team.members.marta.description": "Projektantka skupiająca się na potrzebach użytkowników w erze AI. Tworzy interfejsy, które naturalnie łączą ludzi z technologią.",
                "sections.team.members.marta.skills.uxResearch": "Badania UX",
                "sections.team.members.marta.skills.aiUxDesign": "Projektowanie AI/UX",
                "sections.team.members.roman.name": "Roman Domina",
                "sections.team.members.roman.position": "Specjalista Automatyzacji AI",
                "sections.team.members.roman.description": "Ekspert od automatyzacji procesów biznesowych z AI i analizy danych social media. Zwiększa efektywność operacyjną.",
                "sections.team.members.roman.skills.processAutomation": "Automatyzacja Procesów",
                "sections.team.members.roman.skills.aiAnalytics": "Analityka AI",
                "sections.caseStudies.title": "Studia Przypadków & Portfolio",
                "sections.caseStudies.subtitle": "Prawdziwe projekty, konkretne rezultaty - zobacz jak transformujemy biznesy przez AI",
                "sections.process.title": "Nasz Proces Pracy",
                "sections.process.subtitle": "Od pomysłu do gotowego rozwiązania AI - sprawdzony proces, który gwarantuje sukces",
                "sections.process.steps.discovery.title": "Discovery",
                "sections.process.steps.discovery.description": "Analizujemy Twoje procesy i identyfikujemy możliwości AI",
                "sections.process.steps.strategy.title": "Strategia & Plan",
                "sections.process.steps.strategy.description": "Tworzymy roadmapę wdrożenia z priorytetami i harmonogramem",
                "sections.process.steps.prototype.title": "Prototyp & MVP",
                "sections.process.steps.prototype.description": "Szybki prototyp do testowania i walidacji rozwiązania",
                "sections.process.steps.development.title": "Rozwój & Integracja",
                "sections.process.steps.development.description": "Pełne wdrożenie AI, automatyzacja i integracja systemów",
                "sections.process.steps.launch.title": "Wdrożenie & Szkolenie",
                "sections.process.steps.launch.description": "Uruchomienie produkcyjne i szkolenie zespołu",
                "sections.process.steps.optimization.title": "Optymalizacja & Wsparcie",
                "sections.process.steps.optimization.description": "Ciągłe ulepszanie AI i 24/7 wsparcie techniczne",
                "sections.testimonials.title": "Referencje Klientów",
                "sections.testimonials.subtitle": "Co mówią o nas nasi klienci",
                "sections.partners.title": "Współpracujemy z najlepszymi",
                "sections.partners.subtitle": "Moc platform. Precyzja wdrożeń.",
                "sections.contact.title": "Rozpocznij projekt",
                "sections.contact.subtitle": "Skontaktuj się z nami, aby omówić swój projekt. Oferujemy bezpłatną konsultację i wycenę.",
                "sections.contact.description": "Skontaktuj się z nami, aby omówić swój projekt. Oferujemy bezpłatną konsultację i wycenę.",
                "sections.contact.contactUs": "Kontakt",
                "sections.contact.phone": "Zadzwoń",
                "sections.contact.email": "Email",
                "sections.contact.phoneNumber": "+48 535 330 323",
                "sections.contact.emailAddress": "hello@ecm-digital.com",
                "sections.contact.responseTime": "Czas Odpowiedzi",
                "sections.contact.responseTimeValue": "24 godziny",
                "sections.contact.sendMessage": "Napisz Email",
                "sections.contact.email.title": "Email",
                "sections.contact.email.description": "Napisz do nas email z opisem projektu",
                "sections.contact.email.button": "Wyślij Email",
                "sections.contact.phone.title": "Telefon",
                "sections.contact.phone.description": "Zadzwoń do nas, aby omówić szczegóły projektu",
                "sections.contact.phone.button": "Zadzwoń",
                "sections.contact.consultation.title": "Bezpłatna Konsultacja",
                "sections.contact.consultation.description": "Umów się na bezpłatną konsultację z naszym ekspertem",
                "sections.contact.consultation.button": "Umów Konsultację",
                "sections.contact.hours.title": "Godziny Pracy",
                "sections.contact.hours.description": "Jesteśmy dostępni w dni robocze",
                "sections.contact.hours.weekdays": "Poniedziałek - Piątek:",
                "sections.contact.hours.time": "9:00 - 17:00",
                "sections.contact.address.title": "Adres",
                "sections.contact.address.description": "Siedziba naszej firmy",
                "sections.contact.address.line1": "ECM Digital",
                "sections.contact.address.line2": "ul. Przykładowa 123",
                "sections.contact.address.line3": "00-001 Warszawa, Polska",
                "sections.contact.quick.title": "Szybki Kontakt",
                "sections.contact.quick.description": "Masz pilne pytanie? Napisz do nas!",
                "sections.contact.quick.button": "Napisz Teraz",
                "sections.contact.form.title": "Formularz Kontaktowy",
                "sections.contact.form.description": "Wypełnij formularz, a skontaktujemy się z Tobą w ciągu 24 godzin",
                "sections.contact.form.name": "Imię i Nazwisko *",
                "sections.contact.form.email": "Email *",
                "sections.contact.form.phone": "Telefon",
                "sections.contact.form.company": "Firma",
                "sections.contact.form.service": "Interesująca Usługa",
                "sections.contact.form.service.placeholder": "Wybierz usługę...",
                "sections.contact.form.service.consultation": "Konsultacja",
                "sections.contact.form.budget": "Budżet Projektu",
                "sections.contact.form.budget.placeholder": "Wybierz zakres...",
                "sections.contact.form.budget.3-5k": "3,000 - 5,000 PLN",
                "sections.contact.form.budget.5-10k": "5,000 - 10,000 PLN",
                "sections.contact.form.budget.10-25k": "10,000 - 25,000 PLN",
                "sections.contact.form.budget.25k+": "Powyżej 25,000 PLN",
                "sections.contact.form.budget.consultation": "Potrzebuję konsultacji",
                "sections.contact.form.message": "Wiadomość *",
                "sections.contact.form.submit": "Wyślij Wiadomość"
            },
            "services.shopifyStores.heroTitle": "Sklepy <span style=\"color: #96BF47;\">Shopify & Wix</span> Które <span style=\"color: #30D158;\">Sprzedają</span>",
            "services.shopifyStores.heroDescription": "Tworzymy profesjonalne sklepy e-commerce na platformach Shopify i Wix, które konwertują odwiedzających w klientów. Custom design, zaawansowane integracje i automatyzacja sprzedaży.",
            "services.shopifyStores.stats.salesGrowth": "Wzrost Sprzedaży",
            "services.shopifyStores.stats.loadTime": "Czas Ładowania",
            "services.shopifyStores.stats.startPrice": "PLN Start",
            "services.shopifyStores.features.title": "Co Otrzymasz",
            "services.shopifyStores.features.subtitle": "Kompleksowe rozwiązanie e-commerce na platformach Shopify i Wix",
            "services.shopifyStores.features.customDesign.title": "Custom Design",
            "services.shopifyStores.features.customDesign.description": "Unikalny design dopasowany do Twojej marki i grupy docelowej",
            "services.shopifyStores.features.mobileFirst.title": "Mobile-First",
            "services.shopifyStores.features.mobileFirst.description": "Zoptymalizowany pod kątem urządzeń mobilnych, gdzie odbywa się 70% zakupów",
            "services.shopifyStores.features.payments.title": "Płatności & Dostawa",
            "services.shopifyStores.features.payments.description": "Integracje z popularnymi bramkami płatności i firmami kurierskimi",
            "sections.about.mission": "Misja",
            "sections.about.mission.description": "Demokratyzujemy dostęp do AI, pomagając firmom każdej wielkości wykorzystać potencjał sztucznej inteligencji dla wzrostu biznesowego.",
            "sections.about.vision": "Wizja",
            "sections.about.vision.description": "Być liderem cyfrowej transformacji w Polsce, tworząc rozwiązania AI, które rzeczywiście zwiększają efektywność i przychody.",
            "sections.about.values": "Wartości",
            "sections.about.values.description": "Innowacyjność, transparentność i rezultaty. Realizujemy każdy projekt z pasją, dostarczając mierzalne korzyści biznesowe.",
            en: {
                "sections.about.title": "About ECM Digital",
                "sections.about.subtitle": "Team of AI experts who transform business through intelligent solutions",
                "sections.services.title": "Our Services",
                "sections.services.subtitle": "Comprehensive AI and automation solutions that transform your business and increase efficiency",
                "sections.team.title": "Our Team",
                "sections.team.subtitle": "Meet the experts who create your projects",
                "hero.title": "We implement AI in your company",
                "hero.subtitle": "We transform your company through artificial intelligence. From chatbots to advanced automation - AI that really works and generates real business benefits.",
                "hero.stats.aiProjects": "50+",
                "hero.stats.aiProjectsLabel": "AI Projects",
                "hero.stats.costReduction": "70%",
                "hero.stats.costReductionLabel": "Cost Reduction",
                "hero.stats.support": "24/7",
                "hero.stats.supportLabel": "AI Support",
                "hero.stats.satisfaction": "95%",
                "hero.stats.satisfactionLabel": "Satisfaction",
                "sections.team.members.tomasz.name": "Tomasz Gnat",
                "sections.team.members.tomasz.position": "Discovery Consultant",
                "sections.team.members.tomasz.description": "Expert in discovering business needs and AI strategy. Helps companies identify areas for automation.",
                "sections.team.members.tomasz.skills.businessAnalysis": "Business Analysis",
                "sections.team.members.tomasz.skills.aiStrategy": "AI Strategy",
                "sections.team.members.marta.name": "Marta Górska",
                "sections.team.members.marta.position": "UX/UI Designer",
                "sections.team.members.marta.description": "Designer focused on user needs in the AI era. Creates interfaces that naturally connect humans with technology.",
                "sections.team.members.marta.skills.uxResearch": "UX Research",
                "sections.team.members.marta.skills.aiUxDesign": "AI/UX Design",
                "sections.team.members.karol.name": "Karol Czechowski",
                "sections.team.members.karol.position": "QA & AI Developer",
                "sections.team.members.karol.description": "Specialist in AI solution quality assurance and automated testing. Guarantees system reliability.",
                "sections.team.members.karol.skills.aiTesting": "AI Testing",
                "sections.team.members.karol.skills.qualityAssurance": "Quality Assurance",
                "sections.team.members.roman.name": "Roman Domina",
                "sections.team.members.roman.position": "AI Automation Specialist",
                "sections.team.members.roman.description": "Expert in business process automation with AI and social media data analysis. Increases operational efficiency.",
                "sections.team.members.roman.skills.processAutomation": "Process Automation",
                "sections.team.members.roman.skills.aiAnalytics": "AI Analytics",
                "sections.caseStudies.title": "Case Studies & Portfolio",
                "sections.caseStudies.subtitle": "Real projects, concrete results - see how we transform businesses through AI",
                "sections.process.title": "Our Work Process",
                "sections.process.subtitle": "From idea to ready AI solution - proven process that guarantees success",
                "sections.process.steps.discovery.title": "Discovery",
                "sections.process.steps.discovery.description": "We analyze your processes and identify AI opportunities",
                "sections.process.steps.strategy.title": "Strategy & Plan",
                "sections.process.steps.strategy.description": "We create implementation roadmap with priorities and timeline",
                "sections.process.steps.prototype.title": "Prototype & MVP",
                "sections.process.steps.prototype.description": "Quick prototype for testing and validating the solution",
                "sections.process.steps.development.title": "Development & Integration",
                "sections.process.steps.development.description": "Full AI implementation, automation and system integration",
                "sections.process.steps.launch.title": "Deployment & Training",
                "sections.process.steps.launch.description": "Production launch and team training",
                "sections.process.steps.optimization.title": "Optimization & Support",
                "sections.process.steps.optimization.description": "Continuous AI improvement and 24/7 technical support",
                "sections.testimonials.title": "Client Testimonials",
                "sections.testimonials.subtitle": "What our clients say about working with us",
                "sections.partners.title": "We Work with the Best",
                "sections.partners.subtitle": "Platform power. Implementation precision.",
                "sections.contact.title": "Start Your Project",
                "sections.contact.subtitle": "Contact us to discuss your project. We offer free consultation and quote.",
                "sections.contact.description": "Contact us to discuss your project. We offer free consultation and quote.",
                "sections.contact.contactUs": "Contact Us",
                "sections.contact.phone": "Call",
                "sections.contact.email": "Email",
                "sections.contact.phoneNumber": "+48 535 330 323",
                "sections.contact.emailAddress": "hello@ecm-digital.com",
                "sections.contact.responseTime": "Response Time",
                "sections.contact.responseTimeValue": "24 hours",
                "sections.contact.sendMessage": "Write Email",
                "sections.contact.email.title": "Email",
                "sections.contact.email.description": "Write us an email with your project description",
                "sections.contact.email.button": "Send Email",
                "sections.contact.phone.title": "Phone",
                "sections.contact.phone.description": "Call us to discuss project details",
                "sections.contact.phone.button": "Call",
                "sections.contact.consultation.title": "Free Consultation",
                "sections.contact.consultation.description": "Schedule a free consultation with our expert",
                "sections.contact.consultation.button": "Book Consultation",
                "sections.contact.hours.title": "Business Hours",
                "sections.contact.hours.description": "We are available on business days",
                "sections.contact.hours.weekdays": "Monday - Friday:",
                "sections.contact.hours.time": "9:00 - 17:00",
                "sections.contact.address.title": "Address",
                "sections.contact.address.description": "Our company headquarters",
                "sections.contact.address.line1": "ECM Digital",
                "sections.contact.address.line2": "Sample Street 123",
                "sections.contact.address.line3": "00-001 Warsaw, Poland",
                "sections.contact.quick.title": "Quick Contact",
                "sections.contact.quick.description": "Have an urgent question? Write to us!",
                "sections.contact.quick.button": "Write Now",
                "sections.contact.form.title": "Contact Form",
                "sections.contact.form.description": "Fill out the form and we will contact you within 24 hours",
                "sections.contact.form.name": "Full Name *",
                "sections.contact.form.email": "Email *",
                "sections.contact.form.phone": "Phone",
                "sections.contact.form.company": "Company",
                "sections.contact.form.service": "Service of Interest",
                "sections.contact.form.service.placeholder": "Choose service...",
                "sections.contact.form.service.consultation": "Consultation",
                "sections.contact.form.budget": "Project Budget",
                "sections.contact.form.budget.placeholder": "Choose range...",
                "sections.contact.form.budget.3-5k": "3,000 - 5,000 PLN",
                "sections.contact.form.budget.5-10k": "5,000 - 10,000 PLN",
                "sections.contact.form.budget.10-25k": "10,000 - 25,000 PLN",
                "sections.contact.form.budget.25k+": "Above 25,000 PLN",
                "sections.contact.form.budget.consultation": "Need consultation",
                "sections.contact.form.message": "Message *",
                "sections.contact.form.submit": "Send Message"
            },
            "services.shopifyStores.heroTitle": "Shopify & Wix Stores That <span style=\"color: #96BF47;\">Sell</span>",
            "services.shopifyStores.heroDescription": "We create professional e-commerce stores on Shopify and Wix platforms that convert visitors into customers. Custom design, advanced integrations and sales automation.",
            "services.shopifyStores.stats.salesGrowth": "Sales Growth",
            "services.shopifyStores.stats.loadTime": "Load Time",
            "services.shopifyStores.stats.startPrice": "Starting Price",
            "services.shopifyStores.features.title": "What You Get",
            "services.shopifyStores.features.subtitle": "Comprehensive e-commerce solution on Shopify and Wix platforms",
            "services.shopifyStores.features.customDesign.title": "Custom Design",
            "services.shopifyStores.features.customDesign.description": "Unique design tailored to your brand and target audience",
            "services.shopifyStores.features.mobileFirst.title": "Mobile-First",
            "services.shopifyStores.features.mobileFirst.description": "Optimized for mobile devices where 70% of purchases take place",
            "services.shopifyStores.features.payments.title": "Payments & Shipping",
            "services.shopifyStores.features.payments.description": "Integrations with popular payment gateways and courier companies",
            "sections.about.mission": "Mission",
            "sections.about.mission.description": "We democratize access to AI, helping companies of all sizes leverage the potential of artificial intelligence for business growth.",
            "sections.about.vision": "Vision",
            "sections.about.vision.description": "To be a leader in digital transformation in Poland, creating AI solutions that really increase efficiency and revenue.",
            "sections.about.values": "Values",
            "sections.about.values.description": "Innovation, transparency and results. We implement every project with passion, delivering measurable business benefits.",
            de: {
                "sections.about.title": "Über ECM Digital",
                "sections.about.subtitle": "KI-Experten, die Geschäft durch intelligente Lösungen transformieren",
                "sections.services.title": "Unsere Dienstleistungen",
                "sections.services.subtitle": "Komplexe KI-Lösungen und Automatisierung, die Ihr Unternehmen transformieren und die Effizienz steigern",
                "sections.team.title": "Unser Team",
                "sections.team.subtitle": "Lernen Sie die Experten kennen, die Ihre Projekte erstellen",
                "hero.title": "Wir implementieren KI in Ihrem Unternehmen",
                "hero.subtitle": "Wir transformieren Ihr Unternehmen durch künstliche Intelligenz. Von Chatbots bis hin zu fortschrittlicher Automatisierung.",
                "hero.stats.aiProjects": "50+",
                "hero.stats.aiProjectsLabel": "KI-Projekte",
                "hero.stats.costReduction": "70%",
                "hero.stats.costReductionLabel": "Kostensenkung",
                "hero.stats.support": "24/7",
                "hero.stats.supportLabel": "KI-Unterstützung",
                "hero.stats.satisfaction": "95%",
                "hero.stats.satisfactionLabel": "Zufriedenheit",
                "sections.team.members.tomasz.name": "Tomasz Gnat",
                "sections.team.members.tomasz.position": "Discovery-Berater",
                "sections.team.members.tomasz.description": "Experte für die Entdeckung von Geschäftsanforderungen und KI-Strategien. Hilft Unternehmen, Bereiche für die Automatisierung zu identifizieren.",
                "sections.team.members.tomasz.skills.businessAnalysis": "Business Analysis",
                "sections.team.members.tomasz.skills.aiStrategy": "KI-Strategie",
                "sections.team.members.marta.name": "Marta Górska",
                "sections.team.members.marta.position": "UX/UI Designerin",
                "sections.team.members.marta.description": "Designerin mit Fokus auf Benutzerbedürfnisse im KI-Zeitalter. Erstellt Schnittstellen, die Menschen und Technologie natürlich verbinden.",
                "sections.team.members.marta.skills.uxResearch": "UX Research",
                "sections.team.members.marta.skills.aiUxDesign": "KI/UX Design",
                "sections.team.members.karol.name": "Karol Czechowski",
                "sections.team.members.karol.position": "QA & KI-Entwickler",
                "sections.team.members.karol.description": "Spezialist für Qualitätssicherung von KI-Lösungen und automatisiertes Testen. Garantiert Systemzuverlässigkeit.",
                "sections.team.members.karol.skills.aiTesting": "KI-Tests",
                "sections.team.members.karol.skills.qualityAssurance": "Qualitätssicherung",
                "sections.team.members.roman.name": "Roman Domina",
                "sections.team.members.roman.position": "KI-Automatisierungs-Spezialist",
                "sections.team.members.roman.description": "Experte für Geschäftsprozessautomatisierung mit KI und Social-Media-Datenanalyse. Steigert die Betriebseffizienz.",
                "sections.team.members.roman.skills.processAutomation": "Prozessautomatisierung",
                "sections.team.members.roman.skills.aiAnalytics": "KI-Analytik"
            },
            "services.shopifyStores.heroTitle": "Shopify & Wix Shops die <span style=\"color: #96BF47;\">verkaufen</span>",
            "services.shopifyStores.heroDescription": "Wir erstellen professionelle E-Commerce-Shops auf Shopify- und Wix-Plattformen, die Besucher in Kunden umwandeln. Custom Design, fortschrittliche Integrationen und Verkaufsautomatisierung.",
            "services.shopifyStores.stats.salesGrowth": "Umsatzwachstum",
            "services.shopifyStores.stats.loadTime": "Ladezeit",
            "services.shopifyStores.stats.startPrice": "Startpreis",
            "services.shopifyStores.features.title": "Was Sie erhalten",
            "services.shopifyStores.features.subtitle": "Umfassende E-Commerce-Lösung auf Shopify- und Wix-Plattformen",
            "services.shopifyStores.features.customDesign.title": "Custom Design",
            "services.shopifyStores.features.customDesign.description": "Einzigartiges Design, das auf Ihre Marke und Zielgruppe zugeschnitten ist",
            "services.shopifyStores.features.mobileFirst.title": "Mobile-First",
            "services.shopifyStores.features.mobileFirst.description": "Optimiert für mobile Geräte, wo 70% der Käufe stattfinden",
            "services.shopifyStores.features.payments.title": "Zahlungen & Versand",
            "services.shopifyStores.features.payments.description": "Integrationen mit beliebten Zahlungsgateways und Kurierunternehmen",
            "sections.about.mission": "Mission",
            "sections.about.mission.description": "Wir demokratisieren den Zugang zu KI und helfen Unternehmen jeder Größe, das Potenzial künstlicher Intelligenz für Geschäftswachstum zu nutzen.",
            "sections.about.vision": "Vision",
            "sections.about.vision.description": "Führend in der digitalen Transformation in Polen zu sein und KI-Lösungen zu schaffen, die Effizienz und Umsatz wirklich steigern.",
            "sections.about.values": "Werte",
            "sections.about.values.description": "Innovation, Transparenz und Ergebnisse. Wir setzen jedes Projekt mit Leidenschaft um und liefern messbare Geschäftsvorteile."
        };

        return embeddedTranslations[lang] || {};
    }

    // Określ bazową ścieżkę na podstawie aktualnej lokalizacji
    getBasePath() {
        const path = window.location.pathname;
        const hostname = window.location.hostname;

        // Na produkcji Vercela ścieżki mogą być inne
        if (hostname.includes('vercel.app')) {
            // Na Vercelu zawsze używaj ścieżki względnej od root
            if (path.includes('/dokumentacja-ecm/oferta-uslug/')) {
                return '/';
            } else if (path.includes('/dokumentacja-ecm/')) {
                return '/';
            } else {
                return '/';
            }
        }

        // Na localhost zachowaj istniejącą logikę
        if (path.includes('/dokumentacja-ecm/oferta-uslug/')) {
            return '../../../';
        } else if (path.includes('/dokumentacja-ecm/')) {
            return '../';
        } else {
            return './';
        }
    }

    // Wbudowane tłumaczenia jako fallback
    loadFallbackTranslations() {
        this.translations = {
            pl: {
                nav: {
                    home: "Strona główna",
                    services: "Usługi",
                    about: "O nas",
                    team: "Zespół",
                    clientPanel: "Panel Klienta",
                    contact: "Kontakt"
                },
                navigation: {
                    home: "Strona główna",
                    services: "Usługi",
                    about: "O nas",
                    blog: "Blog",
                    caseStudies: "Studia Przypadków",
                    team: "Zespół",
                    myAccount: "Moje Konto",
                    contact: "Kontakt",
                    dropdown: {
                        aiSolutions: "🤖 Rozwiązania AI",
                        aiAssistants: "Asystenci AI na Amazon Bedrock",
                        voiceAssistants: "Asystenci Głosowi na Amazon Lex",
                        aiAudits: "Audyty Wdrożenia AI",
                        socialMediaAI: "Social Media & AI",
                        digitalProducts: "🌐 Produkty Cyfrowe",
                        websites: "Strony WWW",
                        shopifyStores: "Sklepy Shopify",
                        mobileApps: "Aplikacje Mobilne",
                        automationMvp: "⚡ Automatyzacja & MVP",
                        n8nAutomation: "Automatyzacje N8N",
                        mvpPrototypes: "Prototypy MVP",
                        viewAllServices: "Zobacz wszystkie usługi"
                    }
                },
                common: {
                    learnMore: "Dowiedz się więcej",
                    readMore: "Czytaj więcej"
                },
                hero: {
                    title: "Wdrażamy AI w Twojej Firmie",
                    subtitle: "Transformujemy Twoją firmę dzięki sztucznej inteligencji. Od chatbotów po zaawansowane automatyzacje - AI, które naprawdę działa i generuje realne korzyści biznesowe.",
                    exploreServices: "Zobacz Ofertę",
                    getQuote: "Darmowa Konsultacja",
                    stats: {
                        aiProjects: "50+",
                        aiProjectsLabel: "Projektów AI",
                        costReduction: "70%",
                        costReductionLabel: "Redukcja Kosztów",
                        support: "24/7",
                        supportLabel: "AI Wsparcie",
                        satisfaction: "95%",
                        satisfactionLabel: "Satysfakcja"
                    }
                },
                services: {
                    websites: {
                        title: "Strony WWW",
                        description: "Profesjonalne strony internetowe dostosowane do potrzeb biznesowych. Zoptymalizowane pod kątem SEO, wydajności i konwersji."
                    },
                    shopifyStores: {
                        title: "Sklepy Shopify",
                        description: "Profesjonalne sklepy internetowe na platformie Shopify, które skutecznie sprzedają i skalują się wraz z Twoim biznesem.",
                        heroTitle: "Sklepy <span style=\"color: #96BF47;\">Shopify & Wix</span> Które <span style=\"color: #30D158;\">Sprzedają</span>",
                        heroDescription: "Tworzymy profesjonalne sklepy e-commerce na platformach Shopify i Wix, które konwertują odwiedzających w klientów. Custom design, zaawansowane integracje i automatyzacja sprzedaży.",
                        stats: {
                            salesGrowth: "Wzrost Sprzedaży",
                            loadTime: "Czas Ładowania",
                            startPrice: "PLN Start"
                        },
                        features: {
                            title: "Co Otrzymasz",
                            subtitle: "Kompleksowe rozwiązanie e-commerce na platformach Shopify i Wix",
                            customDesign: {
                                title: "Custom Design",
                                description: "Unikalny design dopasowany do Twojej marki i grupy docelowej"
                            },
                            mobileFirst: {
                                title: "Mobile-First",
                                description: "Zoptymalizowany pod kątem urządzeń mobilnych, gdzie odbywa się 70% zakupów"
                            },
                            payments: {
                                title: "Płatności & Dostawa",
                                description: "Integracje z popularnymi bramkami płatności i firmami kurierskimi"
                            },
                            analytics: {
                                title: "Analytics & Tracking",
                                description: "Google Analytics, Facebook Pixel, konwersje i pełny tracking sprzedaży"
                            },
                            automation: {
                                title: "Automatyzacja",
                                description: "Email marketing, odzyskiwanie koszyków, zarządzanie stanami magazynowymi"
                            },
                            seo: {
                                title: "SEO & Marketing",
                                description: "Optymalizacja pod wyszukiwarki i integracje marketingowe"
                            }
                        },
                        process: {
                            title: "Jak Tworzymy Sklepy Shopify & Wix",
                            subtitle: "Kompleksowy proces od analizy po launch i skalowanie"
                        }
                    },
                    mvpPrototypes: {
                        title: "Prototypy MVP",
                        description: "Szybka walidacja pomysłów biznesowych poprzez tworzenie funkcjonalnych prototypów. Minimalizujemy ryzyko i maksymalizujemy szanse na sukces."
                    },
                    uxAudits: {
                        title: "Audyty Wdrożenia AI w Twojej Firmie",
                        description: "Analizujemy Twoje procesy biznesowe i identyfikujemy obszary do automatyzacji AI. Kompleksowy plan wdrożenia sztucznej inteligencji."
                    },
                    automation: {
                        title: "Automatyzacje",
                        description: "Oszczędzaj 15-20 godzin tygodniowo automatyzując powtarzalne zadania. Integracje systemów, automatyzacja workflow i eliminacja błędów ludzkich."
                    },
                    socialMediaAI: {
                        title: "Social Media & AI",
                        description: "Zwiększ zaangażowanie o 60% dzięki analizie treści AI. Dowiedz się, co naprawdę interesuje Twoich klientów."
                    },
                    aiAssistants: {
                        title: "Asystenci AI na Amazon Bedrock & Copilot Studio",
                        description: "Automatyzuj obsługę klienta 24/7 i oszczędzaj do 70% kosztów wsparcia. Inteligentni asystenci AI odpowiadają na pytania i rozwiązują problemy."
                    },
                    mobileApps: {
                        title: "Aplikacje Mobilne",
                        description: "Od pomysłu do App Store w 8-12 tygodni. Nowoczesne aplikacje iOS i Android, które zwiększają przychody i zaangażowanie klientów."
                    },
                    voiceAssistants: {
                        title: "Asystenci Głosowi na Amazon Lex",
                        description: "Głosowa obsługa klienta - dostępność 24/7 bez kosztów call center. Naturalne rozmowy, inteligentne odpowiedzi."
                    }
                },
                blog: {
                    aiTrends: {
                        category: "🤖 AI Trends",
                        title: "Jak AI zmienia e-commerce w 2024?",
                        description: "Odkryj najnowsze trendy AI dla e-commerce: personalizacja, chatboty, rekomendacje produktów i automatyzacja procesów sprzedaży.",
                        readTime: "15 min czytania",
                        views: "2.5k wyświetleń",
                        tags: {
                            ecommerce: "E-commerce",
                            ai: "AI",
                            trends: "Trends"
                        }
                    },
                    automation: {
                        category: "⚡ Automation",
                        title: "10 procesów biznesowych do automatyzacji",
                        description: "Praktyczny przewodnik po procesach, które warto zautomatyzować w pierwszej kolejności. Oszczędzaj czas i pieniądze dzięki AI.",
                        readTime: "12 min czytania",
                        views: "1.8k wyświetleń",
                        tags: {
                            automation: "Automatyzacja",
                            process: "Proces",
                            roi: "ROI"
                        }
                    }
                },
                newsletter: {
                    title: "📧 Bądź na bieżąco z trendami AI",
                    description: "Otrzymuj najnowsze artykuły, case studies i ekskluzywne wskazówki bezpośrednio na swoją skrzynkę",
                    placeholder: "Twój email",
                    subscribe: "Subskrybuj",
                    privacy: "🔒 Nie spamujemy. Możesz zrezygnować z subskrypcji w dowolnym momencie."
                },
                sections: {
                    services: { 
                        title: "Nasze Usługi",
                        subtitle: "Kompleksowe rozwiązania AI i automatyzacji, które transformują Twój biznes i zwiększają efektywność"
                    },
                    about: { title: "O ECM Digital" },
                    blog: {
                        title: "Blog & Insights",
                        subtitle: "Najnowsze trendy AI, case studies i praktyczne wskazówki dla Twojego biznesu"
                    },
                    team: { 
                        title: "Nasz Zespół", 
                        subtitle: "Poznaj ekspertów, którzy tworzą Twoje projekty",
                        members: {
                            tomasz: {
                                name: "Tomasz Gnat",
                                position: "Konsultant Discovery",
                                description: "Ekspert w odkrywaniu potrzeb biznesowych i strategii AI. Pomaga firmom identyfikować obszary do automatyzacji.",
                                skills: { businessAnalysis: "Business Analysis", aiStrategy: "AI Strategy" }
                            },
                            marta: {
                                name: "Marta Górska",
                                position: "Projektant UX/UI",
                                description: "Projektantka skupiona na potrzebach użytkowników w erze AI. Tworzy interfejsy, które naturalnie łączą ludzi z technologią.",
                                skills: { uxResearch: "UX Research", aiUxDesign: "AI/UX Design" }
                            },
                            karol: {
                                name: "Karol Czechowski",
                                position: "QA & Deweloper AI",
                                description: "Specjalista w zapewnianiu jakości rozwiązań AI i testowaniu automatycznym. Gwarantuje niezawodność systemów.",
                                skills: { aiTesting: "AI Testing", qualityAssurance: "Quality Assurance" }
                            },
                            roman: {
                                name: "Roman Domina",
                                position: "Specjalista Automatyzacji AI",
                                description: "Ekspert w automatyzacji procesów biznesowych z AI i analizie danych social media. Zwiększa efektywność operacyjną.",
                                skills: { processAutomation: "Process Automation", aiAnalytics: "AI Analytics" }
                            }
                        }
                    },
                    process: { 
                        title: "Nasz Proces Pracy",
                        steps: {
                            discovery: { title: "Konsultacja", description: "Analiza potrzeb i wymagań projektu" },
                            design: { title: "Planowanie", description: "Strategia i architektura rozwiązania" },
                            development: { title: "Realizacja", description: "Development i testowanie" },
                            launch: { title: "Wdrożenie", description: "Uruchomienie i wsparcie" }
                        }
                    },
                    contact: { 
                        title: "Rozpocznij Projekt",
                        description: "Skontaktuj się z nami, aby omówić Twój projekt. Oferujemy darmową konsultację i wycenę.",
                        contactUs: "Skontaktuj się z nami",
                        sendMessage: "Napisz Email",
                        phone: "Zadzwoń"
                    }
                },
                company: {
                    name: "ECM Digital",
                    description1: "ECM Digital to marka oferująca nowoczesne rozwiązania cyfrowe.",
                    description2: "Zapewniamy bezpieczeństwo i transparentność współpracy.",
                    badge: "Spółka Zarejestrowana<br>Sp. z o.o.",
                    stats: {
                        aiProjects: "50+",
                        aiProjectsLabel: "Projektów AI",
                        clientSatisfaction: "95%",
                        clientSatisfactionLabel: "Satysfakcja Klienta",
                        technicalSupport: "24/7",
                        technicalSupportLabel: "Wsparcie Techniczne",
                        yearFounded: "2019",
                        yearFoundedLabel: "Rok Założenia"
                    }
                },
                footer: { copyright: "© 2025 ECM Digital. Wszystkie prawa zastrzeżone." }
            },
            en: {
                nav: {
                    home: "Home",
                    services: "Services",
                    about: "About Us",
                    team: "Team",
                    clientPanel: "Client Panel",
                    contact: "Contact"
                },
                navigation: {
                    home: "Home",
                    services: "Services",
                    about: "About Us",
                    blog: "Blog",
                    caseStudies: "Case Studies",
                    team: "Team",
                    myAccount: "My Account",
                    contact: "Contact",
                    dropdown: {
                        aiSolutions: "🤖 AI Solutions",
                        aiAssistants: "AI Assistants on Amazon Bedrock",
                        voiceAssistants: "Voice Assistants on Amazon Lex",
                        aiAudits: "AI Implementation Audits",
                        socialMediaAI: "Social Media & AI",
                        digitalProducts: "🌐 Digital Products",
                        websites: "Websites",
                        shopifyStores: "Shopify Stores",
                        mobileApps: "Mobile Applications",
                        automationMvp: "⚡ Automation & MVP",
                        n8nAutomation: "N8N Automations",
                        mvpPrototypes: "MVP Prototypes",
                        viewAllServices: "View All Services"
                    }
                },
                common: {
                    learnMore: "Learn More",
                    readMore: "Read more"
                },
                hero: {
                    title: "We Implement AI in Your Company",
                    subtitle: "We transform your company through artificial intelligence. From chatbots to advanced automation - AI that really works and generates real business benefits.",
                    exploreServices: "View Offer",
                    getQuote: "Free Consultation",
                    stats: {
                        aiProjects: "50+",
                        aiProjectsLabel: "AI Projects",
                        costReduction: "70%",
                        costReductionLabel: "Cost Reduction",
                        support: "24/7",
                        supportLabel: "AI Support",
                        satisfaction: "95%",
                        satisfactionLabel: "Satisfaction"
                    }
                },
                services: {
                    websites: {
                        title: "Websites",
                        description: "Professional websites tailored to business needs. Optimized for SEO, performance and conversion."
                    },
                    shopifyStores: {
                        title: "Shopify Stores",
                        description: "Professional online stores on the Shopify platform that effectively sell and scale with your business.",
                        heroTitle: "Shopify & Wix Stores That Convert",
                        heroDescription: "We build professional e‑commerce stores on Shopify and Wix that turn visitors into customers. Custom design, advanced integrations and sales automation.",
                        stats: {
                            salesGrowth: "Sales Growth",
                            loadTime: "Load Time",
                            startPrice: "PLN Start"
                        },
                        features: {
                            title: "What You Get",
                            subtitle: "A complete e‑commerce solution on Shopify and Wix",
                            customDesign: {
                                title: "Custom Design",
                                description: "Unique design tailored to your brand and audience"
                            },
                            mobileFirst: {
                                title: "Mobile‑First",
                                description: "Optimized for mobile devices where 70% of purchases happen"
                            },
                            payments: {
                                title: "Payments & Shipping",
                                description: "Integrations with popular payment gateways and couriers"
                            },
                            analytics: {
                                title: "Analytics & Tracking",
                                description: "Google Analytics, Facebook Pixel, conversions and full sales tracking"
                            },
                            automation: {
                                title: "Automation",
                                description: "Email marketing, abandoned cart recovery, inventory management"
                            },
                            seo: {
                                title: "SEO & Marketing",
                                description: "Search engine optimization and marketing integrations"
                            }
                        },
                        process: {
                            title: "How We Build Shopify & Wix Stores",
                            subtitle: "End‑to‑end process from analysis to launch and growth"
                        }
                    },
                    mvpPrototypes: {
                        title: "MVP Prototypes",
                        description: "Quick validation of business ideas through creating functional prototypes. We minimize risk and maximize chances of success."
                    },
                    uxAudits: {
                        title: "AI Implementation Audits in Your Company",
                        description: "We analyze your business processes and identify areas for AI automation. Comprehensive artificial intelligence implementation plan."
                    },
                    automation: {
                        title: "Automation",
                        description: "Save 15-20 hours weekly by automating repetitive tasks. System integrations, workflow automation and elimination of human errors."
                    },
                    socialMediaAI: {
                        title: "Social Media & AI",
                        description: "Increase engagement by 60% through AI content analysis. Learn what really interests your customers."
                    },
                    aiAssistants: {
                        title: "AI Assistants on Amazon Bedrock & Copilot Studio",
                        description: "Automate customer service 24/7 and save up to 70% on support costs. Intelligent AI assistants answer questions and solve problems."
                    },
                    mobileApps: {
                        title: "Mobile Applications",
                        description: "From idea to App Store in 8-12 weeks. Modern iOS and Android applications that increase revenue and customer engagement."
                    },
                    voiceAssistants: {
                        title: "Voice Assistants on Amazon Lex",
                        description: "Voice customer service - 24/7 availability without call center costs. Natural conversations, intelligent responses."
                    }
                },
                blog: {
                    aiTrends: {
                        category: "🤖 AI Trends",
                        title: "How AI is changing e-commerce in 2024?",
                        description: "Discover the latest AI trends for e-commerce: personalization, chatbots, product recommendations and sales process automation.",
                        readTime: "15 min read",
                        views: "2.5k views",
                        tags: {
                            ecommerce: "E-commerce",
                            ai: "AI",
                            trends: "Trends"
                        }
                    },
                    automation: {
                        category: "⚡ Automation",
                        title: "10 business processes to automate",
                        description: "Practical guide to processes worth automating first. Save time and money with AI.",
                        readTime: "12 min read",
                        views: "1.8k views",
                        tags: {
                            automation: "Automation",
                            process: "Process",
                            roi: "ROI"
                        }
                    }
                },
                newsletter: {
                    title: "📧 Stay up to date with AI trends",
                    description: "Receive the latest articles, case studies and exclusive tips directly to your inbox",
                    placeholder: "Your email",
                    subscribe: "Subscribe",
                    privacy: "🔒 We don't spam. You can unsubscribe at any time."
                },
                sections: {
                    services: { 
                        title: "Our Services",
                        subtitle: "Comprehensive AI and automation solutions that transform your business and increase efficiency"
                    },
                    about: { title: "About ECM Digital" },
                    blog: {
                        title: "Blog & Insights",
                        subtitle: "Latest AI trends, case studies and practical tips for your business"
                    },
                    team: { title: "Our Team", subtitle: "Meet the experts who create your projects" },
                    process: { 
                        title: "Our Work Process",
                        steps: {
                            discovery: { title: "Consultation", description: "Analysis of project needs and requirements" },
                            design: { title: "Planning", description: "Strategy and solution architecture" },
                            development: { title: "Implementation", description: "Development and testing" },
                            launch: { title: "Deployment", description: "Launch and support" }
                        }
                    },
                    contact: { 
                        title: "Start Your Project",
                        description: "Contact us to discuss your project. We offer free consultation and quote.",
                        contactUs: "Contact Us",
                        sendMessage: "Write Email",
                        phone: "Call"
                    }
                },
                company: {
                    name: "ECM Digital",
                    description1: "ECM Digital is a brand offering modern digital solutions.",
                    description2: "We ensure security and transparency of cooperation.",
                    badge: "Registered Company<br>Sp. z o.o.",
                    stats: {
                        aiProjects: "50+",
                        aiProjectsLabel: "AI Projects",
                        clientSatisfaction: "95%",
                        clientSatisfactionLabel: "Client Satisfaction",
                        technicalSupport: "24/7",
                        technicalSupportLabel: "Technical Support",
                        yearFounded: "2019",
                        yearFoundedLabel: "Year Founded"
                    }
                },
                footer: { copyright: "© 2025 ECM Digital. All rights reserved." }
            },
            de: {
                nav: {
                    home: "Startseite",
                    services: "Dienstleistungen",
                    about: "Über uns",
                    team: "Team",
                    clientPanel: "Kundenbereich",
                    contact: "Kontakt"
                },
                navigation: {
                    home: "Startseite",
                    services: "Dienstleistungen",
                    about: "Über uns",
                    blog: "Blog",
                    caseStudies: "Fallstudien",
                    team: "Team",
                    myAccount: "Mein Konto",
                    contact: "Kontakt",
                    dropdown: {
                        aiSolutions: "🤖 KI-Lösungen",
                        aiAssistants: "KI-Assistenten auf Amazon Bedrock",
                        voiceAssistants: "Sprachassistenten auf Amazon Lex",
                        aiAudits: "KI-Implementierungsaudits",
                        socialMediaAI: "Social Media & KI",
                        digitalProducts: "🌐 Digitale Produkte",
                        websites: "Websites",
                        shopifyStores: "Shopify Stores",
                        mobileApps: "Mobile Anwendungen",
                        automationMvp: "⚡ Automatisierung & MVP",
                        n8nAutomation: "N8N-Automatisierungen",
                        mvpPrototypes: "MVP-Prototypen",
                        viewAllServices: "Alle Dienstleistungen anzeigen"
                    }
                },
                common: {
                    learnMore: "Mehr erfahren",
                    readMore: "Weiterlesen"
                },
                hero: {
                    title: "Wir implementieren KI in Ihrem Unternehmen",
                    subtitle: "Wir transformieren Ihr Unternehmen durch künstliche Intelligenz. Von Chatbots bis hin zu fortschrittlicher Automatisierung - KI, die wirklich funktioniert und echte Geschäftsvorteile generiert.",
                    exploreServices: "Angebot ansehen",
                    getQuote: "Kostenlose Beratung",
                    stats: {
                        aiProjects: "50+",
                        aiProjectsLabel: "KI-Projekte",
                        costReduction: "70%",
                        costReductionLabel: "Kostensenkung",
                        support: "24/7",
                        supportLabel: "KI-Unterstützung",
                        satisfaction: "95%",
                        satisfactionLabel: "Zufriedenheit"
                    }
                },
                services: {
                    websites: {
                        title: "Websites",
                        description: "Professionelle Websites, die auf Geschäftsanforderungen zugeschnitten sind. Optimiert für SEO, Leistung und Konversion."
                    },
                    shopifyStores: {
                        title: "Shopify Stores",
                        description: "Professionelle Online‑Shops auf der Shopify‑Plattform, die effektiv verkaufen und mit Ihrem Unternehmen wachsen.",
                        heroTitle: "Shopify & Wix Shops, die konvertieren",
                        heroDescription: "Wir erstellen professionelle E‑Commerce‑Shops auf Shopify und Wix, die Besucher in Kunden verwandeln. Custom Design, erweiterte Integrationen und Verkaufsautomatisierung.",
                        stats: {
                            salesGrowth: "Umsatzwachstum",
                            loadTime: "Ladezeit",
                            startPrice: "PLN Start"
                        },
                        features: {
                            title: "Was Sie erhalten",
                            subtitle: "Komplette E‑Commerce‑Lösung auf Shopify und Wix",
                            customDesign: {
                                title: "Custom Design",
                                description: "Einzigartiges Design, abgestimmt auf Marke und Zielgruppe"
                            },
                            mobileFirst: {
                                title: "Mobile‑First",
                                description: "Optimiert für Mobilgeräte, wo 70% der Käufe stattfinden"
                            },
                            payments: {
                                title: "Zahlungen & Versand",
                                description: "Integrationen mit beliebten Zahlungsanbietern und Kurieren"
                            },
                            analytics: {
                                title: "Analytics & Tracking",
                                description: "Google Analytics, Facebook Pixel, Konversionen und vollständiges Sales‑Tracking"
                            },
                            automation: {
                                title: "Automatisierung",
                                description: "E‑Mail‑Marketing, Warenkorbabbruch‑Recovery, Lagerverwaltung"
                            },
                            seo: {
                                title: "SEO & Marketing",
                                description: "Suchmaschinenoptimierung und Marketing‑Integrationen"
                            }
                        },
                        process: {
                            title: "So bauen wir Shopify & Wix Shops",
                            subtitle: "Kompletter Prozess von Analyse bis Launch und Skalierung"
                        }
                    },
                    mvpPrototypes: {
                        title: "MVP-Prototypen",
                        description: "Schnelle Validierung von Geschäftsideen durch die Erstellung funktionaler Prototypen. Wir minimieren Risiken und maximieren Erfolgschancen."
                    },
                    uxAudits: {
                        title: "KI-Implementierungsaudits in Ihrem Unternehmen",
                        description: "Wir analysieren Ihre Geschäftsprozesse und identifizieren Bereiche für KI-Automatisierung. Umfassender künstlicher Intelligenz-Implementierungsplan."
                    },
                    automation: {
                        title: "Automatisierung",
                        description: "Sparen Sie 15-20 Stunden pro Woche durch die Automatisierung sich wiederholender Aufgaben. Systemintegrationen, Workflow-Automatisierung und Eliminierung menschlicher Fehler."
                    },
                    socialMediaAI: {
                        title: "Social Media & KI",
                        description: "Steigern Sie das Engagement um 60% durch KI-Inhaltsanalyse. Erfahren Sie, was Ihre Kunden wirklich interessiert."
                    },
                    aiAssistants: {
                        title: "KI-Assistenten auf Amazon Bedrock & Copilot Studio",
                        description: "Automatisieren Sie den Kundenservice 24/7 und sparen Sie bis zu 70% der Supportkosten. Intelligente KI-Assistenten beantworten Fragen und lösen Probleme."
                    },
                    mobileApps: {
                        title: "Mobile Anwendungen",
                        description: "Von der Idee zum App Store in 8-12 Wochen. Moderne iOS- und Android-Anwendungen, die den Umsatz und das Kundenengagement steigern."
                    },
                    voiceAssistants: {
                        title: "Sprachassistenten auf Amazon Lex",
                        description: "Sprachbasierter Kundenservice - 24/7-Verfügbarkeit ohne Call-Center-Kosten. Natürliche Gespräche, intelligente Antworten."
                    }
                },
                blog: {
                    aiTrends: {
                        category: "🤖 KI-Trends",
                        title: "Wie KI den E-Commerce 2024 verändert?",
                        description: "Entdecken Sie die neuesten KI-Trends für E-Commerce: Personalisierung, Chatbots, Produktempfehlungen und Verkaufsprozessautomatisierung.",
                        readTime: "15 Min. Lesen",
                        views: "2.5k Aufrufe",
                        tags: {
                            ecommerce: "E-Commerce",
                            ai: "KI",
                            trends: "Trends"
                        }
                    },
                    automation: {
                        category: "⚡ Automatisierung",
                        title: "10 Geschäftsprozesse zu automatisieren",
                        description: "Praktischer Leitfaden zu Prozessen, die es sich lohnt, zuerst zu automatisieren. Sparen Sie Zeit und Geld mit KI.",
                        readTime: "12 Min. Lesen",
                        views: "1.8k Aufrufe",
                        tags: {
                            automation: "Automatisierung",
                            process: "Prozess",
                            roi: "ROI"
                        }
                    }
                },
                newsletter: {
                    title: "📧 Bleiben Sie auf dem Laufenden mit KI-Trends",
                    description: "Erhalten Sie die neuesten Artikel, Fallstudien und exklusive Tipps direkt in Ihren Posteingang",
                    placeholder: "Ihre E-Mail",
                    subscribe: "Abonnieren",
                    privacy: "🔒 Wir spammen nicht. Sie können sich jederzeit abmelden."
                },
                sections: {
                    services: { 
                        title: "Unsere Dienstleistungen",
                        subtitle: "Umfassende KI- und Automatisierungslösungen, die Ihr Unternehmen transformieren und die Effizienz steigern"
                    },
                    about: { title: "Über ECM Digital" },
                    blog: {
                        title: "Blog & Insights",
                        subtitle: "Neueste KI-Trends, Fallstudien und praktische Tipps für Ihr Unternehmen"
                    },
                    team: { 
                        title: "Unser Team", 
                        subtitle: "Lernen Sie die Experten kennen, die Ihre Projekte erstellen",
                        members: {
                            tomasz: {
                                name: "Tomasz Gnat",
                                position: "Discovery Consultant",
                                description: "Experte für die Entdeckung von Geschäftsanforderungen und digitale Strategie",
                                skills: {
                                    businessAnalysis: "Geschäftsanalyse",
                                    aiStrategy: "KI-Strategie"
                                }
                            },
                            marta: {
                                name: "Marta Górska",
                                position: "UX/UI Designer",
                                description: "Spezialistin für Benutzererfahrungsdesign",
                                skills: {
                                    uxResearch: "UX-Forschung",
                                    aiUxDesign: "KI/UX-Design"
                                }
                            },
                            karol: {
                                name: "Karol Czechowski",
                                position: "QA-Spezialist & Entwickler",
                                description: "Spezialist für Qualitätssicherung und Anwendungstests",
                                skills: {
                                    aiTesting: "KI-Tests",
                                    qualityAssurance: "Qualitätssicherung"
                                }
                            },
                            roman: {
                                name: "Roman Domina",
                                position: "Social Media & Automatisierungsspezialist",
                                description: "Experte für Social Media und Geschäftsprozessautomatisierung",
                                skills: {
                                    processAutomation: "Prozessautomatisierung",
                                    aiAnalytics: "KI-Analytik"
                                }
                            }
                        }
                    },
                    process: { 
                        title: "Unser Arbeitsprozess",
                        steps: {
                            discovery: { title: "Beratung", description: "Analyse der Projektanforderungen und Bedürfnisse" },
                            design: { title: "Planung", description: "Strategie und Lösungsarchitektur" },
                            development: { title: "Umsetzung", description: "Entwicklung und Tests" },
                            launch: { title: "Bereitstellung", description: "Start und Support" }
                        }
                    },
                    contact: { 
                        title: "Starten Sie Ihr Projekt",
                        description: "Kontaktieren Sie uns, um Ihr Projekt zu besprechen. Wir bieten kostenlose Beratung und Angebote.",
                        contactUs: "Kontaktieren Sie uns",
                        sendMessage: "E-Mail schreiben",
                        phone: "Anrufen"
                    }
                },
                company: {
                    name: "ECM Digital",
                    description1: "ECM Digital bietet umfassende und moderne digitale Lösungen an.",
                    description2: "Wir garantieren volle Transparenz und Sicherheit der Zusammenarbeit.",
                    badge: "Registrierte Gesellschaft<br>Sp. z o.o.",
                    stats: {
                        aiProjects: "50+",
                        aiProjectsLabel: "KI-Projekte",
                        clientSatisfaction: "95%",
                        clientSatisfactionLabel: "Kundenzufriedenheit",
                        technicalSupport: "24/7",
                        technicalSupportLabel: "Technischer Support",
                        yearFounded: "2019",
                        yearFoundedLabel: "Gründungsjahr"
                    }
                },
                footer: { copyright: "© 2025 ECM Digital. Alle Rechte vorbehalten." }
            }
        };
    }

    // Ustawienie języka
    setLanguage(lang) {
        if (!this.translations[lang]) {
            console.warn(`Language ${lang} not supported, falling back to pl`);
            lang = 'pl';
        }

        this.currentLanguage = lang;
        localStorage.setItem('preferredLanguage', lang);
        
        // Aktualizacja HTML
        document.documentElement.lang = lang;
        
        // Aktualizacja wszystkich elementów z data-i18n tylko jeśli nie jest to inicjalizacja
        if (this.initialized) {
            this.updatePageContent();
        }
        
        console.log(`Language changed to: ${lang}`);
    }

    // Pobranie zapisanego języka
    getStoredLanguage() {
        return localStorage.getItem('preferredLanguage');
    }

    // Pobranie tłumaczenia
    t(key) {
        if (!this.initialized) {
            return key;
        }

        const keys = key.split('.');
        let value = this.translations[this.currentLanguage];

        for (const k of keys) {
            if (value && value[k]) {
                value = value[k];
            } else {
                console.warn(`Translation key not found: ${key}`);
                return key;
            }
        }

        return value;
    }

    // Aktualizacja zawartości strony
    updatePageContent() {
        const elements = document.querySelectorAll('[data-i18n]');
        console.log(`🔄 Updating ${elements.length} elements with translations`);
        console.log(`🌐 Current language: ${this.currentLanguage}`);
        console.log(`📊 Available translations:`, Object.keys(this.translations));
        
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            
            if (translation) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translation;
                } else {
                    // If translation contains HTML (e.g., spans for colored text), set innerHTML
                    if (typeof translation === 'string' && translation.includes('<')) {
                        element.innerHTML = translation;
                } else {
                    element.textContent = translation;
                    }
                }
                console.log(`✅ Updated ${key}: ${translation}`);
            } else {
                console.warn(`⚠️ No translation found for key: ${key}`);
            }
        });
        
        // Force re-render on mobile
        if (window.innerWidth <= 768) {
            document.body.style.display = 'none';
            document.body.offsetHeight; // Trigger reflow
            document.body.style.display = '';
        }
    }
}

// Inicjalizacja systemu wielojęzycznego
const i18n = new I18nManager();

// Eksport dla modułów
if (typeof module !== 'undefined' && module.exports) {
    module.exports = I18nManager;
} else {
    window.I18nManager = I18nManager;
    window.i18n = i18n;
}

// Automatyczna inicjalizacja została usunięta - inicjalizacja jest ręczna w HTML
