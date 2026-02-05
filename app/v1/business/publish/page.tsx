'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
    UploadCloud,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Globe,
    History,
    ExternalLink
} from 'lucide-react';

export default function PublishPage() {
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
    const [publishing, setPublishing] = useState(false);
    const [lastPublished, setLastPublished] = useState<string | null>(null);

    const showMessage = (text: string, type: 'success' | 'error') => {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), 3000);
    };

    const handlePublishSite = async () => {
        setPublishing(true);
        try {
            const response = await fetch('https://bucjudzbm9.us-east-1.awsapprunner.com/api/v1/business/publish', {
                method: 'POST'
            });

            if (response.ok) {
                const now = new Date().toLocaleTimeString();
                setLastPublished(now);
                showMessage("Sitio publicado y actualizado", "success");
            } else {
                showMessage("Error al intentar publicar", "error");
            }
        } catch (error) {
            showMessage("Error de conexión", "error");
        } finally {
            setPublishing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header settingsOptions={[
                { label: 'Ver Sitio en Vivo', onClick: () => alert('Ver Sitio'), icon: ExternalLink },
                { label: 'Historial de Cambios', onClick: () => alert('Historial'), icon: History }
            ]} />

            <main className="flex-1 container mx-auto max-w-2xl px-4 py-8">
                {message && (
                    <div className={`fixed top-24 right-4 z-50 px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in ${message.type === 'success' ? 'bg-indigo-600 text-white' : 'bg-rose-600 text-white'}`}>
                        {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        <span className="font-bold">{message.text}</span>
                    </div>
                )}

                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Publicar Sitio</h1>
                    <p className="text-gray-600 mt-2">Haz visibles todos tus cambios para tus clientes.</p>
                </div>

                <Card className="p-10 border-0 shadow-2xl rounded-3xl bg-white overflow-hidden relative group">
                    <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-indigo-500 to-violet-600" />

                    <div className="flex flex-col items-center justify-center mb-8">
                        <div className={`p-6 rounded-full mb-6 transition-all duration-700 ${publishing ? 'bg-indigo-50 scale-110' : 'bg-indigo-100'}`}>
                            {publishing ? (
                                <Loader2 className="w-16 h-16 text-indigo-600 animate-spin" />
                            ) : (
                                <Globe className="w-16 h-16 text-indigo-600" />
                            )}
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900">
                            {publishing ? 'Publicando cambios...' : 'Tu sitio está listo'}
                        </h2>
                        <p className="text-gray-500 mt-2 text-center max-w-md">
                            Al publicar, todos los cambios recientes en el menú, categorías y perfil se harán visibles inmediatamente en internet.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <Button
                            onClick={handlePublishSite}
                            disabled={publishing}
                            className={`w-full h-16 text-white rounded-2xl font-bold text-xl shadow-xl transition-all active:scale-95 ${publishing ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-2xl hover:-translate-y-1'}`}
                        >
                            {publishing ? "Procesando..." : "PUBLICAR AHORA"}
                        </Button>

                        {lastPublished && (
                            <div className="text-center animate-in fade-in">
                                <p className="text-sm font-medium text-emerald-600 flex items-center justify-center gap-2">
                                    <CheckCircle2 className="w-4 h-4" />
                                    Última publicación exitosa: {lastPublished}
                                </p>
                            </div>
                        )}
                    </div>
                </Card>
            </main>
        </div>
    );
}
