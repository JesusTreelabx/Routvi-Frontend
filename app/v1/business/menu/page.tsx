'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import {
    LayoutGrid,
    Pizza,
    ArrowRight,
    Loader2
} from 'lucide-react';
import Link from 'next/link';

export default function MenuDashboardPage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ categories: 0, products: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('https://bucjudzbm9.us-east-1.awsapprunner.com/api/v1/business/profile');
                const result = await response.json();

                let productCount = 0;
                if (result.menu && Array.isArray(result.menu)) {
                    result.menu.forEach((cat: any) => {
                        if (cat.products) productCount += cat.products.length;
                    });
                }

                setStats({
                    categories: result.menu?.length || 0,
                    products: productCount
                });
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />

            <main className="flex-1 container mx-auto max-w-4xl px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Gestión de Menú</h1>
                    <p className="text-gray-600 mt-1">Administra las categorías y platillos de tu negocio.</p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Categories Card */}
                        <Link href="/v1/business/menu/categories" className="group">
                            <Card className="p-8 h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl bg-white hover:-translate-y-1 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <LayoutGrid className="w-32 h-32 text-primary-600" />
                                </div>
                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="mb-6 w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600 group-hover:scale-110 transition-transform">
                                        <LayoutGrid className="w-7 h-7" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Categorías</h2>
                                    <p className="text-gray-500 mb-6 flex-1">
                                        Organiza tu menú en secciones como Entradas, Platos Fuertes, Bebidas, etc.
                                    </p>
                                    <div className="flex items-end justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-4xl font-extrabold text-gray-900 tracking-tight">{stats.categories}</span>
                                            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Categorías Activas</span>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-colors">
                                            <ArrowRight className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Link>

                        {/* Products Card */}
                        <Link href="/v1/business/menu/products" className="group">
                            <Card className="p-8 h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl bg-white hover:-translate-y-1 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Pizza className="w-32 h-32 text-emerald-600" />
                                </div>
                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="mb-6 w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                                        <Pizza className="w-7 h-7" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Productos</h2>
                                    <p className="text-gray-500 mb-6 flex-1">
                                        Agrega, edita y gestiona todos los platillos y artículos de venta.
                                    </p>
                                    <div className="flex items-end justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-4xl font-extrabold text-gray-900 tracking-tight">{stats.products}</span>
                                            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Productos en Menú</span>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                            <ArrowRight className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
}
