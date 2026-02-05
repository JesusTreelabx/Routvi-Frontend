'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
    Megaphone,
    Calendar,
    UploadCloud,
    Loader2,
    CheckCircle2,
    Share2,
    AlertCircle,
    History,
    BarChart3
} from 'lucide-react';

export default function MarketingPage() {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<any[]>([]);
    const [selectedSpecial, setSelectedSpecial] = useState('');
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    // Form States
    const [postContent, setPostContent] = useState('');
    const [publishing, setPublishing] = useState(false);
    const [settingSpecial, setSettingSpecial] = useState(false);
    const [posting, setPosting] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('https://bucjudzbm9.us-east-1.awsapprunner.com/api/v1/business/profile');
                const data = await response.json();

                // Flatten products from categories
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
            const response = await fetch('https://bucjudzbm9.us-east-1.awsapprunner.com/api/v1/business/daily-special/set', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: selectedSpecial,
                    date: new Date().toISOString().split('T')[0],
                    isDefault: true
                })
            });

            if (response.ok) {
                showMessage("Platillo especial actualizado", "success");
            } else {
                showMessage("Error al actualizar", "error");
            }
        } catch (error) {
            showMessage("Error de conexión", "error");
        } finally {
            setSettingSpecial(false);
        }
    };

    const handleCreatePost = async () => {
        if (!postContent.trim()) return;
        setPosting(true);
        try {
            const response = await fetch('https://bucjudzbm9.us-east-1.awsapprunner.com/api/v1/business/social-posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: postContent,
                    type: 'post'
                })
            });

            if (response.ok) {
                showMessage("Publicación creada", "success");
                setPostContent('');
            } else {
                showMessage("Error al publicar", "error");
            }
        } catch (error) {
            showMessage("Error de conexión", "error");
        } finally {
            setPosting(false);
        }
    };

    const handlePublishSite = async () => {
        setPublishing(true);
        try {
            const response = await fetch('https://bucjudzbm9.us-east-1.awsapprunner.com/api/v1/business/publish', {
                method: 'POST'
            });

            if (response.ok) {
                showMessage("Sitio publicado exitosamente", "success");
            } else {
                showMessage("Error al publicar sitio", "error");
            }
        } catch (error) {
            showMessage("Error de conexión", "error");
        } finally {
            setPublishing(false);
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
                { label: 'Estadísticas', onClick: () => alert('Analytics'), icon: BarChart3 }
            ]} />

            <main className="flex-1 container mx-auto max-w-5xl px-4 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Marketing y Publicación</h1>
                        <p className="text-gray-600 mt-1">Gestiona las promociones diarias y la visibilidad de tu negocio.</p>
                    </div>

                    {/* Floating Message Toast */}
                    {message && (
                        <div className={`fixed top-24 right-4 z-50 px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-300 ${message.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}>
                            {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                            <span className="font-bold">{message.text}</span>
                        </div>
                    )}

                    <Button
                        onClick={handlePublishSite}
                        disabled={publishing}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg gap-2 px-8 h-12 rounded-xl text-lg font-bold uppercase tracking-wide transition-all active:scale-95"
                    >
                        {publishing ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />}
                        {publishing ? 'Publicando...' : 'Publicar Sitio'}
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Daily Special Card */}
                    <Card className="p-8 border-0 shadow-xl rounded-3xl bg-white overflow-hidden relative group hover:ring-2 hover:ring-emerald-100 transition-all">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-teal-500" />

                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-emerald-100 rounded-2xl">
                                <Calendar className="w-8 h-8 text-emerald-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Platillo del Día</h2>
                        </div>

                        <p className="text-gray-500 mb-6">Selecciona el producto que quieres destacar hoy en tu página principal. Esto aumentará su visibilidad.</p>

                        <div className="space-y-4">
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
                                className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-lg shadow-md transition-all mt-4"
                            >
                                {settingSpecial ? <Loader2 className="w-6 h-6 animate-spin" /> : "Guardar Especialidad"}
                            </Button>
                        </div>
                    </Card>

                    {/* Social Post Card */}
                    <Card className="p-8 border-0 shadow-xl rounded-3xl bg-white overflow-hidden relative group hover:ring-2 hover:ring-amber-100 transition-all">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 to-orange-500" />

                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-amber-100 rounded-2xl">
                                <Megaphone className="w-8 h-8 text-amber-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Publicación Social</h2>
                        </div>

                        <p className="text-gray-500 mb-6">Crea un mensaje rápido para tus redes sociales o para el tablón de anuncios de tu negocio.</p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Mensaje</label>
                                <textarea
                                    value={postContent}
                                    onChange={(e) => setPostContent(e.target.value)}
                                    placeholder="¡Hoy tenemos 2x1 en cervezas! Ven y disfruta con tus amigos..."
                                    className="w-full h-32 rounded-xl bg-gray-50 border-2 border-transparent focus:border-amber-400 focus:bg-white transition-all p-4 outline-none text-base font-medium text-gray-800 resize-none hover:bg-gray-100"
                                />
                            </div>

                            <div className="flex gap-2 justify-end">
                                <Button className="h-10 px-4 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg font-semibold">
                                    <UploadCloud className="w-4 h-4 mr-2" />
                                    Subir Imagen
                                </Button>
                            </div>

                            <Button
                                onClick={handleCreatePost}
                                disabled={!postContent || posting}
                                className="w-full h-14 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-lg shadow-md transition-all"
                            >
                                {posting ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                    <span className="flex items-center gap-2 justify-center">
                                        <Share2 className="w-5 h-5" /> Publicar Ahora
                                    </span>
                                )}
                            </Button>
                        </div>
                    </Card>
                </div>
            </main>
        </div>
    );
}
