import { knowledgeItems } from '../wiedzaData';
import ClientKnowledgeBasePost from './ClientKnowledgeBasePost';

interface Props {
    params: {
        slug: string;
    };
}

export function generateStaticParams() {
    return knowledgeItems.map((item) => ({
        slug: item.slug,
    }));
}

export default function KnowledgeBasePost({ params }: Props) {
    return <ClientKnowledgeBasePost slug={params.slug} />;
}
