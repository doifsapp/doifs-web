'use client'

import { useState } from "react";
import { Overview } from "../_components/overview";
import { SidebarMenu } from "../_components/sidebarMenu";
import { CardDashboard } from "../_components/cardDashboard";
import { ChartArea } from "../_components/chartArea";
import { ChartLineMultianual } from "../_components/chartBar";
import { ChartBarLabelCustom } from "../_components/chartBarHorizontal";
import { ChartPieRegional } from "../_components/chartPie";
import { ChartStateGroupedBar } from "../_components/chartBarr";

// Configuração dos contextos conforme solicitado
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
    serieB: { label: "Afastamentos", key: "afastamentos" }
  },
  SEGURIDADE: {
    label: "Amparo e Seguridade",
    serieA: { label: "Pensões", key: "pensoes"},
    serieB: { label: "Aposentadorias", key: "aposentadorias" }
  }
};

export default function Dashboard() {
    const [activeView, setActiveView] = useState("Visão geral");

    // Encontra o contexto correspondente à label selecionada no Sidebar
    const currentContext = Object.values(DASHBOARD_CONTEXTS).find(
        (ctx) => ctx.label === activeView
    );

    return (
        <section className="bg-violet-50 min-h-screen flex flex-row font-sans">
            <SidebarMenu activeView={activeView} onSelectView={setActiveView} />
            
            <div className="flex-1 flex flex-col items-center overflow-x-hidden">
                <div className="max-w-6xl w-full px-4 py-8">
                    
                    {activeView === "Visão geral" ? (
                        <Overview />
                    ) : (
                        <div className="flex flex-col gap-8">
                            {/* Passamos o 'context' para todos os componentes. 
                                Cada gráfico usará context.serieA e context.serieB para o seu fetch individual. */}
                            <CardDashboard context={currentContext} />
                            
                            <div className="pt-4">
                                <ChartArea context={currentContext} />
                            </div>

                            <div className="pt-4">
                                <ChartLineMultianual context={currentContext} />
                            </div>

                            <div className="pt-4">
                                <ChartBarLabelCustom context={currentContext} />
                            </div>

                            <div className="pt-4 ">
                                <ChartPieRegional context={currentContext} />
                            </div>

                            <div className="pt-4 ">
                                <ChartStateGroupedBar context={currentContext} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}