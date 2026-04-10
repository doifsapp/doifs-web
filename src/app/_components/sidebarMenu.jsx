'use client'

import React, { useRef } from 'react';
import Link from 'next/link';
import {
    Home,
    LayoutDashboard,
    Repeat,
    Users,
    TrendingUp,
    UserCog,
    ShieldCheck,
    ArrowLeft
} from 'lucide-react';

const options = [
    { label: "Home", icon: Home, href: "/" },
    { label: "Visão geral", icon: LayoutDashboard },
    { label: "Fluxo de Rotatividade", icon: Repeat },
    { label: "Gestão de Chefias", icon: Users },
    { label: "Ciclo de Carreira", icon: TrendingUp },
    { label: "Substituições Temporárias", icon: UserCog },
    { label: "Amparo e Seguridade", icon: ShieldCheck },
];

export function SidebarMenu({ activeView, onSelectView }) {
    const scrollRef = useRef(null);

    return (
        <>
            {/* --- HEADER/MENU HORIZONTAL --- */}
            <header className="xl:hidden fixed top-0 left-0 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 z-[100] flex flex-col shadow-sm">
                
                <div className="flex items-center justify-between px-5 py-3 border-b border-slate-50">
                    <Link href="/" className="transition-transform active:scale-95">
                        <img src="/logo-doifs-v1.png" alt="Logo" className="h-6 w-auto object-contain" />
                    </Link>

                    <Link href="/" className="p-2.5 bg-slate-50 text-slate-500 rounded-xl hover:text-emerald-600 active:bg-emerald-50 transition-colors">
                        <Home size={20} />
                    </Link>
                </div>

                <nav
                    ref={scrollRef}
                    className="flex items-center overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth px-4 py-2 gap-2 bg-white"
                >
                    {options.map((option, index) => {
                        const Icon = option.icon;
                        const isActive = activeView === option.label;
                        const isLink = !!option.href;

                        return isLink ? (
                            <Link
                                key={index}
                                href={option.href}
                                className={`
                                    flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap 
                                    snap-center transition-transform active:scale-95
                                    ${isActive
                                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-100'
                                        : 'bg-transparent text-slate-500 hover:bg-slate-50'
                                    }
                                `}
                            >
                                <Icon
                                    size={18}
                                    className={isActive ? 'text-white' : 'text-slate-400'}
                                />
                                <span className={`
                                    text-xs uppercase tracking-wider 
                                    ${isActive ? 'font-black text-white' : 'font-bold text-slate-500'}
                                `}>
                                    {option.label}
                                </span>
                            </Link>
                        ) : (
                            <button
                                key={index}
                                onClick={() => onSelectView(option.label)}
                                className={`
                                    flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap 
                                    snap-center transition-transform active:scale-95
                                    ${isActive
                                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-100'
                                        : 'bg-transparent text-slate-500 hover:bg-slate-50'
                                    }
                                `}
                            >
                                <Icon
                                    size={18}
                                    className={isActive ? 'text-white' : 'text-slate-400'}
                                />
                                <span className={`
                                    text-xs uppercase tracking-wider 
                                    ${isActive ? 'font-black text-white' : 'font-bold text-slate-500'}
                                `}>
                                    {option.label}
                                </span>
                            </button>
                        );
                    })}
                </nav>
            </header>

            {/* --- SIDEBAR LATERAL DESKTOP --- */}
            <header className="hidden xl:flex fixed top-0 left-0 h-screen bg-white border-r border-slate-100 flex-col items-center py-6 z-[110] w-72">
                
                {/* HEADER ALTERADO (seta + logo) */}
                <div className="w-full flex flex-row items-center justify-between mb-8 px-6">
                    
                    {/* Arrow Left */}
                    <Link href="/" className="p-2 hover:bg-slate-50 rounded-xl transition-colors group">
                        <ArrowLeft size={20} className="text-slate-400 group-hover:text-emerald-500" />
                    </Link>

                    {/* Logo */}
                    <img 
                        src="/logo-doifs-v1.png" 
                        alt="Logo Doifs" 
                        className="w-[140px] md:w-[180px] h-auto object-contain"
                    />
                </div>

                {/* MENU (INALTERADO) */}
                <div className="w-full flex flex-col gap-1.5 px-4 overflow-y-auto">
                    {options.map((option, index) => {
                        const Icon = option.icon;
                        const isActive = activeView === option.label;
                        const isLink = !!option.href;

                        return isLink ? (
                            <Link
                                key={index}
                                href={option.href}
                                className={`
                                    flex gap-3 px-4 py-3.5 w-full cursor-pointer transition-all duration-200 rounded-2xl
                                    items-center group relative
                                    ${isActive
                                        ? 'bg-emerald-50 text-emerald-700 font-black'
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium'
                                    }
                                `}
                            >
                                <Icon size={20} className={isActive ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'} />
                                <span className="text-sm">{option.label}</span>
                                {isActive && (
                                    <div className="absolute right-4 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                )}
                            </Link>
                        ) : (
                            <button
                                key={index}
                                onClick={() => onSelectView(option.label)}
                                className={`
                                    flex gap-3 px-4 py-3.5 w-full cursor-pointer transition-all duration-200 rounded-2xl
                                    items-center group relative
                                    ${isActive
                                        ? 'bg-emerald-50 text-emerald-700 font-black'
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium'
                                    }
                                `}
                            >
                                <Icon size={20} className={isActive ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'} />
                                <span className="text-sm">{option.label}</span>
                                {isActive && (
                                    <div className="absolute right-4 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                )}
                            </button>
                        );
                    })}
                </div>

                <div className="mt-auto w-full px-6 pt-6 border-t border-slate-50" />
            </header>
        </>
    );
}