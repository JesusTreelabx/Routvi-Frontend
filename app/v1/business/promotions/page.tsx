'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Plus, Tag, Calendar, Edit2, Trash2, X, Save, Percent, Loader2, Megaphone, History } from 'lucide-react';

interface Promotion {
    id: string;
    title: string;
    description: string;
    code: string;
    discount: string;
    expiryDate: string;
    active: boolean;
}

export default function PromotionsPage() {
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        code: '',
        discount: '',
        expiryDate: ''
    });

    useEffect(() => {
        fetchPromotions();
    }, []);

    const fetchPromotions = async () => {
        try {
            const response = await fetch('/api/v1/business/promotions');
            const result = await response.json();
            if (result.data) {
                setPromotions(result.data);
            }
        } catch (error) {
            console.error("Error fetching promotions:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (promo?: Promotion) => {
        if (promo) {
            setEditingId(promo.id);
            setFormData({
                title: promo.title,
                description: promo.description,
                code: promo.code,
                discount: promo.discount,
                expiryDate: promo.expiryDate.split('T')[0]
            });
        } else {
            setEditingId(null);
            setFormData({
                title: '',
                description: '',
                code: '',
                discount: '',
                expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const url = editingId
                ? `/api/v1/business/promotions/${editingId}`
                : '/api/v1/business/promotions';

            const method = editingId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setIsModalOpen(false);
                fetchPromotions();
            } else {
                alert('Error al guardar la promoción');
            }
        } catch (error) {
            console.error("Error saving promotion:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteClick = (id: string) => {
        setDeleteId(id);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;

        try {
            const response = await fetch(`/api/v1/business/promotions/${deleteId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setPromotions(promotions.filter(p => p.id !== deleteId));
                setDeleteId(null);
            }
        } catch (error) {
            console.error("Error deleting promotion:", error);
        }
    };

    const toggleActive = async (promo: Promotion) => {
        try {
            const response = await fetch(`/api/v1/business/promotions/${promo.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ active: !promo.active })
            });

            if (response.ok) {
                setPromotions(promotions.map(p =>
                    p.id === promo.id ? { ...p, active: !p.active } : p
                ));
            }
        } catch (error) {
            console.error("Error toggling status:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header settingsOptions={[
                { label: 'Nueva Promoción', onClick: () => handleOpenModal(), icon: Plus },
                { label: 'Historial', onClick: () => alert('Historial'), icon: History }
            ]} />

            <main className="flex-1 container mx-auto max-w-5xl px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-primary-900 tracking-tight flex items-center gap-3">
                            <Tag className="w-8 h-8 text-primary-600" />
                            Promociones
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Gestiona tus ofertas activas y códigos de descuento.
                        </p>
                    </div>
                    <Button
                        onClick={() => handleOpenModal()}
                        className="bg-primary-600 hover:bg-primary-700 text-white shadow-lg gap-2 px-6 h-12 rounded-xl transition-all active:scale-95"
                    >
                        <Plus className="w-5 h-5" />
                        Crear Promoción
                    </Button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
                    </div>
                ) : promotions.length === 0 ? (
                    <Card className="p-12 border-2 border-dashed border-gray-200 bg-gray-50/50 rounded-3xl flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                            <Megaphone className="w-10 h-10 text-primary-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No hay promociones activas</h3>
                        <p className="text-gray-500 max-w-md mb-6">Create promotional campaigns to attract more customers and boost your sales.</p>
                        <Button onClick={() => handleOpenModal()} variant="outline" className="border-primary-200 text-primary-700 hover:bg-primary-50">
                            Crear mi primera promo
                        </Button>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {promotions.map((promo) => (
                            <Card key={promo.id} className={`p-0 border-0 shadow-lg rounded-2xl bg-white overflow-hidden transition-all hover:shadow-xl ${!promo.active ? 'opacity-75 grayscale-[0.5]' : ''}`}>
                                <div className={`h-2 ${promo.active ? 'bg-gradient-to-r from-primary-500 to-amber-500' : 'bg-gray-300'}`} />
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <Badge className={`${promo.active ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-500'} px-3 py-1`}>
                                            {promo.active ? 'ACTIVA' : 'INACTIVA'}
                                        </Badge>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleOpenModal(promo)} className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDeleteClick(promo.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{promo.title}</h3>
                                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{promo.description}</p>

                                    <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 bg-amber-100 rounded-lg text-amber-700 font-bold font-mono text-sm">
                                                {promo.code}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-gray-400 font-bold uppercase">Código</span>
                                                <span className="text-xs font-bold text-amber-600">{promo.discount} OFF</span>
                                            </div>
                                        </div>
                                        <div className="flex-1 text-right">
                                            <div className="flex items-center justify-end gap-1 text-gray-400 text-xs">
                                                <Calendar className="w-3 h-3" />
                                                <span>Expira: {new Date(promo.expiryDate).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-2">
                                        <label className="flex items-center gap-2 cursor-pointer w-fit">
                                            <div className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" checked={promo.active} onChange={() => toggleActive(promo)} className="sr-only peer" />
                                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-600"></div>
                                            </div>
                                            <span className="text-xs font-medium text-gray-600">
                                                {promo.active ? 'Desactivar promoción' : 'Activar promoción'}
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </main>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <Card className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-gray-900">
                                {editingId ? 'Editar Promoción' : 'Nueva Promoción'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Título de la oferta</label>
                                <Input
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Ej. Descuento de Verano"
                                    required
                                    className="bg-gray-50 border-gray-200"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    className="w-full rounded-xl bg-gray-50 border border-gray-200 p-3 focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                                    placeholder="Detalles de la promoción..."
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Código</label>
                                    <div className="relative">
                                        <Tag className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                        <Input
                                            value={formData.code}
                                            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                            placeholder="VERANO20"
                                            className="pl-9 font-mono uppercase bg-gray-50 border-gray-200"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Descuento</label>
                                    <div className="relative">
                                        <Percent className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                        <Input
                                            value={formData.discount}
                                            onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                                            placeholder="20%"
                                            className="pl-9 bg-gray-50 border-gray-200"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Válido hasta</label>
                                <Input
                                    type="date"
                                    value={formData.expiryDate}
                                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                                    required
                                    className="bg-gray-50 border-gray-200"
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <Button type="button" onClick={() => setIsModalOpen(false)} variant="ghost" className="flex-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100">
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={saving} className="flex-1 bg-primary-600 hover:bg-primary-700 text-white shadow-lg">
                                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                    Guardar Promoción
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <Card className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden p-6 animate-in zoom-in-95 duration-200 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 className="w-8 h-8 text-red-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">¿Eliminar promoción?</h3>
                        <p className="text-gray-500 mb-6">Esta acción no se puede deshacer.</p>
                        <div className="flex gap-3">
                            <Button onClick={() => setDeleteId(null)} variant="ghost" className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700">
                                Cancelar
                            </Button>
                            <Button onClick={confirmDelete} className="flex-1 bg-red-600 hover:bg-red-700 text-white shadow-lg">
                                Eliminar
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
