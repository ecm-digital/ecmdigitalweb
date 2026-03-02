
import { pl } from './translations/pl';
import { en } from './translations/en';
import { de } from './translations/de';
import { szl } from './translations/szl';
import { es } from './translations/es';
import { ar } from './translations/ar';

export type Lang = 'pl' | 'en' | 'de' | 'szl' | 'es' | 'ar';

const translations: Record<Lang, Record<string, string>> = {
    pl,
    en,
    de,
    szl,
    es,
    ar,
};

export function t(lang: Lang, key: string, params?: Record<string, any>): string {
    let str = translations[lang]?.[key] || translations.pl?.[key] || key;
    if (params) {
        Object.entries(params).forEach(([k, v]) => {
            str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
        });
    }
    return str;
}

export default translations;
