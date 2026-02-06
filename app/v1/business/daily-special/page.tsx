'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
    Calendar,
    Loader2,
    CheckCircle2,
    AlertCircle,
    History,
    BarChart3,
    ChevronDown,
    Check
} from 'lucide-react';

export default function DailySpecialPage() {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<any[]>([]);
    const [selectedSpecial, setSelectedSpecial] = useState('');
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
    const [settingSpecial, setSettingSpecial] = useState(false);

    // New State for Day Selection
    const [dailySpecials, setDailySpecials] = useState<Record<string, string>>({});
    const [selectedDay, setSelectedDay] = useState<string>('Lunes');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Derived state
    const selectedProduct = products.find(p => p.id === selectedSpecial);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const [profileRes, prodsRes, catsRes] = await Promise.all([
                    fetch('https://bucjudzbm9.us-east-1.awsapprunner.com/api/v1/business/profile'),
                    fetch('https://bucjudzbm9.us-east-1.awsapprunner.com/api/v1/business/menu/products'),
                    fetch('https://bucjudzbm9.us-east-1.awsapprunner.com/api/v1/business/menu/categories')
                ]);

                const profile = await profileRes.json();
                const products = await prodsRes.json();
                const categories = await catsRes.json();

                let allProducts: any[] = [];
                if (Array.isArray(products) && Array.isArray(categories)) {
                    allProducts = products.map((p: any) => {
                        const cat = categories.find((c: any) => c.ID === p.category_id || c.ID === p.categoryId);
                        return {
                            ...p,
                            id: p.ID,
                            categoryName: cat?.name || 'Sin categoría'
                        };
                    });
                }
                setProducts(allProducts);
                // Load existing specials from profile
                setDailySpecials(profile.dailySpecials || {});

            } catch (error) {
                console.error("Error loading products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Update selected dropdown when day changes
    useEffect(() => {
        if (dailySpecials[selectedDay]) {
            setSelectedSpecial(dailySpecials[selectedDay]);
        } else {
            setSelectedSpecial('');
        }
    }, [selectedDay, dailySpecials]);

    const showMessage = (text: string, type: 'success' | 'error') => {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), 3000);
    };

    const handleSetDailySpecial = async () => {
        if (!selectedSpecial) return;
        setSettingSpecial(true);
        try {
            const response = await fetch('https://bucjudzbm9.us-east-1.awsapprunner.com/api/v1/business/daily-special/set', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: selectedSpecial,
                    date: new Date().toISOString().split('T')[0],
                    isDefault: true,
                    dayOfWeek: selectedDay
                })
            });

            if (response.ok) {
                showMessage("Platillo especial actualizado con éxito", "success");
                // Update local state to reflect change immediately
                setDailySpecials(prev => ({ ...prev, [selectedDay]: selectedSpecial }));
            } else {
                showMessage("Error al actualizar la especialidad", "error");
            }
        } catch (error) {
            showMessage("Error de conexión", "error");
        } finally {
            setSettingSpecial(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header settingsOptions={[
                { label: 'Ver Historial', onClick: () => alert('Historial'), icon: History },
                { label: 'Estadísticas', onClick: () => alert('Estadísticas'), icon: BarChart3 }
            ]} />

            <main className="flex-1 container mx-auto max-w-2xl px-4 py-8">
                {message && (
                    <div className={`fixed top-24 right-4 z-50 px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in ${message.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}>
                        {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        <span className="font-bold">{message.text}</span>
                    </div>
                )}

                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Platillo del Día</h1>
                    <p className="text-gray-600 mt-2">Destaca un producto en tu página principal para aumentar sus ventas.</p>
                </div>

                <Card className="p-8 border-0 shadow-xl rounded-3xl bg-white relative group hover:ring-2 hover:ring-emerald-100 transition-all">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-t-3xl" />

                    <div className="flex items-center justify-center mb-8">
                        <div className="p-4 bg-emerald-100 rounded-full">
                            <Calendar className="w-12 h-12 text-emerald-600" />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Día de la Semana</label>
                            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                                {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((day) => (
                                    <button
                                        key={day}
                                        onClick={() => setSelectedDay(day)}
                                        className={`py-2 rounded-lg text-xs font-bold transition-all ${selectedDay === day ? 'bg-emerald-600 text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                    >
                                        {day.slice(0, 3)}
                                    </button>
                                ))}
                            </div>
                            <div className="mt-2 text-center font-bold text-emerald-700">{selectedDay}</div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Selecciona un Producto</label>
                            <div className="relative">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="w-full h-16 rounded-xl bg-gray-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white transition-all px-4 flex items-center justify-between outline-none hover:bg-gray-100 group"
                                >
                                    {selectedProduct ? (
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gray-200 overflow-hidden shrink-0 border border-gray-200">
                                                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="text-left leading-tight">
                                                <div className="font-bold text-gray-900">{selectedProduct.name}</div>
                                                <div className="text-xs font-semibold text-emerald-600">{selectedProduct.price}</div>
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="text-gray-500 font-medium">Selecciona un platillo...</span>
                                    )}
                                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isDropdownOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
                                        <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 max-h-80 overflow-y-auto z-20 animate-in fade-in zoom-in-95 duration-100 scrollbar-thin scrollbar-thumb-gray-200">
                                            {products.length === 0 ? (
                                                <div className="p-4 text-center text-gray-500 text-sm">No hay productos disponibles</div>
                                            ) : (
                                                <div className="p-2 space-y-1">
                                                    {products.map(p => (
                                                        <button
                                                            key={p.id}
                                                            disabled={!p.available}
                                                            onClick={() => {
                                                                if (p.available) {
                                                                    setSelectedSpecial(p.id);
                                                                    setIsDropdownOpen(false);
                                                                }
                                                            }}
                                                            className={`w-full p-2 rounded-lg flex items-center justify-between transition-colors ${!p.available ? 'opacity-50 cursor-not-allowed bg-gray-50' : selectedSpecial === p.id ? 'bg-emerald-50 ring-1 ring-emerald-200' : 'hover:bg-gray-50'}`}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-100">
                                                                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                                                                </div>
                                                                <div className="text-left">
                                                                    <div className="font-bold text-gray-900 text-sm">{p.name}</div>
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="text-xs font-medium text-gray-500">{p.price}</div>
                                                                        {!p.available && <span className="text-[10px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded font-bold">Agotado</span>}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {selectedSpecial === p.id && <Check className="w-4 h-4 text-emerald-600" />}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <Button
                            onClick={handleSetDailySpecial}
                            disabled={!selectedSpecial || settingSpecial}
                            className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-lg shadow-lg transition-all"
                        >
                            {settingSpecial ? <Loader2 className="w-6 h-6 animate-spin" /> : "Establecer como Especialidad"}
                        </Button>
                    </div>
                </Card>
            </main>
        </div>
    );
}
