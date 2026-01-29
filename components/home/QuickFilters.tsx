import { cn } from '@/lib/utils';
import { Clock, Tag } from 'lucide-react';

interface QuickFiltersProps {
    filters: {
        openNow: boolean;
        promoNow: boolean;
    };
    onChange: (filters: { openNow: boolean; promoNow: boolean }) => void;
}

export default function QuickFilters({ filters, onChange }: QuickFiltersProps) {
    return (
        <div className="flex gap-3 mb-6">
            <button
                onClick={() => onChange({ ...filters, openNow: !filters.openNow })}
                className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors",
                    filters.openNow
                        ? "border-primary-500 bg-primary-50 text-primary-700"
                        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                )}
            >
                <Clock className="w-4 h-4" />
                Abierto ahora
            </button>

            <button
                onClick={() => onChange({ ...filters, promoNow: !filters.promoNow })}
                className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors",
                    filters.promoNow
                        ? "border-primary-500 bg-primary-50 text-primary-700"
                        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                )}
            >
                <Tag className="w-4 h-4" />
                Con Promociones
            </button>
        </div>
    );
}
