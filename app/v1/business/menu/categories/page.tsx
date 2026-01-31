'use client';

import { useState, useEffect } from 'react';
import {
    Plus,
    Trash2,
    LayoutGrid,
    ArrowLeft,
    Tag,
    GripVertical,
    Loader2,
    CheckCircle2,
    Save
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import Header from '@/components/layout/Header';

interface Category {
    id: string;
    category: string;
    products: any[];
}

export default function BusinessMenuCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/v1/business/profile');
                const data = await response.json();
                setCategories(data.menu || []);
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const showMessage = (text: string, type: 'success' | 'error') => {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), 3000);
    };

    const addCategory = async () => {
        if (!newCategoryName.trim()) return;
        setAdding(true);
        try {
            const response = await fetch('/api/v1/business/menu/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newCategoryName })
            });
            if (response.ok) {
                const result = await response.json();
                setCategories([...categories, result.data]);
                setNewCategoryName('');
                showMessage("Categoría creada", "success");
            }
        } catch (error) {
            showMessage("Error al crear categoría", "error");
        } finally {
            setAdding(false);
        }
    };

    const updateCategoryName = async (id: string, name: string) => {
        try {
            const response = await fetch(`/api/v1/business/menu/categories/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name })
            });
            if (response.ok) {
                setCategories(categories.map(cat => cat.id === id ? { ...cat, category: name } : cat));
                showMessage("Cambios guardados", "success");
            }
        } catch (error) {
            showMessage("Error al actualizar", "error");
        }
    };

    const deleteCategory = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar esta categoría? Se eliminarán también sus productos.')) return;
        try {
            const response = await fetch(`/api/v1/business/menu/categories/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setCategories(categories.filter(cat => cat.id !== id));
                showMessage("Categoría eliminada", "success");
            }
        } catch (error) {
            showMessage("Error al eliminar", "error");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />

            <main className="flex-1 container mx-auto max-w-4xl px-4 py-8">
                <div className="mb-8">
                    <Link href="/v1/business/profile" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors mb-4 group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Volver al Perfil
                    </Link>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-extrabold text-primary-900 tracking-tight">Categorías del Menú</h1>
                            <p className="text-gray-600">Organiza tus platos en secciones claras para tus clientes.</p>
                        </div>
                        {message && (
                            <div className={`px-4 py-2 rounded-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                                {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                                <span className="text-sm font-bold">{message.text}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {/* Add Category Card */}
                    <Card className="p-6 border-0 shadow-xl rounded-2xl bg-white">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 italic">
                            <Plus className="w-5 h-5 text-emerald-600" />
                            Agregar Nueva Categoría
                        </h3>
                        <div className="flex gap-4">
                            <Input
                                placeholder="Ej: Pizzas, Bebidas, Postres..."
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                className="h-12 rounded-xl bg-gray-50 border-0 focus:ring-2 focus:ring-primary-500"
                                onKeyDown={(e) => e.key === 'Enter' && addCategory()}
                            />
                            <Button
                                onClick={addCategory}
                                disabled={adding || !newCategoryName.trim()}
                                className="h-12 px-6 bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50"
                            >
                                {adding ? <Loader2 className="w-5 h-5 animate-spin" /> : "Crear"}
                            </Button>
                        </div>
                    </Card>

                    {/* Categories List */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-2 bg-primary-100 rounded-lg"><LayoutGrid className="w-5 h-5 text-primary-700" /></div>
                            <h3 className="text-xl font-bold text-gray-900 italic">Tus Categorías</h3>
                        </div>

                        {categories.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-gray-100 italic text-gray-400">
                                Aún no has creado ninguna categoría.
                            </div>
                        ) : (
                            categories.map((cat) => (
                                <Card key={cat.id} className="p-4 border-0 shadow-lg rounded-2xl bg-white flex items-center gap-4 group hover:ring-2 hover:ring-primary-100 transition-all">
                                    <Link href="/v1/business/menu/products" className="p-3 bg-gray-50 rounded-xl hover:bg-primary-50 transition-colors">
                                        <Tag className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
                                    </Link>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <input
                                                defaultValue={cat.category}
                                                onBlur={(e) => {
                                                    if (e.target.value !== cat.category) {
                                                        updateCategoryName(cat.id, e.target.value);
                                                    }
                                                }}
                                                className="w-full bg-transparent border-0 font-bold text-gray-800 focus:ring-0 outline-none p-0 h-8"
                                                placeholder="Nombre de la categoría"
                                            />
                                            <Link
                                                href="/v1/business/menu/products"
                                                className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded hover:bg-primary-100 transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                Ver Productos
                                            </Link>
                                        </div>
                                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                                            {cat.products.length} {cat.products.length === 1 ? 'Producto' : 'Productos'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => deleteCategory(cat.id)}
                                            className="text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                        <div className="p-2 cursor-grab active:cursor-grabbing text-gray-300">
                                            <GripVertical className="w-4 h-4" />
                                        </div>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
