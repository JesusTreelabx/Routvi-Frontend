export const dynamic = 'force-static';

export function generateStaticParams() {
    return [{ categoryId: 'default' }];
}

import CategoryDetailClient from './CategoryDetailClient';

export default async function CategoryProductsPage(props: { params: Promise<{ categoryId: string }> }) {
    const params = await props.params;
    return <CategoryDetailClient categoryId={params.categoryId} />;
}
