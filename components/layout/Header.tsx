'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, User, Menu, X, Settings } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface HeaderProps {
    settingsOptions?: { label: string, onClick: () => void, icon?: any }[];
}

export default function Header({ settingsOptions }: HeaderProps) {
    const [showMenu, setShowMenu] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">

                {/* Left Side: Settings + Logo */}
                <div className="flex items-center gap-4">
                    {/* Context Settings Button */}
                    {settingsOptions && settingsOptions.length > 0 && (
                        <div className="relative">
                            <button
                                onClick={() => setShowMenu(!showMenu)}
                                className="w-10 h-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full flex items-center justify-center shadow-md transition-all active:scale-95"
                            >
                                {showMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>

                            {/* Dropdown Menu */}
                            {showMenu && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setShowMenu(false)}
                                    />
                                    <div className="absolute left-0 top-12 w-56 bg-white rounded-xl shadow-xl border border-gray-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                                        {settingsOptions.map((opt, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => {
                                                    opt.onClick();
                                                    setShowMenu(false);
                                                }}
                                                className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium text-sm flex items-center gap-3 transition-colors"
                                            >
                                                {opt.icon && <opt.icon className="w-4 h-4 text-gray-500" />}
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="bg-primary-500 text-white p-2 rounded-lg shadow-sm hover:bg-primary-600 transition-colors">
                            <span className="font-bold text-2xl tracking-tight px-1 block leading-none pb-0.5">Routvi</span>
                        </div>
                    </Link>
                </div>

                {/* Right Side: Actions */}
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" className="text-gray-600">
                        <ShoppingBag className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-gray-600">
                        <User className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </header>
    );
}
