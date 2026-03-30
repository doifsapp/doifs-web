'use client'

import { useState } from 'react'
import Link from 'next/link'
import { LayoutGrid, Menu, X } from 'lucide-react'

const options = [
    { label: 'Home', id: '/' },
    { label: 'Serviços', id: '/services' },
    { label: 'Contato', id: '/contact' },
    { label: 'Sobre', id: '/about' },
];

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <header className="w-full flex justify-center bg-white/80 backdrop-blur-md sticky top-0 z-[100] border-b border-slate-100">
            <div className="flex justify-between items-center w-full max-w-5xl px-6 py-4">
                
                {/* Logo */}
                <Link href="/" className="transition-transform hover:scale-105 active:scale-95">
                    <img 
                        src="logo-doifs-v1.png" 
                        alt="Logo Doifs" 
                        className="w-[140px] md:w-[180px] h-auto object-contain" 
                    />
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center">
                    <ul className="flex items-center gap-8">
                        {options.map((option, index) => (
                            <li key={index}>
                                <Link
                                    href={option.id}
                                    className="relative text-sm font-semibold text-slate-600 transition-colors hover:text-emerald-600 py-1
                                    before:absolute 
                                    before:bottom-0 
                                    before:left-0 
                                    before:h-[2px] 
                                    before:w-0 
                                    before:bg-emerald-500 
                                    before:transition-all 
                                    before:duration-300 
                                    hover:before:w-full"
                                >
                                    {option.label}
                                </Link>
                            </li>
                        ))}

                        <li>
                            <Link
                                href="/dashboard"
                                className="group relative inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border-2 border-slate-200 text-sm font-bold text-slate-700 transition-all hover:border-emerald-300 hover:text-emerald-700 active:scale-95 hover:shadow-sm"
                            >
                                <LayoutGrid size={18} className="text-slate-400 group-hover:text-emerald-500 transition-colors" />
                                <span>Dashboard</span>
                            </Link>
                        </li>
                    </ul>
                </nav>

                {/* Mobile Menu Button */}
                <button 
                    className="md:hidden p-2 text-slate-600 hover:text-emerald-600 transition-colors focus:outline-none"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Overlay Mobile - Agora com pointer-events para segurança */}
            <div 
                className={`
                    fixed inset-0 w-screen h-screen bg-slate-900/40 backdrop-blur-sm z-[9998] md:hidden transition-all duration-300
                    ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
                `}
                onClick={() => setIsMenuOpen(false)} 
            />

            {/* Menu Lateral (Drawer) - ADICIONADO 'invisible' quando fechado */}
            <div className={`
                fixed top-0 right-0 h-screen w-[280px] bg-white shadow-2xl z-[9999] transform transition-all duration-300 ease-in-out md:hidden
                ${isMenuOpen 
                    ? 'translate-x-0 opacity-100 visible' 
                    : 'translate-x-full opacity-0 invisible'}
            `}>
                <div className="flex flex-col p-8 gap-10">
                    <div className="flex justify-between items-center">
                        <span className="font-black text-slate-400 text-xs tracking-[0.2em]">MENU</span>
                        <button onClick={() => setIsMenuOpen(false)} className="p-1">
                            <X size={24} className="text-slate-400" />
                        </button>
                    </div>

                    <nav>
                        <ul className="flex flex-col gap-6">
                            {options.map((option, index) => (
                                <li key={index} onClick={() => setIsMenuOpen(false)}>
                                    <Link 
                                        href={option.id}
                                        className="text-lg font-bold text-slate-600 hover:text-emerald-600 transition-colors"
                                    >
                                        {option.label}
                                    </Link>
                                </li>
                            ))}
                            <li className="pt-6 border-t border-slate-100" onClick={() => setIsMenuOpen(false)}>
                                <Link
                                    href="/dashboard"
                                    className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-200 active:scale-95 transition-all"
                                >
                                    <LayoutGrid size={20} />
                                    <span>Dashboard</span>
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    )
}