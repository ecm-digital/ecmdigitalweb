import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bezpłatny Audyt Gotowości AI | ECM Digital',
  description: 'Sprawdź gotowość technologiczną swojej firmy na wdrożenie sztucznej inteligencji i otrzymaj spersonalizowany raport z rekomendacjami w 3 minuty.',
  openGraph: {
    title: 'Bezpłatny Audyt Gotowości AI | ECM Digital',
    description: 'Sprawdź gotowość technologiczną swojej firmy na wdrożenie sztucznej inteligencji i otrzymaj spersonalizowany raport z rekomendacjami w 3 minuty.',
    url: 'https://www.ecm-digital.com/tools/ai-readiness',
    type: 'website',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
