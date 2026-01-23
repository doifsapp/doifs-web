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
  
export function SidebarMenu() {
    return (
        <header className="sticky top-0 h-screen w-2xs bg-white shadow-md flex flex-col items-center py-4 z-50">
            <div className="w-full flex flex-row justify-center items-center gap-4 mt-8 mb-4 p-2">
                <ChevronLeft size={46}/>
                <img src="logo2-doifs.svg" alt="Logo Observatório Doifs" className="w-40"/>
            </div>
            <div className="flex flex-col justify-items-center gap-4 px-2 pt-24">
                
                {options.map((option, index) => {
                    const Icon = option.icon

                    return (
                        <button
                        key={index}
                        className="flex gap-2 px-6 py-2 rounded-sm w-full cursor-pointer hover:bg-blue-100 active:bg-blue-200 items-center">
                            <Icon size={20} color='#76738c'/>
                            <span className="text-cyan-700">{option.label}</span>
                        </button>
                    )
                })}
            </div>
        </header>
    )
}