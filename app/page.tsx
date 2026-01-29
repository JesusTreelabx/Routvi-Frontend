'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import HeroSection from '@/components/home/HeroSection';
import CategoryPills from '@/components/home/CategoryPills';
import QuickFilters from '@/components/home/QuickFilters';
import BusinessCard from '@/components/home/BusinessCard';
import VibeSection from '@/components/home/VibeSection';
import { getHomeFeed, type Business } from '@/lib/api';
import { MapPin, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function Home() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [filters, setFilters] = useState({
    openNow: false,
    promoNow: false,
  });
  const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);

  // Initial load
  useEffect(() => {
    // Get location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setLocation(loc);
          fetchData(loc.lat, loc.lng);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Fallback to default location (Monterrey)
          const defaultLoc = { lat: 25.6866, lng: -100.3161 };
          setLocation(defaultLoc);
          fetchData(defaultLoc.lat, defaultLoc.lng);
        }
      );
    } else {
      // Fallback
      const defaultLoc = { lat: 25.6866, lng: -100.3161 };
      setLocation(defaultLoc);
      fetchData(defaultLoc.lat, defaultLoc.lng);
    }
  }, []);

  const fetchData = async (lat: number, lng: number) => {
    try {
      setLoading(true);
      const data = await getHomeFeed(lat, lng);
      const list = Array.isArray(data) ? data : (data.feed || data.businesses || []);
      setBusinesses(list);
    } catch (error) {
      console.error('Failed to fetch home feed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter businesses
  const filteredBusinesses = businesses.filter(b => {
    if (category !== 'all' && b.type?.toLowerCase() !== category) return false;
    if (filters.openNow && !b.hours) return false; // Simple check example
    // Add real filter logic here matching backend logic
    return true;
  });

  const featuredBusinesses = businesses.filter(b => b.promotions?.some(p => p.active));

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />

      {/* Hero Section */}
      <HeroSection onSearch={(q) => console.log(q)} />

      <main className="container mx-auto px-4 -mt-6 relative z-10 space-y-8">

        {/* Categories (Sticky-ish feel) */}
        <div>
          <CategoryPills selected={category} onSelect={setCategory} />
        </div>

        {/* Quick Filters */}
        <QuickFilters filters={filters} onChange={setFilters} />

        {/* Vibes / Occasions */}
        <VibeSection />

        {/* Featured Slider (Horizontal) */}
        {featuredBusinesses.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Zap className="text-yellow-500 fill-yellow-500" />
                Promociones Flash
              </h2>
              <Button variant="ghost" size="sm" className="text-primary-600 font-bold">Ver todas</Button>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
              {loading ? (
                [1, 2, 3].map(i => (
                  <div key={i} className="flex-shrink-0 w-72 h-64 bg-gray-200 rounded-2xl animate-pulse" />
                ))
              ) : (
                featuredBusinesses.map(business => (
                  <div key={business.ID} className="flex-shrink-0 w-72 h-full">
                    <BusinessCard business={business} />
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Main Feed */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="text-primary-500" />
              {filters.promoNow ? '🔥 Promociones Activas' : 'Descubrimientos cerca'}
            </h2>
            <div className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
              {filteredBusinesses.length} resultados
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-72 bg-gray-200 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBusinesses.map((business) => (
                <BusinessCard key={business.ID} business={business} />
              ))}

              {filteredBusinesses.length === 0 && (
                <div className="col-span-full py-20 text-center">
                  <div className="inline-block p-6 rounded-full bg-gray-100 mb-4">
                    <span className="text-4xl grayscale">🌵</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">No encontramos resultados</h3>
                  <p className="text-gray-500">Intenta ajustar los filtros (¡o cruza a otro municipio!)</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Floating Savings Counter (Example) */}
      <div className="fixed bottom-24 right-4 z-40 animate-bounce">
        <div className="bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
          💸 15 promos activas
        </div>
      </div>
    </div>
  );
}
