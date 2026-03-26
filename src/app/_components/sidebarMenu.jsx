'use client'

import { 
  ChevronLeft,
  Home,
  LayoutDashboard, 
  Repeat, 
  Users, 
  TrendingUp, 
  UserCog, 
  ShieldCheck 
} from 'lucide-react';

const options = [
    { label: "Home", icon: Home, href: "/" }, // Adicionado href
    { label: "Visão geral", icon: LayoutDashboard },
    { label: "Fluxo de Rotatividade", icon: Repeat },
    { label: "Gestão de Chefias", icon: Users },
    { label: "Ciclo de Carreira", icon: TrendingUp },
    { label: "Substituições Temporárias", icon: UserCog },
    { label: "Amparo e Seguridade", icon: ShieldCheck },
];
  
export function SidebarMenu({ activeView, onSelectView }) {
    return (
        <header className="sticky top-0 h-screen w-72 bg-white border-r border-slate-100 flex flex-col items-center py-6 z-50">
            {/* Header: Logo e Botão Voltar com link para "/" */}
            <div className="w-full flex flex-row justify-center items-center gap-2 mb-10 px-6">
                <a 
                    href="/" 
                    className="p-2 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group"
                >
                    <ChevronLeft size={24} className="text-slate-400 group-hover:text-emerald-600 transition-colors"/>
                </a>
                <img src="logo-doifs-v1.png" alt="Logo Observatório Doifs" className="w-36 object-contain"/>
            </div>
            
            {/* Itens de Menu */}
            <div className="flex flex-col w-full gap-1 px-4">
                {options.map((option, index) => {
                    const Icon = option.icon;
                    const isActive = activeView === option.label;

                    // Se for o Home, usamos uma tag <a>, caso contrário, o botão de troca de view
                    const isHome = option.label === "Home";

                    const content = (
                        <>
                            <Icon 
                                size={20} 
                                strokeWidth={isActive ? 2.5 : 2}
                                className={`${isActive ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'}`}
                            />
                            <span className={`text-sm ${isActive ? 'font-black tracking-tight' : 'font-medium'}`}>
                                {option.label}
                            </span>
                            {isActive && (
                                <div className="absolute right-4 w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            )}
                        </>
                    );

                    const baseClass = `
                        flex gap-3 px-4 py-3.5 w-full cursor-pointer transition-all duration-200 rounded-2xl
                        items-center group relative
                        ${isActive 
                            ? 'bg-emerald-50 text-emerald-700' 
                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
                    `;

                    return isHome ? (
                        <a key={index} href="/" className={baseClass}>
                            {content}
                        </a>
                    ) : (
                        <button
                            key={index}
                            onClick={() => onSelectView(option.label)}
                            className={baseClass}
                        >
                            {content}
                        </button>
                    );
                })}
            </div>
        </header>
    )
}