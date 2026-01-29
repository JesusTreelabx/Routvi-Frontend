/**
 * Utility functions for Routvi frontend
 */

/**
 * Format price in Mexican Pesos
 */
export const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
    }).format(price);
};

/**
 * Format distance in kilometers
 */
export const formatDistance = (distance: number): string => {
    if (distance < 1) {
        return `${Math.round(distance * 1000)}m`;
    }
    return `${distance.toFixed(1)}km`;
};

/**
 * Format hours (HHMM format to readable time)
 */
export const formatTime = (time: number): string => {
    const hours = Math.floor(time / 100);
    const minutes = time % 100;
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

/**
 * Check if business is open now
 */
export const isOpenNow = (hours: { [key: string]: { open: number; close: number } }): boolean => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const currentTime = now.getHours() * 100 + now.getMinutes();

    const todayHours = hours[dayOfWeek.toString()];
    if (!todayHours) return false;

    return currentTime >= todayHours.open && currentTime <= todayHours.close;
};

/**
 * Get current day hours
 */
export const getTodayHours = (hours: { [key: string]: { open: number; close: number } }): string => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const todayHours = hours[dayOfWeek.toString()];

    if (!todayHours) return 'Cerrado';

    return `${formatTime(todayHours.open)} - ${formatTime(todayHours.close)}`;
};

/**
 * Check if promotion is active
 */
export const isPromotionActive = (promotion: {
    active: boolean;
    startDate?: string;
    endDate?: string;
}): boolean => {
    if (!promotion.active) return false;

    const now = new Date();
    if (promotion.startDate && new Date(promotion.startDate) > now) return false;
    if (promotion.endDate && new Date(promotion.endDate) < now) return false;

    return true;
};

/**
 * Truncate text with ellipsis
 */
export const truncate = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

/**
 * Class name helper (similar to clsx)
 */
export const cn = (...classes: (string | undefined | null | false)[]): string => {
    return classes.filter(Boolean).join(' ');
};
