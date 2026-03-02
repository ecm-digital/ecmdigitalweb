// Server component wrapper - handles generateStaticParams
import DynamicCaseStudyPage from './DynamicCaseStudyClient';

// This page generates a shell HTML for the Firebase rewrite.
// The '_dynamic' slug is served for any unknown /cases/* URL.
// The client component reads the real slug from window.location.pathname.
export function generateStaticParams() {
    return [
        { slug: '_dynamic' },
    ];
}

export default function Page() {
    return <DynamicCaseStudyPage />;
}
