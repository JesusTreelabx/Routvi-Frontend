'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import HeroSection from '@/components/home/HeroSection';
import CategoryPills from '@/components/home/CategoryPills';
import QuickFilters from '@/components/home/QuickFilters';
import BusinessCard from '@/components/home/BusinessCard';
import VibeSection from '@/components/home/VibeSection';
import { getHomeFeed, type Business } from '@/lib/api';
import { MapPin, Sparkles, Zap, Tag, X, Store } from 'lucide-react';
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
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [activePromos, setActivePromos] = useState<any[]>([]);
  const [businessName, setBusinessName] = useState("");

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

    // Load active promotions count
    const loadPromosCount = async () => {
      try {
        const res = await fetch('https://bucjudzbm9.us-east-1.awsapprunner.com/api/v1/business/promotions');
        const data = await res.json();

        let promos = [];
        if (Array.isArray(data)) {
          promos = data;
        } else if (data.data && Array.isArray(data.data)) {
          promos = data.data;
        }

        setActivePromos(promos.filter((p: any) => p.active));
      } catch (error) {
        console.error('Error loading promotions count:', error);
      }
    };
    loadPromosCount();
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

      {/* Floating Savings Counter */}
      <button
        onClick={() => {
          const fetchPromos = async () => {
            try {
              // Fetch Promos
              const res = await fetch('https://bucjudzbm9.us-east-1.awsapprunner.com/api/v1/business/promotions');
              const data = await res.json();

              // Handle both direct array and {data: array} response
              let promos = [];
              if (Array.isArray(data)) {
                promos = data;
              } else if (data.data && Array.isArray(data.data)) {
                promos = data.data;
              }

              // Filter only active promotions
              setActivePromos(promos.filter((p: any) => p.active));

              // Fetch Business Name
              const profileRes = await fetch('https://bucjudzbm9.us-east-1.awsapprunner.com/api/v1/business/profile');
              const profileData = await profileRes.json();
              setBusinessName(profileData.name || "Tu Negocio");

            } catch (e) {
              console.error(e);
            }
            setShowPromoModal(true);
          };
          fetchPromos();
        }}
        className="fixed bottom-24 right-4 z-40 animate-bounce cursor-pointer hover:scale-105 transition-transform"
      >
        <div className="bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
          💸 {activePromos.length} promos activas
        </div>
      </button>

      {/* Active Promos Modal */}
      {
        showPromoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95">
              <div className="bg-orange-500 p-6 text-white flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    <Tag className="w-6 h-6" />
                    Promos Activas
                  </h3>
                  <p className="text-orange-100 font-medium capitalize mt-1">
                    {new Date().toLocaleDateString('es-ES', { weekday: 'long' })}
                  </p>
                </div>
                <button
                  onClick={() => setShowPromoModal(false)}
                  className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
                {activePromos.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No tienes promociones activas hoy.
                  </div>
                ) : (
                  activePromos.map((promo: any) => (
                    <div key={promo.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm relative overflow-hidden group hover:border-orange-200 transition-colors">
                      <div className="absolute top-0 left-0 w-1 h-full bg-orange-500" />

                      {/* Business Name */}
                      <div className="flex items-center gap-1.5 mb-2 text-gray-500">
                        <Store className="w-3 h-3" />
                        <span className="text-xs font-bold uppercase tracking-wider">{businessName}</span>
                      </div>

                      <div className="flex justify-between items-start mb-2">
                        <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                          {promo.code}
                        </span>
                        <span className="text-emerald-600 font-bold text-sm">
                          {promo.discount} OFF
                        </span>
                      </div>
                      <h4 className="font-bold text-gray-900 mb-1">{promo.title}</h4>
                      <p className="text-sm text-gray-500 line-clamp-2">{promo.description}</p>
                      <div className="mt-3 text-xs text-gray-400 flex items-center justify-end gap-1">
                        Expira: {new Date(promo.expiryDate).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
                <Button onClick={() => setShowPromoModal(false)} className="w-full bg-gray-900 text-white rounded-xl">
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        )
      }

    </div>
  );
}
