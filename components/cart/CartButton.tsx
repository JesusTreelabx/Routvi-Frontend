'use client';

import { useCart } from '@/lib/cart-context';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';
import { useState } from 'react';
import CartDrawer from './CartDrawer';

export default function CartFloatingButton() {
    const { totalItems, totalPrice } = useCart();
    const [isOpen, setIsOpen] = useState(false);

    if (totalItems === 0) return null;

    return (
        <>
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
                <Button
                    onClick={() => setIsOpen(true)}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white shadow-lg rounded-full py-4 h-14 flex items-center justify-between px-6 animate-in slide-in-from-bottom-10 fade-in duration-300"
                >
                    <div className="flex items-center gap-2">
                        <div className="bg-primary-800 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                            {totalItems}
                        </div>
                        <span className="font-bold">Ver pedido</span>
                    </div>

                    <span className="font-bold">{formatPrice(totalPrice)}</span>
                </Button>
            </div>

            <CartDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
}
