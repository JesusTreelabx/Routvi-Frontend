import { Search } from 'lucide-react';
import { Input } from '@/components/ui/Input';

interface SearchBarProps {
    onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
    return (
        <div className="relative w-full max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
                type="text"
                placeholder="¿Qué se te antoja hoy?"
                className="pl-10 h-12 rounded-full shadow-sm border-gray-100 focus:ring-primary-500 focus:border-primary-500"
                onChange={(e) => onSearch(e.target.value)}
            />
        </div>
    );
}
