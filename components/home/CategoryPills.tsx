import { cn } from '@/lib/utils';

const CATEGORIES = [
    { id: 'all', label: 'Todo', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=200&auto=format&fit=crop' },
    { id: 'pizzeria', label: 'Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=200&auto=format&fit=crop' },
    { id: 'sushi', label: 'Sushi', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=200&auto=format&fit=crop' },
    { id: 'tacos', label: 'Tacos', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=200&auto=format&fit=crop' },
    { id: 'burgers', label: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=200&auto=format&fit=crop' },
    { id: 'cafe', label: 'Café', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=200&auto=format&fit=crop' },
    { id: 'drinks', label: 'Bebidas', image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=200&auto=format&fit=crop' },
    { id: 'postres', label: 'Postres', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=200&auto=format&fit=crop' },
];

interface CategoryPillsProps {
    selected: string;
    onSelect: (id: string) => void;
}

export default function CategoryPills({ selected, onSelect }: CategoryPillsProps) {
    return (
        <div className="flex gap-4 overflow-x-auto pb-6 pt-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 justify-start md:justify-center">
            {CATEGORIES.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => onSelect(cat.id)}
                    className="group flex flex-col items-center gap-2 flex-shrink-0"
                >
                    <div className={cn(
                        "w-16 h-16 rounded-full overflow-hidden border-2 transition-all duration-300 shadow-md bg-gray-100",
                        selected === cat.id
                            ? "border-primary-500 ring-2 ring-primary-200 ring-offset-2 scale-110"
                            : "border-white group-hover:scale-105 group-hover:border-primary-200"
                    )}>
                        <img
                            src={cat.image}
                            alt={cat.label}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            loading="lazy"
                        />
                    </div>
                    <span className={cn(
                        "text-xs font-bold transition-colors",
                        selected === cat.id ? "text-primary-700" : "text-gray-600 group-hover:text-primary-600"
                    )}>
                        {cat.label}
                    </span>
                </button>
            ))}
        </div>
    );
}
