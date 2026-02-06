'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Edit2,
    Trash2,
    Image as ImageIcon,
    Loader2,
    CheckCircle2,
    XCircle,
    Upload,
    Download
} from 'lucide-react';

export default function ProductsPage() {
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<any[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Create/Edit State
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        imageUrl: '',
        categoryId: ''
    });
    const [submitting, setSubmitting] = useState(false);

    // Fetch initial data
    // Fetch initial data
    const fetchData = async () => {
        setLoading(true);
        try {
            const [catsRes, prodsRes] = await Promise.all([
                fetch('https://bucjudzbm9.us-east-1.awsapprunner.com/api/v1/business/menu/categories'),
                fetch('https://bucjudzbm9.us-east-1.awsapprunner.com/api/v1/business/menu/products')
            ]);

            const cats = await catsRes.json();
            const prods = await prodsRes.json();

            if (Array.isArray(cats)) {
                const catsWithProducts = cats.map((cat: any) => ({
                    ...cat,
                    id: cat.ID || cat.id, // Ensure consistent ID property
                    category: cat.name || 'Sin nombre',
                    products: Array.isArray(prods)
                        ? prods.filter((p: any) => p.category_id === cat.ID || p.categoryId === cat.ID).map((p: any) => ({
                            ...p,
                            id: p.ID || p.id, // Normalize product ID too
                            available: p.is_available !== undefined ? p.is_available : true
                        }))
                        : []
                }));
                setCategories(catsWithProducts);
            } else {
                console.error('Categories response is not an array:', cats);
                setCategories([]);
            }
        } catch (error) {
            console.error("Error fetching menu:", error);
            setCategories([]);
        } finally {
            // Always set loading to false
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Filter logic
    useEffect(() => {
        let prods: any[] = [];
        categories.forEach(cat => {
            cat.products.forEach((p: any) => {
                prods.push({ ...p, categoryName: cat.category, categoryId: cat.id });
            });
        });

        if (selectedCategory !== 'all') {
            prods = prods.filter(p => p.categoryId === selectedCategory);
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            prods = prods.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.description.toLowerCase().includes(query)
            );
        }

        setFilteredProducts(prods);
    }, [categories, selectedCategory, searchQuery]);

    // Auto-scroll to product if productId is in URL
    useEffect(() => {
        // Use window.location instead of useSearchParams to avoid Suspense requirement
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const productId = params.get('productId');
            if (productId && filteredProducts.length > 0) {
                setTimeout(() => {
                    const element = document.getElementById(`product-${productId}`);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        // Add a brief highlight effect
                        element.classList.add('ring-2', 'ring-emerald-500', 'ring-offset-2');
                        setTimeout(() => {
                            element.classList.remove('ring-2', 'ring-emerald-500', 'ring-offset-2');
                        }, 2000);
                    }
                }, 500); // Small delay to ensure DOM is ready
            }
        }
    }, [filteredProducts]);

    // Actions
    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const response = await fetch('https://bucjudzbm9.us-east-1.awsapprunner.com/api/v1/business/menu/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    categoryId: formData.categoryId,
                    name: formData.name,
                    description: formData.description,
                    price: formData.price,
                    image: formData.imageUrl
                })
            });

            if (response.ok) {
                await fetchData();
                setIsCreateModalOpen(false);
                resetForm();
            } else {
                console.error('Failed to create product:', await response.text());
                alert('Error al crear el producto');
            }
        } catch (error) {
            console.error("Error creating product:", error);
            alert('Error al crear el producto');
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingProduct) return;
        setSubmitting(true);

        try {
            const response = await fetch(`https://bucjudzbm9.us-east-1.awsapprunner.com/api/v1/business/menu/products/${editingProduct.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    description: formData.description,
                    price: formData.price,
                    image: formData.imageUrl
                })
            });

            if (response.ok) {
                await fetchData();
                setEditingProduct(null);
                setIsCreateModalOpen(false);
                resetForm();
            } else {
                console.error('Failed to update product:', await response.text());
                alert('Error al actualizar el producto');
            }
        } catch (error) {
            console.error("Error updating product:", error);
            alert('Error al actualizar el producto');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (productId: string) => {
        if (!confirm('¿Estás seguro de eliminar este producto?')) return;

        try {
            const response = await fetch(`https://bucjudzbm9.us-east-1.awsapprunner.com/api/v1/business/menu/products/${productId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                await fetchData();
            } else {
                console.error('Failed to delete product:', await response.text());
                alert('Error al eliminar el producto');
            }
        } catch (error) {
            console.error("Error deleting product:", error);
            alert('Error al eliminar el producto');
        }
    };

    const handleToggleAvailability = async (product: any) => {
        try {
            // Optimistic update - update both states
            const newAvailability = !product.available;

            // Update categories state (main source of truth)
            setCategories(prevCategories =>
                prevCategories.map(cat => ({
                    ...cat,
                    products: cat.products.map((p: any) =>
                        p.id === product.id ? { ...p, available: newAvailability } : p
                    )
                }))
            );

            const response = await fetch(`https://bucjudzbm9.us-east-1.awsapprunner.com/api/v1/business/menu/products/${product.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    is_available: newAvailability
                })
            });

            if (!response.ok) {
                // Revert if failed
                console.error('Failed to toggle availability:', await response.text());
                await fetchData();
            }
        } catch (error) {
            console.error("Error toggling availability:", error);
            // Revert on error
            await fetchData();
        }
    };

    const openCreateModal = () => {
        resetForm();
        setEditingProduct(null);

        let defaultCategoryId = '';
        if (selectedCategory !== 'all') {
            defaultCategoryId = selectedCategory;
        } else if (categories.length > 0) {
            defaultCategoryId = categories[0].id;
        }

        if (defaultCategoryId) {
            setFormData(prev => ({ ...prev, categoryId: defaultCategoryId }));
        }
        setIsCreateModalOpen(true);
    };

    const openEditModal = (product: any) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description || '',
            price: product.price,
            imageUrl: product.image || '',
            categoryId: product.categoryId
        });
        setIsCreateModalOpen(true);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            price: '',
            imageUrl: '',
            categoryId: ''
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header settingsOptions={[
                { label: 'Importar CSV', onClick: () => alert('Importar'), icon: Upload },
                { label: 'Exportar Menú', onClick: () => alert('Exportar'), icon: Download },
                { label: 'Edición Masiva', onClick: () => alert('Bulk Edit'), icon: Edit2 }
            ]} />

            <main className="flex-1 container mx-auto max-w-6xl px-4 py-8">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Productos</h1>
                        <p className="text-gray-600 mt-1">Administra el catálogo de productos de tu menú.</p>
                    </div>
                    <Button onClick={openCreateModal} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg gap-2 px-6 h-12 rounded-xl">
                        <Plus className="w-5 h-5" /> Nuevo Producto
                    </Button>
                </div>

                {/* Filters and Search */}
                <Card className="p-4 mb-8 border border-gray-200 border-t-4 border-t-emerald-500 shadow-lg rounded-2xl bg-white flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Buscar producto..."
                            className="w-full pl-10 h-10 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">Filtrar por Categoría:</span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setSelectedCategory('all')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedCategory === 'all' ? 'bg-emerald-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                Todos
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${selectedCategory === cat.id ? 'bg-emerald-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                >
                                    {cat.category}
                                </button>
                            ))}
                        </div>
                    </div>
                </Card>

                {/* Products Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">No se encontraron productos</h3>
                        <p className="text-gray-500">Prueba cambiando los filtros o agrega uno nuevo.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map(product => (
                            <Card id={`product-${product.id}`} key={product.id} className="group isolate overflow-hidden border border-gray-200 border-t-4 border-t-emerald-500 shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl bg-white flex flex-col h-full">
                                <div className="relative h-48 bg-gray-200 overflow-hidden rounded-t-xl">
                                    {product.image ? (
                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300">
                                            <ImageIcon className="w-12 h-12" />
                                        </div>
                                    )}
                                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
                                        <button onClick={() => openEditModal(product)} className="p-2 bg-white/90 backdrop-blur rounded-full shadow-sm hover:bg-emerald-50 text-emerald-600 hover:scale-110 transition-all">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(product.id)} className="p-2 bg-white/90 backdrop-blur rounded-full shadow-sm hover:bg-red-50 text-red-500 hover:scale-110 transition-all">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="absolute top-3 left-3">
                                        <Badge className="bg-emerald-600 text-white shadow-md text-xs font-bold border-0 px-3 py-1">
                                            {product.categoryName}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-1">{product.name}</h3>
                                        <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg text-sm">${product.price}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1">{product.description || "Sin descripción"}</p>

                                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                                        <button
                                            onClick={() => handleToggleAvailability(product)}
                                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${product.available ? 'bg-emerald-600' : 'bg-gray-200'}`}
                                        >
                                            <span className="sr-only">Toggle availability</span>
                                            <span
                                                className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${product.available ? 'translate-x-5' : 'translate-x-1'}`}
                                            />
                                        </button>
                                        <span className={`text-xs font-bold ${product.available ? 'text-emerald-600' : 'text-gray-400'}`}>
                                            {product.available ? 'Disponible' : 'Agotado'}
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </main>

            {/* Modal for Create/Edit */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
                    <Card className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 animate-in zoom-in-95 duration-200 border border-gray-200 border-t-4 border-t-primary-500">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h2>
                            <button onClick={() => setIsCreateModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={editingProduct ? handleUpdate : handleCreate} className="space-y-4">
                            {!editingProduct && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Categoría</label>
                                    <select
                                        required
                                        value={formData.categoryId}
                                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                        className="w-full h-12 rounded-xl bg-gray-50 border-0 px-4 focus:ring-2 focus:ring-primary-500 outline-none"
                                    >
                                        <option value="" disabled>Selecciona una categoría</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.category}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre</label>
                                <Input
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Ej. Pizza Pepperoni"
                                    className="h-12 bg-gray-50"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Precio</label>
                                    <Input
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        placeholder="$0"
                                        className="h-12 bg-gray-50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">URL Imagen</label>
                                    <Input
                                        value={formData.imageUrl}
                                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                        placeholder="https://..."
                                        className="h-12 bg-gray-50"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
                                <textarea
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full rounded-xl bg-gray-50 border-0 p-4 focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                                    placeholder="Descripción del producto..."
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <Button type="button" onClick={() => setIsCreateModalOpen(false)} className="flex-1 h-12 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl border-0">
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={submitting} className="flex-1 h-12 bg-primary-600 text-white hover:bg-primary-700 rounded-xl shadow-lg">
                                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingProduct ? 'Guardar Cambios' : 'Crear Producto')}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
}
