import Link from 'next/link';
import { ShoppingBag, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function Header() {
    return (
        <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="bg-primary-500 text-white p-2 rounded-lg shadow-sm hover:bg-primary-600 transition-colors">
                        <span className="font-bold text-2xl tracking-tight px-1 block leading-none pb-0.5">Routvi</span>
                    </div>
                </Link>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="text-gray-600">
                        <ShoppingBag className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-gray-600">
                        <User className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </header>
    );
}
