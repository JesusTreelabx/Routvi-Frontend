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
    Save,
    Edit2,
    ArrowUpDown
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
        setAdding(true);
        try {
            const response = await fetch('/api/v1/business/menu/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: 'Nueva Categoría' })
            });
            if (response.ok) {
                const result = await response.json();
                setCategories([...categories, result.data]);
                showMessage("Categoría creada", "success");

                // Custom slow smooth scroll
                setTimeout(() => {
                    const element = document.getElementById(`category-${result.data.id}`);
                    if (element) {
                        const targetPosition = element.getBoundingClientRect().top + window.scrollY - (window.innerHeight / 2) + (element.clientHeight / 2);
                        const startPosition = window.scrollY;
                        const distance = targetPosition - startPosition;
                        const duration = 1500; // 1.5 seconds for slower scroll
                        let startTime: number | null = null;

                        function animation(currentTime: number) {
                            if (startTime === null) startTime = currentTime;
                            const timeElapsed = currentTime - startTime;

                            // EaseInOutQuad
                            const ease = (t: number, b: number, c: number, d: number) => {
                                t /= d / 2;
                                if (t < 1) return c / 2 * t * t + b;
                                t--;
                                return -c / 2 * (t * (t - 2) - 1) + b;
                            };

                            const run = ease(timeElapsed, startPosition, distance, duration);
                            window.scrollTo(0, run);

                            if (timeElapsed < duration) {
                                requestAnimationFrame(animation);
                            } else {
                                // Focus after animation to prevent jump
                                const input = element!.querySelector('input');
                                if (input) input.focus({ preventScroll: true });
                            }
                        }

                        requestAnimationFrame(animation);
                    }
                }, 100);
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
                <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header settingsOptions={[
                { label: 'Reordenar Categorías', onClick: () => alert('Reordenar'), icon: ArrowUpDown },
                { label: 'Papelera', onClick: () => alert('Papelera'), icon: Trash2 }
            ]} />

            <main className="flex-1 container mx-auto max-w-4xl px-4 py-8">
                <div className="mb-8">
                    <Link href="/v1/business/profile" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors mb-4 group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Volver al Perfil
                    </Link>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Categorías del Menú</h1>
                            <p className="text-gray-600">Organiza tus platos en secciones claras para tus clientes.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            {message && (
                                <div className={`px-4 py-2 rounded-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                                    {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                                    <span className="text-sm font-bold">{message.text}</span>
                                </div>
                            )}
                            <Button
                                onClick={addCategory}
                                disabled={adding}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold uppercase tracking-wide gap-2 shadow-lg hover:shadow-xl transition-all active:scale-95"
                            >
                                {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-5 h-5" />}
                                {adding ? 'Creando...' : 'Nueva Categoría'}
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    {/* Categories List */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-2 bg-emerald-100 rounded-lg"><LayoutGrid className="w-5 h-5 text-emerald-700" /></div>
                            <h3 className="text-xl font-bold text-gray-900 italic">Tus Categorías</h3>
                        </div>

                        {categories.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-gray-100 italic text-gray-400">
                                Aún no has creado ninguna categoría.
                            </div>
                        ) : (
                            categories.map((cat) => (
                                <Card id={`category-${cat.id}`} key={cat.id} className="p-0 border-0 shadow-lg rounded-2xl bg-white overflow-hidden group hover:ring-2 hover:ring-emerald-100 transition-all">
                                    {/* Green Header */}
                                    <div className="bg-emerald-700 p-4 flex items-center justify-between">
                                        <div className="flex-1 flex items-center gap-2 group/input">
                                            <input
                                                defaultValue={cat.category}
                                                onBlur={(e) => {
                                                    if (e.target.value !== cat.category) {
                                                        updateCategoryName(cat.id, e.target.value);
                                                    }
                                                }}
                                                className="bg-transparent border-0 font-bold text-white text-lg tracking-wider focus:ring-0 outline-none w-full cursor-pointer hover:bg-white/10 rounded px-2 -ml-2 transition-colors placeholder-white/50"
                                                placeholder="NOMBRE CATEGORÍA"
                                            />
                                            <Edit2 className="w-4 h-4 text-white/50 group-hover/input:text-white transition-colors opacity-0 group-hover/input:opacity-100 pointer-events-none" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => deleteCategory(cat.id)}
                                                className="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-2 h-auto"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                            <div className="cursor-grab active:cursor-grabbing text-white/50 hover:text-white/80">
                                                <GripVertical className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-5 flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-1">Contenido</p>
                                            <div className="flex items-center gap-2">
                                                <Tag className="w-4 h-4 text-emerald-600" />
                                                <span className="text-lg font-bold text-gray-900">
                                                    {cat.products.length} {cat.products.length === 1 ? 'Producto' : 'Productos'}
                                                </span>
                                            </div>
                                        </div>

                                        <Link href="/v1/business/menu/products">
                                            <Button
                                                className="bg-gray-50 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 border-0 shadow-sm transition-all"
                                            >
                                                Ver Productos
                                            </Button>
                                        </Link>
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
