'use client';

import { useState, useEffect } from 'react';
import {
    Camera,
    Store,
    MapPin,
    Phone,
    Mail,
    Clock,
    Save,
    ExternalLink,
    Instagram,
    Facebook,
    CheckCircle2,
    Plus,
    Trash2,
    UtensilsCrossed,
    Image as ImageIcon,
    Tag,
    Star,
    Heart,
    Wifi,
    Dog,
    Car,
    Wind,
    ShieldCheck,
    FileText,
    User,
    Briefcase,
    Fingerprint,
    Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Header from '@/components/layout/Header';

export default function BusinessProfilePage() {
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [data, setData] = useState<any>(null);


    // Default structure to prevent crashes
    const DEFAULT_DATA = {
        menu: [],
        name: "",
        category: "",
        priceRange: "",
        description: "",
        social: { instagram: "", facebook: "" },
        contact: { phone: "", email: "", address: "" },
        legal: { razonSocial: "", rfc: "", regimen: "", businessType: "" },
        admin: { representative: "", position: "" },
        hours: {},
        vibes: [],
        amenities: [],
        promotions: []
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/v1/business/profile');
                let result = await response.json();

                // Merge with defaults to ensure robustness
                result = {
                    ...DEFAULT_DATA,
                    ...result,
                    social: { ...DEFAULT_DATA.social, ...(result.social || {}) },
                    contact: { ...DEFAULT_DATA.contact, ...(result.contact || {}) },
                    legal: { ...DEFAULT_DATA.legal, ...(result.legal || {}) },
                    admin: { ...DEFAULT_DATA.admin, ...(result.admin || {}) },
                    hours: { ...DEFAULT_DATA.hours, ...(result.hours || {}) }
                };

                setData(result);
            } catch (error) {
                console.error("Error fetching profile:", error);
                setData(DEFAULT_DATA);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSave = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setSaving(true);
        try {
            const response = await fetch('/api/v1/business/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            }
        } catch (error) {
            console.error("Error saving profile:", error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
            </div>
        );
    }

    const updateField = (path: string, value: any) => {
        const newData = { ...data };
        const keys = path.split('.');
        let current = newData;
        for (let i = 0; i < keys.length - 1; i++) {
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
        setData(newData);
    };

    // --- Menu Category Actions ---
    const addCategory = async () => {
        try {
            const response = await fetch('/api/v1/business/menu/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: 'Nueva Categoría' })
            });
            if (response.ok) {
                const result = await response.json();
                const newData = { ...data, menu: [...data.menu, result.data] };
                setData(newData);
            }
        } catch (error) {
            console.error("Error adding category:", error);
        }
    };

    const updateCategoryName = async (id: string, name: string) => {
        try {
            await fetch(`/api/v1/business/menu/categories/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name })
            });
        } catch (error) {
            console.error("Error updating category:", error);
        }
    };

    const deleteCategory = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar esta categoría y todos sus productos?')) return;
        try {
            const response = await fetch(`/api/v1/business/menu/categories/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                const newData = { ...data, menu: data.menu.filter((c: any) => c.id !== id) };
                setData(newData);
            }
        } catch (error) {
            console.error("Error deleting category:", error);
        }
    };

    // --- Product Actions ---
    const addProduct = async (categoryId: string) => {
        try {
            const response = await fetch('/api/v1/business/menu/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    categoryId,
                    name: 'Nuevo Producto',
                    price: '$0',
                    description: 'Descripción del producto'
                })
            });
            if (response.ok) {
                const result = await response.json();
                const newMenu = data.menu.map((cat: any) => {
                    if (cat.id === categoryId) {
                        return { ...cat, products: [...cat.products, result.data] };
                    }
                    return cat;
                });
                setData({ ...data, menu: newMenu });
            }
        } catch (error) {
            console.error("Error adding product:", error);
        }
    };

    const updateProduct = async (productId: string, updates: any) => {
        try {
            await fetch(`/api/v1/business/menu/products/${productId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });
        } catch (error) {
            console.error("Error updating product:", error);
        }
    };

    const deleteProduct = async (productId: string, categoryId: string) => {
        try {
            const response = await fetch(`/api/v1/business/menu/products/${productId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                const newMenu = data.menu.map((cat: any) => {
                    if (cat.id === categoryId) {
                        return { ...cat, products: cat.products.filter((p: any) => p.id !== productId) };
                    }
                    return cat;
                });
                setData({ ...data, menu: newMenu });
            }
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />

            <main className="flex-1 container mx-auto max-w-5xl px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-primary-900 tracking-tight">
                            Perfil de tu Negocio
                        </h1>
                        <p className="text-gray-600">
                            Gestiona cómo ven los clientes tu negocio en Routvi.
                        </p>
                    </div>
                    <Button
                        onClick={() => handleSave()}
                        disabled={saving}
                        className="bg-primary-600 hover:bg-primary-700 text-white shadow-lg gap-2 px-6 h-12 rounded-xl transition-all active:scale-95 disabled:opacity-70"
                    >
                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : saved ? <CheckCircle2 className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                        {saving ? 'Guardando...' : saved ? 'Guardado' : 'Guardar Cambios'}
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 flex flex-col gap-6">
                        <Card className="p-0 overflow-hidden border-2 border-white shadow-xl rounded-2xl">
                            <div className="relative h-32 bg-primary-100">
                                <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover opacity-60" alt="Cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                <button className="absolute bottom-2 right-2 p-2 bg-white/90 backdrop-blur rounded-full shadow-md hover:bg-white transition-colors">
                                    <Camera className="w-4 h-4 text-primary-600" />
                                </button>
                            </div>
                            <div className="px-6 pb-6 relative">
                                <div className="absolute -top-10 left-6">
                                    <div className="relative">
                                        <div className="w-20 h-20 rounded-2xl bg-white p-1 shadow-2xl border-2 border-white overflow-hidden">
                                            <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" className="w-full h-full object-cover" alt="Logo" />
                                        </div>
                                        <button className="absolute -bottom-1 -right-1 p-1.5 bg-primary-600 rounded-full text-white shadow-md border-2 border-white hover:bg-primary-700">
                                            <Camera className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-12">
                                    <h2 className="text-xl font-bold text-gray-900">{data.name}</h2>
                                    <p className="text-sm text-gray-500">{data.category}</p>
                                    <div className="mt-3 flex gap-2">
                                        <Badge className="bg-primary-100 text-primary-700 border-primary-200">Suscripción Pro</Badge>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 border-0 shadow-lg rounded-2xl bg-white">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">Redes Sociales</h3>
                            <div className="flex flex-col gap-3">
                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] text-gray-400 font-bold uppercase ml-1">Instagram</label>
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl group hover:bg-primary-50 transition-colors">
                                        <Instagram className="w-5 h-5 text-pink-500" />
                                        <input value={data.social.instagram} onChange={(e) => updateField('social.instagram', e.target.value)} className="text-sm text-gray-700 flex-1 bg-transparent border-0 p-0 focus:ring-0 outline-none" />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] text-gray-400 font-bold uppercase ml-1">Facebook</label>
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl group hover:bg-primary-50 transition-colors">
                                        <Facebook className="w-5 h-5 text-blue-600" />
                                        <input value={data.social.facebook} onChange={(e) => updateField('social.facebook', e.target.value)} className="text-sm text-gray-700 flex-1 bg-transparent border-0 p-0 focus:ring-0 outline-none" />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="lg:col-span-2 flex flex-col gap-8">
                        <section>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-primary-100 rounded-lg"><Store className="w-5 h-5 text-primary-700" /></div>
                                <h3 className="text-xl font-bold text-gray-900 italic">Información Principal</h3>
                            </div>
                            <Card className="p-6 border-0 shadow-lg rounded-2xl bg-white space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre del Negocio</label>
                                    <Input value={data.name} onChange={(e) => updateField('name', e.target.value)} className="h-12 rounded-xl bg-gray-50" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Categoría Principal</label>
                                        <select value={data.category} onChange={(e) => updateField('category', e.target.value)} className="w-full h-12 rounded-xl bg-gray-50 border-0 px-4 focus:ring-2 focus:ring-primary-500 outline-none appearance-none">
                                            <option>Pizzería</option><option>Hamburguesas</option><option>Sushi</option><option>Cafetería</option><option>Bar / Drinks</option><option>Postres</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Rango de Precios</label>
                                        <div className="flex gap-2">
                                            {['$', '$$', '$$$', '$$$$'].map((p) => (
                                                <button key={p} onClick={() => updateField('priceRange', p)} className={`flex-1 h-12 rounded-xl border-2 transition-all font-bold ${data.priceRange === p ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-100 bg-gray-50 text-gray-400'}`}>{p}</button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción corta</label>
                                    <textarea rows={3} className="w-full rounded-xl bg-gray-50 border-0 p-4 focus:ring-2 focus:ring-primary-500 outline-none" value={data.description} onChange={(e) => updateField('description', e.target.value)} />
                                </div>
                            </Card>
                        </section>

                        <section>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-purple-100 rounded-lg"><Tag className="w-5 h-5 text-purple-700" /></div>
                                <h3 className="text-xl font-bold text-gray-900 italic">Vibes y Características</h3>
                            </div>
                            <Card className="p-6 border-0 shadow-lg rounded-2xl bg-white space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">¿Cuál es el vibe del lugar?</label>
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            { name: 'Romántico', icon: Heart, color: 'text-rose-500' },
                                            { name: 'Familiar', icon: Star, color: 'text-amber-500' },
                                            { name: 'Para Trabajar', icon: Clock, color: 'text-blue-500' },
                                            { name: 'Con Amigos', icon: UtensilsCrossed, color: 'text-emerald-500' }
                                        ].map((vibe) => (
                                            <button key={vibe.name} onClick={() => {
                                                const newVibes = data.vibes.includes(vibe.name) ? data.vibes.filter((v: string) => v !== vibe.name) : [...data.vibes, vibe.name];
                                                updateField('vibes', newVibes);
                                            }} className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${data.vibes.includes(vibe.name) ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500' : 'border-gray-100 bg-gray-50'}`}>
                                                <vibe.icon className={`w-4 h-4 ${vibe.color}`} /><span className="text-sm font-semibold text-gray-700">{vibe.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">Servicios e Instalaciones</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {[
                                            { name: 'WiFi Gratis', icon: Wifi }, { name: 'Pet Friendly', icon: Dog }, { name: 'Estacionamiento', icon: Car },
                                            { name: 'Aire Acondicionado', icon: Wind }, { name: 'Terraza', icon: ImageIcon }, { name: 'Música en vivo', icon: UtensilsCrossed }
                                        ].map((feature) => (
                                            <label key={feature.name} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50 cursor-pointer hover:bg-white transition-all">
                                                <input type="checkbox" checked={data.amenities.includes(feature.name)} onChange={() => {
                                                    const newAmenities = data.amenities.includes(feature.name) ? data.amenities.filter((a: string) => a !== feature.name) : [...data.amenities, feature.name];
                                                    updateField('amenities', newAmenities);
                                                }} className="rounded border-gray-300 text-primary-600" />
                                                <div className="flex items-center gap-2"><feature.icon className="w-4 h-4 text-gray-400" /><span className="text-xs font-semibold text-gray-600">{feature.name}</span></div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </Card>
                        </section>

                        <section>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-emerald-100 rounded-lg"><UtensilsCrossed className="w-5 h-5 text-emerald-700" /></div>
                                    <h3 className="text-xl font-bold text-gray-900 italic">Menú y Productos</h3>
                                </div>
                                <Button onClick={addCategory} className="h-9 px-4 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-0 flex items-center gap-2 group">
                                    <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    <span className="text-sm font-bold uppercase tracking-tight">Nueva Categoría</span>
                                </Button>
                            </div>
                            <div className="flex flex-col gap-6">
                                {data.menu.map((cat: any, cIdx: number) => (
                                    <Card key={cat.id || cIdx} className="p-0 border-0 shadow-lg rounded-2xl bg-white overflow-hidden">
                                        <div className="bg-emerald-700 p-4 flex items-center justify-between">
                                            <div className="flex-1">
                                                <input
                                                    value={cat.category}
                                                    onChange={(e) => {
                                                        const newMenu = [...data.menu];
                                                        newMenu[cIdx].category = e.target.value;
                                                        setData({ ...data, menu: newMenu });
                                                    }}
                                                    onBlur={(e) => updateCategoryName(cat.id, e.target.value)}
                                                    className="bg-transparent border-0 font-bold text-white uppercase tracking-wider focus:ring-0 outline-none w-full"
                                                />
                                            </div>
                                            <Trash2 onClick={() => deleteCategory(cat.id)} className="w-4 h-4 text-white/80 cursor-pointer hover:text-white ml-4" />
                                        </div>
                                        <div className="p-5 flex flex-col gap-4">
                                            {cat.products.map((prod: any, pIdx: number) => (
                                                <div key={prod.id} className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 group relative">
                                                    <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200 relative border-2 border-white shadow-sm">
                                                        <img src={prod.image} className="w-full h-full object-cover" alt={prod.name} />
                                                        <button className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><ImageIcon className="w-6 h-6 text-white" /></button>
                                                    </div>
                                                    <div className="flex-1 flex flex-col justify-between">
                                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                                            <div className="md:col-span-3">
                                                                <input
                                                                    value={prod.name}
                                                                    onChange={(e) => {
                                                                        const newMenu = [...data.menu];
                                                                        newMenu[cIdx].products[pIdx].name = e.target.value;
                                                                        setData({ ...data, menu: newMenu });
                                                                    }}
                                                                    onBlur={(e) => updateProduct(prod.id, { name: e.target.value })}
                                                                    className="w-full bg-transparent border-0 font-bold text-lg p-0 focus:ring-0 outline-none"
                                                                />
                                                                <textarea
                                                                    rows={1}
                                                                    className="w-full bg-transparent border-0 p-0 text-sm text-gray-500 focus:ring-0 resize-none italic outline-none"
                                                                    value={prod.description}
                                                                    onChange={(e) => {
                                                                        const newMenu = [...data.menu];
                                                                        newMenu[cIdx].products[pIdx].description = e.target.value;
                                                                        setData({ ...data, menu: newMenu });
                                                                    }}
                                                                    onBlur={(e) => updateProduct(prod.id, { description: e.target.value })}
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="text-[10px] text-gray-400 font-bold uppercase">Precio</label>
                                                                <Input
                                                                    value={prod.price}
                                                                    onChange={(e) => {
                                                                        const newMenu = [...data.menu];
                                                                        newMenu[cIdx].products[pIdx].price = e.target.value;
                                                                        setData({ ...data, menu: newMenu });
                                                                    }}
                                                                    onBlur={(e) => updateProduct(prod.id, { price: e.target.value })}
                                                                    className="h-9 bg-white border-gray-200 text-emerald-600 font-bold"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={prod.available}
                                                                onChange={() => {
                                                                    const newAvailable = !prod.available;
                                                                    const newMenu = [...data.menu];
                                                                    newMenu[cIdx].products[pIdx].available = newAvailable;
                                                                    setData({ ...data, menu: newMenu });
                                                                    updateProduct(prod.id, { available: newAvailable });
                                                                }}
                                                                className="rounded border-gray-300 text-emerald-600"
                                                            />
                                                            <span className="text-xs font-semibold text-gray-600">Disponible</span>
                                                        </div>
                                                    </div>
                                                    <Trash2 onClick={() => deleteProduct(prod.id, cat.id)} className="absolute top-2 right-2 w-4 h-4 text-gray-300 hover:text-red-500 cursor-pointer transition-colors" />
                                                </div>
                                            ))}
                                            <button onClick={() => addProduct(cat.id)} className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 font-semibold hover:border-emerald-300 hover:text-emerald-500 transition-all flex items-center justify-center gap-2 mt-2"><Plus className="w-4 h-4" />Agregar Producto</button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </section>

                        <section>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-blue-100 rounded-lg"><Phone className="w-5 h-5 text-blue-700" /></div>
                                <h3 className="text-xl font-bold text-gray-900 italic">Contacto y Ubicación</h3>
                            </div>
                            <Card className="p-6 border-0 shadow-lg rounded-2xl bg-white grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label className="block text-sm font-semibold text-gray-700 mb-2">WhatsApp</label><Input value={data.contact.phone} onChange={(e) => updateField('contact.phone', e.target.value)} className="h-12 bg-gray-50" /></div>
                                <div><label className="block text-sm font-semibold text-gray-700 mb-2">Email</label><Input value={data.contact.email} onChange={(e) => updateField('contact.email', e.target.value)} className="h-12 bg-gray-50" /></div>
                                <div className="md:col-span-2"><label className="block text-sm font-semibold text-gray-700 mb-2">Dirección</label><Input value={data.contact.address} onChange={(e) => updateField('contact.address', e.target.value)} className="h-12 bg-gray-50" /></div>
                            </Card>
                        </section>

                        <section>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-slate-100 rounded-lg"><ShieldCheck className="w-5 h-5 text-slate-700" /></div>
                                <h3 className="text-xl font-bold text-gray-900 italic">Fiscal y Legal</h3>
                            </div>
                            <Card className="p-6 border-0 shadow-lg rounded-2xl bg-white grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label className="block text-sm font-semibold text-gray-700 mb-2">Razón Social</label><Input value={data.legal.razonSocial} onChange={(e) => updateField('legal.razonSocial', e.target.value)} className="h-12 bg-gray-50" /></div>
                                <div><label className="block text-sm font-semibold text-gray-700 mb-2">RFC</label><Input value={data.legal.rfc} onChange={(e) => updateField('legal.rfc', e.target.value)} className="h-12 bg-gray-50 uppercase" /></div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Régimen</label>
                                    <select value={data.legal.regimen} onChange={(e) => updateField('legal.regimen', e.target.value)} className="w-full h-12 rounded-xl bg-gray-50 border-0 px-4 focus:ring-2 focus:ring-primary-500 outline-none">
                                        <option>Persona Moral</option><option>Persona Física</option><option>RESICO</option>
                                    </select>
                                </div>
                                <div><label className="block text-sm font-semibold text-gray-700 mb-2">Tipo</label><Input value={data.legal.businessType} onChange={(e) => updateField('legal.businessType', e.target.value)} className="h-12 bg-gray-50" /></div>
                            </Card>
                        </section>

                        <section>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-indigo-100 rounded-lg"><User className="w-5 h-5 text-indigo-700" /></div>
                                <h3 className="text-xl font-bold text-gray-900 italic">Admin</h3>
                            </div>
                            <Card className="p-6 border-0 shadow-lg rounded-2xl bg-white grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label className="block text-sm font-semibold text-gray-700 mb-2">Representante</label><Input value={data.admin.representative} onChange={(e) => updateField('admin.representative', e.target.value)} className="h-12 bg-gray-50" /></div>
                                <div><label className="block text-sm font-semibold text-gray-700 mb-2">Puesto</label><Input value={data.admin.position} onChange={(e) => updateField('admin.position', e.target.value)} className="h-12 bg-gray-50" /></div>
                            </Card>
                        </section>

                        <section>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-orange-100 rounded-lg"><Clock className="w-5 h-5 text-orange-700" /></div>
                                <h3 className="text-xl font-bold text-gray-900 italic">Horarios</h3>
                            </div>
                            <Card className="p-6 border-0 shadow-lg rounded-2xl bg-white">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                                    {Object.entries(data.hours).map(([day, times]: [string, any]) => (
                                        <div key={day} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 md:last:border-b">
                                            <span className="font-semibold text-gray-700">{day}</span>
                                            <div className="flex items-center gap-2">
                                                <input type="time" value={times.open} onChange={(e) => updateField(`hours.${day}.open`, e.target.value)} className="bg-gray-100 rounded-lg px-2 py-1 text-sm border-0" />
                                                <span className="text-gray-400">-</span>
                                                <input type="time" value={times.close} onChange={(e) => updateField(`hours.${day}.close`, e.target.value)} className="bg-gray-100 rounded-lg px-2 py-1 text-sm border-0" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}
