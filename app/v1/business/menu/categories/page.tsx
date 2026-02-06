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
    ArrowUpDown,
    Menu as MenuIcon,
    PlusCircle,
    Check,
    ChevronDown
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
    const [editingValues, setEditingValues] = useState<Record<string, string>>({});
    const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const [catsRes, prodsRes] = await Promise.all([
                    fetch('https://bucjudzbm9.us-east-1.awsapprunner.com/api/v1/business/menu/categories'),
                    fetch('https://bucjudzbm9.us-east-1.awsapprunner.com/api/v1/business/menu/products')
                ]);

                const cats = await catsRes.json();
                const prods = await prodsRes.json();

                if (Array.isArray(cats)) {
                    // Map products to categories
                    const catsWithProducts = cats.map((cat: any) => ({
                        ...cat,
                        id: cat.ID || cat.id, // Ensure consistent ID property
                        category: cat.name || 'Sin nombre', // Frontend expects 'category' property
                        products: Array.isArray(prods)
                            ? prods.filter((p: any) => p.category_id === cat.ID || p.categoryId === cat.ID)
                            : []
                    }));

                    // Sort categories alphabetically by name
                    catsWithProducts.sort((a, b) => a.category.localeCompare(b.category));

                    setCategories(catsWithProducts);
                    // Initialize editing values
                    const initialValues: Record<string, string> = {};
                    const initialExpanded: Record<string, boolean> = {};
                    catsWithProducts.forEach((cat: any) => {
                        initialValues[cat.id] = cat.category;
                        initialExpanded[cat.id] = false; // All categories collapsed by default
                    });
                    setEditingValues(initialValues);
                    setExpandedCategories(initialExpanded);
                } else {
                    console.error('Categories response is not an array:', cats);
                    setCategories([]);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
                setCategories([]); // Set empty array on error
            } finally {
                // Always set loading to false, no matter what
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
            const response = await fetch('https://bucjudzbm9.us-east-1.awsapprunner.com/api/v1/business/menu/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: 'Nueva Categoría' })
            });
            if (response.ok) {
                const result = await response.json();
                const newCat = { ...result.data, id: result.data.ID || result.data.id, category: result.data.name || 'Nueva Categoría' };

                // Use functional updates to avoid race conditions
                setCategories(prevCategories => [...prevCategories, newCat]);
                setEditingValues(prevValues => ({ ...prevValues, [newCat.id]: newCat.category }));

                showMessage("Categoría creada", "success");

                // Custom slow smooth scroll
                setTimeout(() => {
                    const element = document.getElementById(`category-${newCat.id}`);
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
            } else {
                showMessage("Error al crear categoría", "error");
            }
        } catch (error) {
            console.error('Error creating category:', error);
            showMessage("Error al crear categoría", "error");
        } finally {
            setAdding(false);
        }
    };

    const updateCategoryName = async (id: string, name: string) => {
        try {
            const response = await fetch(`https://bucjudzbm9.us-east-1.awsapprunner.com/api/v1/business/menu/categories/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name })
            });
            if (response.ok) {
                // Use functional update
                setCategories(prevCategories =>
                    prevCategories.map(cat => cat.id === id ? { ...cat, category: name } : cat)
                );
                showMessage("Cambios guardados", "success");
            } else {
                showMessage("Error al actualizar", "error");
            }
        } catch (error) {
            console.error('Error updating category:', error);
            showMessage("Error al actualizar", "error");
        }
    };

    const deleteCategory = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar esta categoría? Se eliminarán también sus productos.')) return;
        try {
            const response = await fetch(`https://bucjudzbm9.us-east-1.awsapprunner.com/api/v1/business/menu/categories/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                // Use functional update
                setCategories(prevCategories => prevCategories.filter(cat => cat.id !== id));
                showMessage("Categoría eliminada", "success");
            } else {
                showMessage("Error al eliminar", "error");
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            showMessage("Error al eliminar", "error");
        }
    };

    const toggleCategory = (id: string) => {
        setExpandedCategories(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
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

                <div className="flex flex-col gap-8">
                    {/* Categories List */}
                    {categories.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-gray-100 italic text-gray-400">
                            Aún no has creado ninguna categoría.
                        </div>
                    ) : (
                        categories.map((cat) => (
                            <Card id={`category-${cat.id}`} key={cat.id} className="border-0 shadow-lg rounded-xl bg-white overflow-hidden flex flex-col">
                                {/* Green Header */}
                                <div className="bg-emerald-700 px-6 py-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3 flex-1">
                                        <button
                                            onClick={() => toggleCategory(cat.id)}
                                            className="text-white/90 hover:text-white transition-colors"
                                            title={expandedCategories[cat.id] ? "Colapsar" : "Expandir"}
                                        >
                                            <ChevronDown className={`w-5 h-5 transition-transform ${expandedCategories[cat.id] ? 'rotate-0' : '-rotate-90'}`} />
                                        </button>
                                        <input
                                            id={`cat-input-${cat.id}`}
                                            value={editingValues[cat.id] ?? cat.category}
                                            onChange={(e) => {
                                                setEditingValues({ ...editingValues, [cat.id]: e.target.value });
                                            }}
                                            onBlur={(e) => {
                                                if (e.target.value !== cat.category) {
                                                    updateCategoryName(cat.id, e.target.value);
                                                }
                                            }}
                                            className="bg-transparent border-0 font-extrabold text-white text-xl tracking-tight focus:ring-0 outline-none cursor-pointer hover:bg-white/10 focus:bg-white/10 rounded px-2 -ml-2 transition-colors placeholder-white/50 w-full max-w-md"
                                            placeholder="NOMBRE CATEGORÍA"
                                        />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => document.getElementById(`cat-input-${cat.id}`)?.focus()}
                                            className="text-white/70 hover:text-white transition-colors"
                                            title="Editar nombre"
                                        >
                                            <Edit2 className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => deleteCategory(cat.id)} className="text-white/70 hover:text-white transition-colors">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Card Body: Products List - Collapsible */}
                                {expandedCategories[cat.id] && (
                                    <div className="p-6 space-y-4 bg-gray-50/50">
                                        {cat.products && cat.products.map((product: any) => (
                                            <Link
                                                key={product.id}
                                                href={`/v1/business/menu/products?category=${cat.id}&productId=${product.id}`}
                                                className="block"
                                            >
                                                <div className="bg-white border border-gray-100 rounded-xl p-3 flex items-center gap-4 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-emerald-300">
                                                    {/* Image */}
                                                    <div className="w-20 h-20 shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                                                        {product.image ? (
                                                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                                <Tag className="w-8 h-8" />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Info */}
                                                    <div className="flex-1">
                                                        <h4 className="font-bold text-gray-900 text-lg leading-tight">{product.name}</h4>
                                                        <p className="text-sm text-gray-500 italic mt-1 line-clamp-2">
                                                            {product.description || "Sin descripción"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}

                                        {/* Add Product Button (Dashed) */}
                                        <div className="pt-2">
                                            <Link href={`/v1/business/menu/products?category=${cat.id}`} className="block">
                                                <button className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 font-semibold hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50 transition-all flex items-center justify-center gap-2">
                                                    <PlusCircle className="w-5 h-5" />
                                                    Agregar Producto
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </Card>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}
