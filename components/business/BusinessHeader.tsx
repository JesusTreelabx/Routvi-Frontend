import Link from 'next/link';
import { ArrowLeft, Star, MapPin, Clock, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { isOpenNow, getTodayHours } from '@/lib/utils';
import type { Business } from '@/lib/api';

interface BusinessHeaderProps {
    business: Business;
}

export default function BusinessHeader({ business }: BusinessHeaderProps) {
    const isOpen = isOpenNow(business.hours);
    const todayHours = getTodayHours(business.hours);

    return (
        <div className="relative bg-white pb-4 shadow-sm border-b">
            {/* Cover Image */}
            <div className="h-48 sm:h-64 bg-gray-200 relative">
                <Link href="/" className="absolute top-4 left-4 z-10">
                    <Button variant="secondary" size="icon" className="rounded-full bg-white/90 shadow-md h-10 w-10">
                        <ArrowLeft className="h-5 w-5 text-gray-700" />
                    </Button>
                </Link>
                <div className="absolute top-4 right-4 z-10 flex gap-2">
                    <Button variant="secondary" size="icon" className="rounded-full bg-white/90 shadow-md h-10 w-10">
                        <Share2 className="h-5 w-5 text-gray-700" />
                    </Button>
                </div>

                {business.images?.cover && (
                    <img
                        src={business.images.cover}
                        alt="Cover"
                        className="w-full h-full object-cover"
                    />
                )}
            </div>

            <div className="container mx-auto px-4 -mt-10 relative z-20">
                {/* Logo & Name */}
                <div className="flex flex-col items-center sm:items-start sm:flex-row gap-4 mb-4">
                    <div className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-white overflow-hidden">
                        {business.images?.logo ? (
                            <img src={business.images.logo} alt="Logo" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-primary-100 flex items-center justify-center text-2xl">🏪</div>
                        )}
                    </div>

                    <div className="text-center sm:text-left pt-2 flex-1">
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">{business.name}</h1>
                        <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-gray-600 mb-2">
                            <span className="capitalize px-2 py-0.5 bg-gray-100 rounded-md">{business.type}</span>
                            <div className="flex items-center gap-1 text-yellow-600 font-medium">
                                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                                {business.rating} ({business.reviewCount})
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-2 gap-3 mb-2">
                    <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-3">
                        <div className="bg-white p-2 rounded-full shadow-sm text-green-600">
                            <Clock className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className={isOpen ? "text-green-600 font-bold text-sm" : "text-red-500 font-bold text-sm"}>
                                {isOpen ? 'Abierto' : 'Cerrado'}
                            </span>
                            <span className="text-xs text-gray-500">{todayHours}</span>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-3">
                        <div className="bg-white p-2 rounded-full shadow-sm text-blue-500">
                            <MapPin className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-medium text-gray-900 truncate">Ver mapa</span>
                            <span className="text-xs text-gray-500 truncate">{business.location.address}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
