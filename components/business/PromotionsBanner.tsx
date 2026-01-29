import { Badge } from '@/components/ui/Badge';
import type { Promotion } from '@/lib/api';

interface PromotionsBannerProps {
    promotions: Promotion[];
}

export default function PromotionsBanner({ promotions }: PromotionsBannerProps) {
    const activePromos = promotions.filter(p => p.active);

    if (activePromos.length === 0) return null;

    return (
        <div className="bg-gradient-to-r from-primary-50 to-white py-4 mb-2">
            <div className="container mx-auto px-4">
                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                    🔥 Promociones Activas
                </h3>

                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    {activePromos.map((promo, idx) => (
                        <div
                            key={idx}
                            className="flex-shrink-0 w-72 bg-white rounded-xl p-4 shadow-sm border border-primary-100 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 bg-primary-500 text-white text-xs px-2 py-1 rounded-bl-lg font-bold">
                                PROMO
                            </div>
                            <h4 className="font-bold text-primary-700 mb-1">{promo.title}</h4>
                            <p className="text-sm text-gray-600 line-clamp-2">{promo.description}</p>
                            {promo.endDate && (
                                <p className="text-xs text-gray-400 mt-2">Válido hasta: {promo.endDate}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
