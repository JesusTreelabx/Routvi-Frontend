'use client';

import { useCart } from '@/lib/cart-context';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { formatPrice } from '@/lib/utils';
import { Plus } from 'lucide-react';
import type { MenuCategory, MenuItem } from '@/lib/api';

interface MenuSectionProps {
    categories: MenuCategory[];
    businessId: string;
}

export default function MenuSection({ categories, businessId }: MenuSectionProps) {
    const { addToCart } = useCart();

    if (!categories || categories.length === 0) {
        return (
            <div className="p-8 text-center text-gray-500">
                <p>Menú no disponible por el momento</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 pb-32">
            <h2 className="text-xl font-bold text-gray-900 mb-6 sticky top-16 bg-white z-10 py-2 border-b">
                Menú
            </h2>

            <div className="space-y-8">
                {categories.map((category) => (
                    <div key={category.id} id={`cat-${category.id}`} className="scroll-mt-24">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            {category.name}
                            <Badge variant="secondary" className="text-xs font-normal">
                                {category.products.length}
                            </Badge>
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {category.products.map((product) => (
                                <Card key={product.id} className="p-3 flex gap-4 border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                    {/* Image */}
                                    <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 relative overflow-hidden">
                                        {product.image ? (
                                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-2xl">🍽️</div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex flex-col flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-gray-900 line-clamp-1">{product.name}</h4>
                                            <span className="font-bold text-primary-600">{formatPrice(product.price)}</span>
                                        </div>

                                        <p className="text-sm text-gray-500 line-clamp-2 mb-2 flex-1">
                                            {product.description}
                                        </p>

                                        <div className="flex justify-end mt-auto">
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                className="rounded-full h-8 px-3 text-xs bg-primary-50 text-primary-700 hover:bg-primary-100"
                                                onClick={() => addToCart(product, businessId)}
                                                disabled={!product.available}
                                            >
                                                {product.available ? (
                                                    <>
                                                        <Plus className="w-3 h-3 mr-1" />
                                                        Agregar
                                                    </>
                                                ) : 'Agotado'}
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
