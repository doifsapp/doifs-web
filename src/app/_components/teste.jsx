'use client'

import { useState } from 'react';
import Link from 'next/link';
import { 
  Home,
  LayoutDashboard, 
  Repeat, 
  Users, 
  TrendingUp, 
  UserCog, 
  ShieldCheck,
  Menu,
  X
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
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    const handleSelect = (label) => {
        onSelectView(label);
        setIsOpen(false);
    };

    return (
        <>
            {/* --- HEADER MOBILE (Logo esquerda, Hamburguer direita) --- */}
            <header className="lg:hidden fixed top-0 left-0 w-full bg-white/90 backdrop-blur-sm border-b border-slate-100 z-[100] px-4 py-3 flex items-center justify-between shadow-sm">
                <Link href="/" className="transition-transform active:scale-95">
                    <img src="/logo-doifs-v1.png" alt="Logo" className="h-7 w-auto object-contain" />
                </Link>

                <button onClick={toggleMenu} className="p-2 text-slate-600 hover:text-emerald-600">
                    {isOpen ? <X size={26} /> : <Menu size={26} />}
                </button>
            </header>

            {/* OVERLAY */}
            <div 
                className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[105] lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={toggleMenu}
            />

            {/* --- SIDEBAR (Abre da Direita no Mobile) --- */}
            <header className={`
                fixed lg:sticky top-0 right-0 lg:left-0 h-screen bg-white border-l lg:border-r border-slate-100 flex flex-col items-center py-6 z-[110] transition-transform duration-300
                w-72 md:w-80 lg:w-72
                ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
            `}>
                
                <div className="w-full flex flex-row justify-between items-center mb-8 px-6">
                    <button onClick={toggleMenu} className="lg:hidden p-2 text-slate-400 hover:text-emerald-600">
                        <X size={22} />
                    </button>

                    <span className="flex-1 text-center font-black text-slate-400 text-[10px] tracking-[0.2em] uppercase lg:text-left">
                        Painel Analytics
                    </span>

                    <Link href="/" className="hidden lg:flex p-2 hover:bg-slate-50 rounded-xl transition-colors group">
                        <Home size={18} className="text-slate-400 group-hover:text-emerald-500" />
                    </Link>
                </div>

                <div className="w-full flex flex-col gap-1.5 px-4 overflow-y-auto">
                    {options.map((option, index) => {
                        const Icon = option.icon;
                        const isActive = activeView === option.label;
                        const isHome = option.label === "Home";

                        const content = (
                            <>
                                <Icon size={20} className={isActive ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'} />
                                <span className={`text-sm ${isActive ? 'font-black tracking-tight' : 'font-medium'}`}>
                                    {option.label}
                                </span>
                                
                                {/* PONTO INDICADOR DE ATIVO REINTEGRADO */}
                                {isActive && (
                                    <div className="absolute right-4 w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse" />
                                )}
                            </>
                        );

                        const baseClass = `
                            flex gap-3 px-4 py-3.5 w-full cursor-pointer transition-all duration-200 rounded-2xl
                            items-center group relative
                            ${isActive 
                                ? 'bg-emerald-50 text-emerald-700' 
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                            }
                        `;

                        return isHome ? (
                            <Link key={index} href="/" className={baseClass}>{content}</Link>
                        ) : (
                            <button key={index} onClick={() => handleSelect(option.label)} className={baseClass}>
                                {content}
                            </button>
                        );
                    })}
                </div>

                <div className="mt-auto w-full px-6 pt-6 border-t border-slate-50" />
            </header>
        </>
    )
}