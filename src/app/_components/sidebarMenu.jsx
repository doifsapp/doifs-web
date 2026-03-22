import { 
  ChevronLeft,
  LayoutDashboard, 
  Repeat, 
  Users, 
  TrendingUp, 
  UserCog, 
  ShieldCheck 
} from 'lucide-react';

const options = [
    { label: "Visão geral", icon: LayoutDashboard },
    { label: "Fluxo de Rotatividade", icon: Repeat },
    { label: "Gestão de Chefias", icon: Users },
    { label: "Ciclo de Carreira", icon: TrendingUp },
    { label: "Substituições Temporárias", icon: UserCog },
    { label: "Amparo e Seguridade", icon: ShieldCheck },
];
  
export function SidebarMenu({ activeView, onSelectView }) {
    return (
        <header className="sticky top-0 h-screen w-72 bg-white border-r border-slate-200 flex flex-col items-center py-4 z-50">
            <div className="w-full flex flex-row justify-center items-center gap-4 mt-8 mb-4 p-2">
                <ChevronLeft size={46} className="cursor-pointer hover:text-blue-600 transition-colors"/>
                <img src="logo-doifs-v1.png" alt="Logo Observatório Doifs" className="w-40"/>
            </div>
            
            <div className="flex flex-col w-full gap-2 px-0 pt-24">
                {options.map((option, index) => {
                    const Icon = option.icon;
                    const isActive = activeView === option.label;

                    return (
                        <button
                            key={index}
                            onClick={() => onSelectView(option.label)}
                            className={`
                                flex gap-3 px-6 py-3 w-full cursor-pointer transition-all relative
                                items-center group
                                ${isActive 
                                    ? 'bg-blue-50 text-blue-700 font-medium' 
                                    : 'text-slate-500 hover:bg-slate-50'}
                            `}
                        >
                            {/* Indicador visual lateral para o item ativo */}
                            {isActive && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-md" />
                            )}

                            <Icon 
                                size={20} 
                                className={isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}
                            />
                            <span className="text-sm">{option.label}</span>
                        </button>
                    )
                })}
            </div>
        </header>
    )
}