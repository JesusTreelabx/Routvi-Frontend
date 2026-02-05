'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
    Megaphone,
    UploadCloud,
    Loader2,
    CheckCircle2,
    Share2,
    AlertCircle,
    Archive,
    Link2
} from 'lucide-react';

export default function SocialPostsPage() {
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
    const [postContent, setPostContent] = useState('');
    const [posting, setPosting] = useState(false);
    const [posts, setPosts] = useState<any[]>([]);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await fetch('https://bucjudzbm9.us-east-1.awsapprunner.com/api/v1/business/social-posts');
            if (response.ok) {
                const data = await response.json();
                setPosts(data.data || []);
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    const showMessage = (text: string, type: 'success' | 'error') => {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), 3000);
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
                const result = await response.json();
                showMessage("Publicación creada exitosamente", "success");
                setPostContent('');
                // Add new post to top of list
                setPosts([result.data, ...posts]);
            } else {
                showMessage("Error al crear la publicación", "error");
            }
        } catch (error) {
            showMessage("Error de conexión", "error");
        } finally {
            setPosting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header settingsOptions={[
                { label: 'Post Archivados', onClick: () => alert('Archivados'), icon: Archive },
                { label: 'Cuentas Conectadas', onClick: () => alert('Cuentas'), icon: Link2 }
            ]} />

            <main className="flex-1 container mx-auto max-w-2xl px-4 py-8">
                {message && (
                    <div className={`fixed top-24 right-4 z-50 px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in ${message.type === 'success' ? 'bg-amber-500 text-white' : 'bg-rose-600 text-white'}`}>
                        {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        <span className="font-bold">{message.text}</span>
                    </div>
                )}

                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Publicación Social</h1>
                    <p className="text-gray-600 mt-2">Mantén a tus clientes informados con novedades y ofertas rápidas.</p>
                </div>

                <div className="space-y-8">
                    <Card className="p-8 border-0 shadow-xl rounded-3xl bg-white overflow-hidden relative group hover:ring-2 hover:ring-amber-100 transition-all">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 to-orange-500" />

                        <div className="flex items-center justify-center mb-8">
                            <div className="p-4 bg-amber-100 rounded-full">
                                <Megaphone className="w-12 h-12 text-amber-600" />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Mensaje</label>
                                <textarea
                                    value={postContent}
                                    onChange={(e) => setPostContent(e.target.value)}
                                    placeholder="Escribe aquí tu noticia, oferta o mensaje para tus clientes..."
                                    className="w-full h-40 rounded-xl bg-gray-50 border-2 border-transparent focus:border-amber-400 focus:bg-white transition-all p-4 outline-none text-lg font-medium text-gray-800 resize-none hover:bg-gray-100"
                                />
                            </div>

                            <div className="flex gap-2 justify-end">
                                <Button className="h-10 px-4 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg font-semibold transition-colors">
                                    <UploadCloud className="w-4 h-4 mr-2" />
                                    Adjuntar Imagen
                                </Button>
                            </div>

                            <Button
                                onClick={handleCreatePost}
                                disabled={!postContent || posting}
                                className="w-full h-14 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-lg shadow-lg transition-all"
                            >
                                {posting ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                    <span className="flex items-center gap-2 justify-center">
                                        <Share2 className="w-5 h-5" /> Publicar Ahora
                                    </span>
                                )}
                            </Button>
                        </div>
                    </Card>

                    {/* Posts History */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-gray-800 ml-2">Publicaciones Recientes</h3>
                        {posts.length === 0 ? (
                            <div className="text-center py-10 text-gray-400 bg-white rounded-3xl border border-gray-100">
                                <p>No hay publicaciones aún.</p>
                            </div>
                        ) : (
                            posts.map((post) => (
                                <Card key={post.id} className="p-6 border-0 shadow-sm hover:shadow-md transition-all rounded-2xl bg-white">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold uppercase tracking-wide">Post</span>
                                            <span className="text-xs text-gray-400">
                                                {new Date(post.createdAt).toLocaleDateString()} {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 font-medium whitespace-pre-wrap">{post.content}</p>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
