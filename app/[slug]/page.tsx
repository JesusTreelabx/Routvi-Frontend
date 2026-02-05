export const dynamic = 'force-static';

export function generateStaticParams() {
    return [{ slug: 'default' }];
}

import { notFound } from 'next/navigation';
import BusinessHeader from '@/components/business/BusinessHeader';
import PromotionsBanner from '@/components/business/PromotionsBanner';
import MenuSection from '@/components/business/MenuSection';
import { getBusinessBySlug, getBusinessMenu } from '@/lib/api';

// This is a server component by default
export default async function BusinessPage(props: { params: Promise<{ slug: string }> }) {
    try {
        const params = await props.params;
        const { slug } = params;

        // Fetch business data
        const businessData = await getBusinessBySlug(slug);
        const business = businessData.data || businessData;

        if (!business) {
            notFound();
        }

        // Check subscription status
        if (business.subscription?.status !== 'active') {
            return (
                <div className="min-h-screen flex items-center justify-center p-4 text-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Negocio no disponible</h1>
                        <p className="text-gray-500">Este negocio ya no se encuentra activo en Routvi.</p>
                    </div>
                </div>
            );
        }

        // Fetch menu data
        let menuCategories = [];
        try {
            const menuData = await getBusinessMenu(business.ID);
            menuCategories = menuData.data?.menu || menuData.menu || [];
        } catch (err) {
            console.error('Failed to load menu:', err);
        }

        return (
            <div className="min-h-screen bg-gray-50 pb-24">
                <BusinessHeader business={business} />

                {business.promotions && business.promotions.length > 0 && (
                    <PromotionsBanner promotions={business.promotions} />
                )}

                <div className="bg-white rounded-t-3xl shadow-sm -mt-4 relative z-10 pt-6 min-h-[500px]">
                    <MenuSection
                        categories={menuCategories}
                        businessId={business.ID}
                    />
                </div>
            </div>
        );
    } catch (error) {
        console.error('Error loading business page:', error);
        notFound();
    }
}
