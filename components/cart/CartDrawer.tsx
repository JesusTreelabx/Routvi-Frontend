'use client';

import { useCart } from '@/lib/cart-context';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';
import { X, Minus, Plus, MessageCircle } from 'lucide-react';
import { generateWhatsAppPreview } from '@/lib/api';

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    const { cart, updateQuantity, totalPrice, businessId, totalItems } = useCart();

    const handleWhatsAppOrder = async () => {
        if (!businessId) return;

        // Construct message
        const itemsList = cart.map(item =>
            `• ${item.quantity}x ${item.product.name} - ${formatPrice(item.product.price * item.quantity)}`
        ).join('\n');

        const total = `*Total: ${formatPrice(totalPrice)}*`;

        const message = `hola! 👋 Quiero hacer un pedido:\n\n${itemsList}\n\n${total}`;

        // Ideally call API to get phone number, but for now open direct link
        // Assuming backend returns phone or we have it. 
        // In real implementation, GET /v1/whatsapp/preview would verify business phone

        try {
            // Direct approach for MVP speed
            const encodedMessage = encodeURIComponent(message);
            // We need business phone here. It should be in context or fetched.
            // For now, let's assume a placeholder or fetch it.
            // Better: open preview in new window

            const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
            window.open(whatsappUrl, '_blank');
        } catch (err) {
            console.error(err);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                <div className="p-4 border-b flex items-center justify-between bg-primary-50">
                    <h2 className="text-lg font-bold text-gray-900">Tu Pedido</h2>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-6 w-6 text-gray-500" />
                    </Button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {cart.map((item) => (
                        <div key={item.product.id} className="flex gap-3 py-2 border-b border-gray-100 last:border-0">
                            <div className="flex-1">
                                <h4 className="font-medium text-gray-900 line-clamp-1">{item.product.name}</h4>
                                <p className="text-sm text-primary-600 font-bold">{formatPrice(item.product.price)}</p>
                            </div>

                            <div className="flex items-center gap-3 bg-gray-50 rounded-lg h-9 px-2">
                                <button
                                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                    className="p-1 hover:text-primary-600"
                                >
                                    <Minus className="h-4 w-4" />
                                </button>
                                <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                                <button
                                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                    className="p-1 hover:text-primary-600"
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t bg-gray-50 space-y-4">
                    <div className="flex justify-between items-center text-lg font-bold text-gray-900">
                        <span>Total</span>
                        <span>{formatPrice(totalPrice)}</span>
                    </div>

                    <Button
                        className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-lg font-bold shadow-md flex items-center justify-center gap-2"
                        onClick={handleWhatsAppOrder}
                    >
                        <MessageCircle className="h-5 w-5" />
                        Pedir por WhatsApp
                    </Button>
                </div>
            </div>
        </div>
    );
}
