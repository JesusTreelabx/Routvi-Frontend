import { useState, useEffect } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { Input } from '@/components/ui/Input';

interface HeroSectionProps {
    onSearch: (query: string) => void;
}

const HERO_IMAGES = [
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1981&auto=format&fit=crop", // Pizza/Food
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2000&auto=format&fit=crop", // Coffee
    "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2000&auto=format&fit=crop"  // Cocktails (Vibrant purple/pink ambiance, very stylish)
];

export default function HeroSection({ onSearch }: HeroSectionProps) {
    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % HERO_IMAGES.length);
        }, 5000); // Change image every 5 seconds
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative w-full h-[400px] rounded-b-3xl mb-8 overflow-hidden group">
            {/* Background Carousel */}
            {HERO_IMAGES.map((img, index) => (
                <div
                    key={img}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentImage ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    <img
                        src={img}
                        alt="Hero Background"
                        className="w-full h-full object-cover"
                    />
                    {/* Dark Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-black/50" />
                </div>
            ))}

            {/* Content Overlay */}
            <div className="relative z-10 container mx-auto h-full flex flex-col justify-center items-center px-4 text-center">
                {/* Dynamic Title */}
                <h1 className="text-4xl md:text-5xl font-black mb-3 leading-none tracking-tight uppercase font-[family-name:var(--font-oswald)] text-white drop-shadow-xl">
                    ¿Qué promo descubriremos hoy en <span className="text-primary-400 block sm:inline">Zacatecas?</span>
                </h1>
                <p className="text-gray-200 text-sm md:text-base mb-8 max-w-lg drop-shadow-md">
                    Explora las mejores ofertas en comida, café y diversión nocturna cerca de ti
                </p>

                {/* Search Bar Embedding */}
                <div className="relative w-full max-w-lg shadow-2xl rounded-full transform transition-all hover:scale-105 duration-300">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                        type="text"
                        placeholder="Busca tacos, sushi, pizza..."
                        className="pl-12 h-14 rounded-full border-0 shadow-lg focus:ring-2 focus:ring-primary-500 text-base bg-white/95 backdrop-blur-sm placeholder:text-gray-400 text-gray-900"
                        onChange={(e) => onSearch(e.target.value)}
                    />
                    {/* Quick Map Button */}
                    <button className="absolute inset-y-1 right-1 bg-primary-500 p-2.5 rounded-full text-white hover:bg-primary-600 transition-colors aspect-square h-12 flex items-center justify-center shadow-md">
                        <Navigation className="w-5 h-5" fill="white" />
                    </button>
                </div>
            </div>
        </div>
    );
}
