'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { MenuItem, CartItem } from '@/lib/api';

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: MenuItem, businessId: string) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
    businessId: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [businessId, setBusinessId] = useState<string | null>(null);

    // Load from local storage
    useEffect(() => {
        const savedCart = localStorage.getItem('routvi-cart');
        const savedBusinessId = localStorage.getItem('routvi-cart-business');
        if (savedCart) setCart(JSON.parse(savedCart));
        if (savedBusinessId) setBusinessId(savedBusinessId);
    }, []);

    // Save to local storage
    useEffect(() => {
        localStorage.setItem('routvi-cart', JSON.stringify(cart));
        if (businessId) localStorage.setItem('routvi-cart-business', businessId);
        else localStorage.removeItem('routvi-cart-business');
    }, [cart, businessId]);

    const addToCart = (product: MenuItem, newBusinessId: string) => {
        // Check if adding from a different business
        if (businessId && businessId !== newBusinessId) {
            if (confirm('¿Deseas vaciar el carrito actual para pedir de este nuevo negocio?')) {
                setCart([]);
                setBusinessId(newBusinessId);
            } else {
                return;
            }
        } else if (!businessId) {
            setBusinessId(newBusinessId);
        }

        setCart(prev => {
            const existing = prev.find(item => item.product.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { product, quantity: 1, businessId: newBusinessId }];
        });
    };

    const removeFromCart = (productId: string) => {
        setCart(prev => {
            const newCart = prev.filter(item => item.product.id !== productId);
            if (newCart.length === 0) setBusinessId(null);
            return newCart;
        });
    };

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setCart(prev => prev.map(item =>
            item.product.id === productId ? { ...item, quantity } : item
        ));
    };

    const clearCart = () => {
        setCart([]);
        setBusinessId(null);
    };

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            totalItems,
            totalPrice,
            businessId
        }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
