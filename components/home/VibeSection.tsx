import { Heart, Briefcase, Beer, Coffee } from 'lucide-react';

const VIBES = [
    { id: 'romantico', label: 'Cita Romántica', icon: Heart, color: 'bg-rose-100 text-rose-600' },
    { id: 'godin', label: 'Para el Desempance', icon: Briefcase, color: 'bg-blue-100 text-blue-600' },
    { id: 'fiesta', label: 'Noche de Pub', icon: Beer, color: 'bg-amber-100 text-amber-600' },
    { id: 'trabajo', label: 'Café y Trabajo', icon: Coffee, color: 'bg-emerald-100 text-emerald-600' },
];

export default function VibeSection() {
    return (
        <div className="space-y-4 mb-8">
            <h2 className="text-lg font-bold text-gray-900 px-1">¿Cuál es tu vibe hoy? ✨</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {VIBES.map((vibe) => (
                    <button
                        key={vibe.id}
                        className="flex flex-col items-center justify-center p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group"
                    >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${vibe.color} group-hover:scale-110 transition-transform`}>
                            <vibe.icon className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">{vibe.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
