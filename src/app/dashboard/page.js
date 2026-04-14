'use client'

import { useState } from "react";
import { Overview } from "../_components/overview";
import { SidebarMenu } from "../_components/sidebarMenu";
import { CardDashboard } from "../_components/cardDashboard";
import { ChartArea } from "../_components/chartArea";
import { ChartLineMultianual } from "../_components/chartBar";
import { ChartBarLabelCustom } from "../_components/chartBarHorizontal";
import { ChartPieRegional } from "../_components/chartPie";
import { ChartBarState } from "../_components/chartBarr";

const DASHBOARD_CONTEXTS = {
  ROTATIVIDADE: {
    label: "Fluxo de Rotatividade",
    serieA: { label: "Nomeações", key: "nomeacoes" },
    serieB: { label: "Exonerações", key: "exoneracoes" }
  },
  CHEFIAS: {
    label: "Gestão de Chefias",
    serieA: { label: "Designações", key: "designacoes" },
    serieB: { label: "Dispensas", key: "dispensas"}
  },
  CARREIRA: {
    label: "Ciclo de Carreira",
    serieA: { label: "Aposentadorias", key: "aposentadorias" },
    serieB: { label: "Demissões", key: "demissoes" }
  },
  TEMPORARIOS: {
    label: "Substituições Temporárias",
    serieA: { label: "Substituições", key: "substituicoes" },
    serieB: { label: "Interrupções", key: "interrupcoes" }
  },
  SEGURIDADE: {
    label: "Amparo e Seguridade",
    serieA: { label: "Pensões", key: "pensoes" },
    serieB: { label: "Aposentadorias", key: "aposentadorias" }
  }
};

export default function Dashboard() {
    const [activeView, setActiveView] = useState("Visão geral");

    const getContext = (label) => {
        return Object.values(DASHBOARD_CONTEXTS).find(c => c.label === label) || DASHBOARD_CONTEXTS.ROTATIVIDADE;
    };

    const currentContext = getContext(activeView);

    return (
        // AJUSTE: flex-col no mobile para o Header fixo e conteúdo rolarem corretamente
        <section className="flex flex-col lg:flex-row min-h-screen bg-slate-50 overflow-hidden">
            
            <SidebarMenu activeView={activeView} onSelectView={setActiveView} />

            {/* Painel Principal com Scroll */}
            {/* AJUSTE: pt-16 no mobile para dar espaço ao Header fixo que criamos na Sidebar */}
            <div className="flex-1 w-full pt-32 lg:pt-0 xl:ml-72 transition-all duration-300 ">
                
                {/* AJUSTE: p-4 no mobile, p-8/pt-10 no desktop */}
                <div className="max-w-[1400px] mx-auto w-full p-4 md:p-8 lg:pt-10">           

                    {/* VISÃO GERAL */}
                    <div className={activeView === "Visão geral" ? "block animate-in fade-in slide-in-from-bottom-4 duration-500" : "hidden"}>
                        <Overview />
                    </div>

                    {/* DEMAIS VISUALIZAÇÕES (Gráficos) */}
                    <div className={activeView !== "Visão geral" ? "block" : "hidden"}>
                        {/* AJUSTE: Gap menor no mobile (gap-4) e maior no desktop (gap-8) */}
                        <div className="flex flex-col gap-4 md:gap-8 max-w-7xl mx-auto pb-10 lg:pt-24 xl:pt-0 xl:pb-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            
                            {/* Os cards de KPI agora precisam ser responsivos internamente */}
                            <CardDashboard context={currentContext} />
                            
                            {/* Grid de Gráficos: 1 coluna mobile, 2 colunas desktop onde couber */}
                            <div className="grid grid-cols-1 gap-4 md:gap-8">
                                <ChartArea context={currentContext} />
                                
                                <div className="grid grid-cols-1 gap-4 md:gap-8">
                                    <ChartLineMultianual context={currentContext} />
                                    <ChartBarLabelCustom context={currentContext} />
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-[1fr,1.5fr] gap-4 md:gap-8">
                                    <ChartPieRegional context={currentContext} />
                                    <ChartBarState context={currentContext} />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}