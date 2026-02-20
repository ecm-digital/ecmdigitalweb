const fs = require('fs');
const content = fs.readFileSync('src/translations.ts', 'utf8');

const reps = [
    {
        find: `"services.auto.title": "Automatyzacja N8N",
        "services.auto.desc": "Oszczędzaj 15–20h tygodniowo. Integracje systemów, workflow automation i eliminacja powtarzalnych zadań.",
        "services.auto.tag1": "N8N",
        "services.auto.tag2": "Workflow",`,
        rep: `"services.auto.title": "Softwaryzacja & Automatyzacja",
        "services.auto.desc": "Model 80/20. Dedykowane aplikacje połączone z automatyzacją AI (n8n, Python).",
        "services.auto.tag1": "Custom Software",
        "services.auto.tag2": "N8N",
        "services.executive.title": "AI Executive",
        "services.executive.desc": "Prywatna instancja AI dla zarządu. Pełny kontekst firmy i wsparcie decyzyjne z zaawansowanym szyfrowaniem.",
        "services.executive.tag1": "Private LLM",
        "services.executive.tag2": "Security",
        "services.edu.title": "Edukacja & Wdrożenia AI",
        "services.edu.desc": "Szkolimy Twój zespół, liderów i zarząd z użycia technologii AI w biznesie.",
        "services.edu.tag1": "Warsztaty",
        "services.edu.tag2": "Konsulting",`
    },
    {
        find: `"services.auto.title": "N8N Automation",
        "services.auto.desc": "Save 15–20 hours weekly. System integrations, workflow automation and elimination of repetitive tasks.",
        "services.auto.tag1": "N8N",
        "services.auto.tag2": "Workflow",`,
        rep: `"services.auto.title": "Software & Automation",
        "services.auto.desc": "80/20 Model. Custom software combined with AI automation (n8n, Python).",
        "services.auto.tag1": "Custom Software",
        "services.auto.tag2": "N8N",
        "services.executive.title": "AI Executive",
        "services.executive.desc": "Your private AI instance. Full company context and decision support with advanced encryption.",
        "services.executive.tag1": "Private LLM",
        "services.executive.tag2": "Security",
        "services.edu.title": "Education & Implementation",
        "services.edu.desc": "We train your team, leaders, and executives on using AI technologies in business.",
        "services.edu.tag1": "Workshops",
        "services.edu.tag2": "Consulting",`
    },
    {
        find: `"services.auto.title": "N8N Automatisierung",
        "services.auto.desc": "Sparen Sie 15–20 Stunden wöchentlich. Systemintegrationen, Workflow-Automatisierung und Eliminierung repetitiver Aufgaben.",
        "services.auto.tag1": "N8N",
        "services.auto.tag2": "Workflow",`,
        rep: `"services.auto.title": "Software & Automatisierung",
        "services.auto.desc": "80/20-Modell. Maßgeschneiderte Software in Kombination mit KI-Automatisierung (n8n, Python).",
        "services.auto.tag1": "Custom Software",
        "services.auto.tag2": "N8N",
        "services.executive.title": "AI Executive",
        "services.executive.desc": "Ihre private KI-Instanz. Voller Unternehmenskontext und Entscheidungsunterstützung mit erweiterter Verschlüsselung.",
        "services.executive.tag1": "Private LLM",
        "services.executive.tag2": "Sicherheit",
        "services.edu.title": "Bildung & Implementierung",
        "services.edu.desc": "Wir schulen Ihr Team, Führungskräfte und Manager in der Nutzung von KI-Technologien in Unternehmen.",
        "services.edu.tag1": "Workshops",
        "services.edu.tag2": "Beratung",`
    },
    {
        find: `"services.auto.title": "Automatyzacja N8N",
        "services.auto.desc": "Oszczędzej czas. Łączymy systemy, żebyś nie musioł robić tego samego w kółko.",
        "services.auto.tag1": "N8N",
        "services.auto.tag2": "Robota",`,
        rep: `"services.auto.title": "Softwaryzacja & Automatyzacja",
        "services.auto.desc": "Model 80/20. Customowe programy połączone ze sztuczną inteligencją w N8N.",
        "services.auto.tag1": "Custom Apps",
        "services.auto.tag2": "N8N",
        "services.executive.title": "AI Executive",
        "services.executive.desc": "Inteligentny asystent ino dla Zarządu. Pełny wgląd we wszystkie firmy sprawy i super szyfrowanie.",
        "services.executive.tag1": "Prywatne LLM",
        "services.executive.tag2": "Bezpieczeństwo",
        "services.edu.title": "Edukacja & Wdrożenia AI",
        "services.edu.desc": "Godomy z Waszym sztabem jak gładko wejść w świat AI i nie robić se za dużo pod górkę.",
        "services.edu.tag1": "Warsztaty",
        "services.edu.tag2": "Szkolynio",`
    },
    {
        find: `"services.auto.title": "Automatización N8N",
        "services.auto.desc": "Ahorre 15–20 horas semanales. Integraciones de sistemas, automatización de flujos de trabajo y eliminación de tareas repetitivas.",
        "services.auto.tag1": "N8N",
        "services.auto.tag2": "Flujo de trabajo",`,
        rep: `"services.auto.title": "Software y Automatización",
        "services.auto.desc": "Modelo 80/20. Software a medida combinado con automatización de IA (n8n, Python).",
        "services.auto.tag1": "Software a Medida",
        "services.auto.tag2": "N8N",
        "services.executive.title": "AI Executive",
        "services.executive.desc": "Tu asesor digital privado. Instancia privada de IA con contexto completo de empresa y soporte a decisiones.",
        "services.executive.tag1": "Private LLM",
        "services.executive.tag2": "Seguridad",
        "services.edu.title": "Educación e Implementación",
        "services.edu.desc": "Formamos a tu equipo, líderes y ejecutivos sobre el uso de tecnologías de IA en los negocios.",
        "services.edu.tag1": "Talleres",
        "services.edu.tag2": "Consultoría",`
    },
    {
        find: `"services.auto.title": "أتمتة N8N",
        "services.auto.desc": "وفر 15–20 ساعة أسبوعيًا. تكامل الأنظمة، وأتمتة سير العمل والتخلص من المهام المتكررة.",
        "services.auto.tag1": "N8N",
        "services.auto.tag2": "سير العمل",`,
        rep: `"services.auto.title": "البرمجيات والأتمتة",
        "services.auto.desc": "نموذج 80/20. برمجيات مخصصة مقترنة بأتمتة الذكاء الاصطناعي (n8n, Python).",
        "services.auto.tag1": "برمجيات مخصصة",
        "services.auto.tag2": "N8N",
        "services.executive.title": "AI Executive",
        "services.executive.desc": "مستشارك الرقمي الخاص. نسخة ذكاء اصطناعي خاصة بالشركات لدعم القرارات والتشفير المتقدم.",
        "services.executive.tag1": "الذكاء الاصطناعي الخاص",
        "services.executive.tag2": "الأمن الرقمي",
        "services.edu.title": "التعليم والتنفيذ للذكاء الاصطناعي",
        "services.edu.desc": "نوفر تدريباً لفريقك، والقادة والإدارة حول كيفية استخدام الذكاء الاصطناعي في الأعمال.",
        "services.edu.tag1": "ورش عمل",
        "services.edu.tag2": "استشارات",`
    }
];

let res = content;
let replaced = 0;
reps.forEach(r => {
    if (res.includes(r.find)) {
        res = res.replace(r.find, r.rep);
        replaced++;
    } else {
        console.error("Not found:", r.find.substring(0, 30));
    }
});
fs.writeFileSync('src/translations.ts', res);
console.log('Done, replaced', replaced);
