'use client';

import { useState, useEffect, use } from 'react';
import {
    Plus,
    Trash2,
    ArrowLeft,
    Search,
    Edit2,
    Image as ImageIcon,
    Euro,
    Loader2,
    CheckCircle2,
    Utensils
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import Header from '@/components/layout/Header';

interface Product {
    id: string;
    name: string;
    description: string;
    price: string;
    image: string;
    available: true;
}

export default function CategoryProductsPage({ params }: { params: Promise<{ categoryId: string }> }) {
    const { categoryId } = use(params);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [categoryName, setCategoryName] = useState('');
    const [adding, setAdding] = useState(false);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    // Form state
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: '',
        image: ''
    });

    // Editing state
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Fetch categories to find the current one name
                const catsResponse = await fetch('/api/v1/business/profile');
                const catsData = await catsResponse.json();
                const currentCat = catsData.menu.find((c: any) => c.id === categoryId);

                if (currentCat) {
                    setCategoryName(currentCat.category);
                    setProducts(currentCat.products || []);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
                showMessage("Error al cargar productos", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [categoryId]);

    const showMessage = (text: string, type: 'success' | 'error') => {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), 3000);
    };

    const handleAddProduct = async () => {
        if (!newProduct.name || !newProduct.price) {
            showMessage("Nombre y precio son obligatorios", "error");
            return;
        }
        setAdding(true);
        try {
            const response = await fetch(`/api/v1/business/menu/categories/${categoryId}/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProduct)
            });

            if (response.ok) {
                const result = await response.json();
                setProducts([...products, result.data]);
                setNewProduct({ name: '', description: '', price: '', image: '' });
                showMessage("Producto agregado correctamente", "success");
            } else {
                showMessage("Error al agregar producto", "error");
            }
        } catch (error) {
            showMessage("Error de conexión", "error");
        } finally {
            setAdding(false);
        }
    };

    const handleDeleteProduct = async (productId: string) => {
        if (!confirm('¿Estás seguro de eliminar este producto?')) return;
        try {
            const response = await fetch(`/api/v1/business/menu/products/${productId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setProducts(products.filter(p => p.id !== productId));
                showMessage("Producto eliminado", "success");
            } else {
                showMessage("Error al eliminar producto", "error");
            }
        } catch (error) {
            showMessage("Error de conexión", "error");
        }
    };

    const handleUpdateProduct = async () => {
        if (!editingProduct) return;
        try {
            const response = await fetch(`/api/v1/business/menu/products/${editingProduct.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingProduct)
            });

            if (response.ok) {
                setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
                setEditingProduct(null);
                showMessage("Producto actualizado", "success");
            } else {
                showMessage("Error al actualizar producto", "error");
            }
        } catch (error) {
            showMessage("Error de conexión", "error");
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

            <main className="flex-1 container mx-auto max-w-5xl px-4 py-8">
                <div className="mb-8">
                    <Link href="/v1/business/menu/categories" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors mb-4 group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Volver a Categorías
                    </Link>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <div className="flex items-center gap-2 text-primary-900">
                                <Utensils className="w-8 h-8 opacity-20" />
                                <h1 className="text-3xl font-extrabold tracking-tight">
                                    {categoryName || 'Cargando...'}
                                </h1>
                            </div>
                            <p className="text-gray-600">Gestiona los productos de esta categoría.</p>
                        </div>
                        {message && (
                            <div className={`px-4 py-2 rounded-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                                {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                                <span className="text-sm font-bold">{message.text}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Add/Edit Form */}
                    <div className="lg:col-span-1">
                        <Card className="p-6 border-0 shadow-xl rounded-2xl bg-white sticky top-24">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                {editingProduct ? <Edit2 className="w-5 h-5 text-primary-600" /> : <Plus className="w-5 h-5 text-emerald-600" />}
                                {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                            </h3>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nombre</label>
                                    <Input
                                        placeholder="Ej: Pizza Pepperoni"
                                        value={editingProduct ? editingProduct.name : newProduct.name}
                                        onChange={(e) => editingProduct
                                            ? setEditingProduct({ ...editingProduct, name: e.target.value })
                                            : setNewProduct({ ...newProduct, name: e.target.value })
                                        }
                                        className="bg-gray-50 border-0 rounded-xl"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Descripción</label>
                                    <Input
                                        placeholder="Ingredientes básicos..."
                                        value={editingProduct ? editingProduct.description : newProduct.description}
                                        onChange={(e) => editingProduct
                                            ? setEditingProduct({ ...editingProduct, description: e.target.value })
                                            : setNewProduct({ ...newProduct, description: e.target.value })
                                        }
                                        className="bg-gray-50 border-0 rounded-xl"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Precio</label>
                                        <div className="relative">
                                            <Euro className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                                            <Input
                                                placeholder="0.00"
                                                value={editingProduct ? editingProduct.price : newProduct.price}
                                                onChange={(e) => editingProduct
                                                    ? setEditingProduct({ ...editingProduct, price: e.target.value })
                                                    : setNewProduct({ ...newProduct, price: e.target.value })
                                                }
                                                className="pl-9 bg-gray-50 border-0 rounded-xl"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Imagen URL</label>
                                        <div className="relative">
                                            <ImageIcon className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                                            <Input
                                                placeholder="https://..."
                                                value={editingProduct ? editingProduct.image : newProduct.image}
                                                onChange={(e) => editingProduct
                                                    ? setEditingProduct({ ...editingProduct, image: e.target.value })
                                                    : setNewProduct({ ...newProduct, image: e.target.value })
                                                }
                                                className="pl-9 bg-gray-50 border-0 rounded-xl"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 flex gap-2">
                                    {editingProduct && (
                                        <Button
                                            variant="outline"
                                            onClick={() => setEditingProduct(null)}
                                            className="flex-1 rounded-xl"
                                        >
                                            Cancelar
                                        </Button>
                                    )}
                                    <Button
                                        onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
                                        disabled={adding}
                                        className="flex-1 bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-lg"
                                    >
                                        {adding ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingProduct ? "Guardar" : "Agregar")}
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Products List */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-bold text-gray-900 italic flex items-center gap-2">
                                <Search className="w-5 h-5 text-gray-300" />
                                Lista de Productos
                            </h3>
                            <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                {products.length} ítems
                            </span>
                        </div>

                        {products.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                                <div className="p-4 bg-primary-50 rounded-full inline-block mb-4">
                                    <Utensils className="w-8 h-8 text-primary-300" />
                                </div>
                                <h4 className="text-lg font-bold text-gray-900">Sin productos aún</h4>
                                <p className="text-gray-500 max-w-xs mx-auto mt-2">
                                    Agrega el primer plato a esta categoría usando el formulario.
                                </p>
                            </div>
                        ) : (
                            products.map((product) => (
                                <Card key={product.id} className={`p-4 border-0 shadow-sm hover:shadow-md transition-shadow rounded-2xl bg-white flex gap-4 group ${editingProduct?.id === product.id ? 'ring-2 ring-primary-500 bg-primary-50' : ''}`}>
                                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 relative">
                                        {product.image ? (
                                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                <ImageIcon className="w-8 h-8" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 flex flex-col justify-center">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-lg text-gray-900">{product.name}</h4>
                                            <span className="font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded-lg text-sm">
                                                {product.price}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 line-clamp-2 mt-1 mb-2">
                                            {product.description || "Sin descripción"}
                                        </p>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-8 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg text-xs font-semibold"
                                                onClick={() => setEditingProduct(product)}
                                            >
                                                <Edit2 className="w-3 h-3 mr-1" /> Editar
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-8 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold"
                                                onClick={() => handleDeleteProduct(product.id)}
                                            >
                                                <Trash2 className="w-3 h-3 mr-1" /> Eliminar
                                            </Button>
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
