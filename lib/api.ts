/**
 * Routvi API Client
 * Handles all communication with the backend API
 */

import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const api = axios.create({
    baseURL: `${API_BASE_URL}/v1`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Types
export interface Business {
    ID: string;
    name: string;
    slug: string;
    type: string;
    location: {
        lat: number;
        lng: number;
        address: string;
    };
    phone?: string;
    email?: string;
    description?: string;
    subscription: {
        status: 'active' | 'inactive';
        plan: string;
        startDate?: string;
        endDate?: string;
    };
    hours: {
        [key: string]: {
            open: number;
            close: number;
        };
    };
    occasions?: string[];
    promotions?: Promotion[];
    images?: {
        logo?: string;
        cover?: string;
    };
    rating?: number;
    reviewCount?: number;
    distance?: number;
}

export interface Promotion {
    active: boolean;
    title: string;
    description?: string;
    startDate?: string;
    endDate?: string;
}

export interface MenuItem {
    id: string;
    name: string;
    description?: string;
    price: number;
    image?: string;
    available: boolean;
    order_index: number;
}

export interface MenuCategory {
    id: string;
    name: string;
    order_index: number;
    products: MenuItem[];
}

export interface CartItem {
    product: MenuItem;
    quantity: number;
    businessId: string;
}

// API Functions

/**
 * Get home feed with nearby businesses
 */
export const getHomeFeed = async (lat: number, lng: number, radiusKm: number = 3) => {
    const { data } = await api.get('/home-feed', {
        params: { lat, lng, radiusKm },
    });
    return data;
};

/**
 * Search businesses with filters
 */
export const searchBusinesses = async (params: {
    lat?: number;
    lng?: number;
    radiusKm?: number;
    openNow?: boolean;
    promoNow?: boolean;
    type?: string;
    occasion?: string;
}) => {
    const { data } = await api.get('/businesses', { params });
    return data;
};

/**
 * Get business by slug
 */
export const getBusinessBySlug = async (slug: string) => {
    const { data } = await api.get(`/businesses/${slug}`);
    return data;
};

/**
 * Get business menu
 */
export const getBusinessMenu = async (businessId: string) => {
    const { data } = await api.get(`/businesses/${businessId}/menu`);
    return data;
};

/**
 * Generate WhatsApp preview
 */
export const generateWhatsAppPreview = async (
    businessId: string,
    message: string,
    cart?: CartItem[]
) => {
    const { data } = await api.post('/whatsapp/preview', {
        businessId,
        message,
        cart,
    });
    return data;
};

/**
 * Submit a suggestion
 */
export const submitSuggestion = async (suggestion: {
    type: string;
    content: string;
    location?: { lat: number; lng: number };
}) => {
    const { data } = await api.post('/suggestions', suggestion);
    return data;
};

/**
 * Submit a correction (requires auth)
 */
export const submitCorrection = async (
    correction: {
        businessId: string;
        field: string;
        currentValue?: string;
        correctedValue: string;
    },
    token: string
) => {
    const { data } = await api.post('/corrections', correction, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return data;
};

/**
 * Submit a review (requires auth)
 */
export const submitReview = async (
    review: {
        businessId: string;
        rating: number;
        comment?: string;
        visitDate?: string;
    },
    token: string
) => {
    const { data } = await api.post('/reviews', review, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return data;
};
