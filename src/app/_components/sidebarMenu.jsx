// ... (imports do lucide-react continuam iguais)

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
        <header className="sticky top-0 h-screen w-2xs bg-white shadow-md flex flex-col items-center py-4 z-50">
            {/* Logo e cabeçalho... */}
            <div className="flex flex-col w-full gap-1 px-2 pt-24">
                {options.map((option, index) => {
                    const Icon = option.icon;
                    const isActive = activeView === option.label;

                    return (
                        <button
                            key={index}
                            onClick={() => onSelectView(option.label)}
                            className={`flex gap-3 px-6 py-3 rounded-lg w-full cursor-pointer items-center transition-all
                                ${isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            <Icon size={20} className={isActive ? 'text-blue-600' : 'text-slate-400'}/>
                            <span className={`text-sm ${isActive ? 'font-bold' : 'font-medium'}`}>
                                {option.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </header>
    );
}