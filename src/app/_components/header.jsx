import Link from 'next/link'
import { LayoutGrid } from 'lucide-react';

const options = [
    { label: 'Home', id: '/' },
    { label: 'Serviços', id: '/servicos' },
    { label: 'Contato', id: '/contato' },
    { label: 'Sobre', id: '/sobre' },
];

export function Header() {
    return (
        <header className="w-full flex justify-center bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
            <div className="flex justify-between items-center w-full max-w-5xl px-4 py-4">
                
                {/* Logo - Ajustado para escala correta */}
                <Link href="/" className="transition-transform hover:scale-105 active:scale-95">
                    <img 
                        src="logo-doifs-v1.png" 
                        alt="Logo Doifs" 
                        className="w-[180px] h-auto object-contain" 
                    />
                </Link>

                <nav>
                    <ul className="flex items-center gap-8">
                        {options.map((option, index) => (
                            <li key={index}>
                                <Link
                                    href={option.id}
                                    className="relative text-sm font-semibold text-slate-600 transition-colors hover:text-emerald-600 py-1
                                    before:content-[''] 
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

                        {/* Botão Dashboard Refatorado - Mais discreto e intuitivo */}
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
            </div>
        </header>
    )
}