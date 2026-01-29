import Link from 'next/link';
import { Star, MapPin, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { formatDistance, isOpenNow } from '@/lib/utils';
import type { Business } from '@/lib/api';

interface BusinessCardProps {
    business: Business;
}

export default function BusinessCard({ business }: BusinessCardProps) {
    const isOpen = isOpenNow(business.hours);
    const activePromo = business.promotions?.find(p => p.active);

    return (
        <Link href={`/${business.slug}`} className="group block h-full">
            <Card className="overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col rounded-2xl bg-white group-hover:-translate-y-1">
                {/* Cover Image */}
                <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                    {business.images?.cover ? (
                        <img
                            src={business.images.cover}
                            alt={business.name}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                            <span className="text-4xl">🍽️</span>
                        </div>
                    )}

                    {/* Promo Badge Floating */}
                    {activePromo && (
                        <div className="absolute top-3 right-3 z-10 animate-in fade-in zoom-in duration-300">
                            <Badge className="bg-green-500 hover:bg-green-600 text-white border-0 shadow-lg px-3 py-1.5 text-xs font-bold rounded-full flex items-center gap-1">
                                🔥 {activePromo.title}
                            </Badge>
                        </div>
                    )}

                    {/* Status Badge */}
                    {!isOpen && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[1px]">
                            <Badge className="bg-black/70 text-white border-0 px-4 py-2 text-sm font-medium">
                                Cerrado
                            </Badge>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-primary-600 transition-colors line-clamp-1">
                            {business.name}
                        </h3>
                        <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-full shrink-0 border border-gray-100">
                            <span className="text-sm font-bold text-gray-900">{business.rating || 'New'}</span>
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs text-gray-400">({business.reviewCount || 0})</span>
                        </div>
                    </div>

                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{business.description}</p>

                    <div className="mt-auto flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-3">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5 text-gray-400" />
                                <span>15-25 min</span>
                            </div>
                            {business.distance !== undefined && (
                                <div className="flex items-center gap-1">
                                    <MapPin className="h-3.5 w-3.5 text-gray-400" />
                                    <span>{formatDistance(business.distance)}</span>
                                </div>
                            )}
                        </div>

                        <div className="font-medium text-accent-700 bg-accent-50 px-2.5 py-1 rounded-md text-xs border border-accent-100">
                            {business.subscription?.plan === 'premium' ? '$$$' : '$$'}
                        </div>
                    </div>
                </div>
            </Card>
        </Link>
    );
}
