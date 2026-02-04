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
    BarChart3
} from 'lucide-react';

export default function DailySpecialPage() {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<any[]>([]);
    const [selectedSpecial, setSelectedSpecial] = useState('');
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
    const [settingSpecial, setSettingSpecial] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/v1/business/profile');
                const data = await response.json();

                let allProducts: any[] = [];
                if (data.menu) {
                    data.menu.forEach((cat: any) => {
                        cat.products.forEach((p: any) => {
                            allProducts.push({ ...p, categoryName: cat.category });
                        });
                    });
                }
                setProducts(allProducts);
            } catch (error) {
                console.error("Error loading products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const showMessage = (text: string, type: 'success' | 'error') => {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), 3000);
    };

    const handleSetDailySpecial = async () => {
        if (!selectedSpecial) return;
        setSettingSpecial(true);
        try {
            const response = await fetch('/api/v1/business/daily-special/set', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: selectedSpecial,
                    date: new Date().toISOString().split('T')[0],
                    isDefault: true
                })
            });

            if (response.ok) {
                showMessage("Platillo especial actualizado con éxito", "success");
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

                <Card className="p-8 border-0 shadow-xl rounded-3xl bg-white overflow-hidden relative group hover:ring-2 hover:ring-emerald-100 transition-all">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-teal-500" />

                    <div className="flex items-center justify-center mb-8">
                        <div className="p-4 bg-emerald-100 rounded-full">
                            <Calendar className="w-12 h-12 text-emerald-600" />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Selecciona un Producto</label>
                            <select
                                value={selectedSpecial}
                                onChange={(e) => setSelectedSpecial(e.target.value)}
                                className="w-full h-14 rounded-xl bg-gray-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white transition-all px-4 outline-none text-lg font-medium text-gray-800 cursor-pointer hover:bg-gray-100"
                            >
                                <option value="">Selecciona un platillo...</option>
                                {products.map(p => (
                                    <option key={p.id} value={p.id}>{p.name} - {p.price}</option>
                                ))}
                            </select>
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
