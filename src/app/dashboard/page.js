'use client'

import { useState } from "react";
import { Overview } from "../_components/overview";
import { SidebarMenu } from "../_components/sidebarMenu";
import { CardDashboard } from "../_components/cardDashboard";
import { ChartArea } from "../_components/chartArea";
import { ChartLineMultianual } from "../_components/chartBar";
import { ChartBarLabelCustom } from "../_components/chartBarHorizontal";
import { ChartPieRegional } from "../_components/chartPie";
import { ChartBarState } from "../_components/chartBarr"; //ChartBarState

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

    const getContext = () => {
        if (activeView === "Fluxo de Rotatividade") return DASHBOARD_CONTEXTS.ROTATIVIDADE;
        if (activeView === "Gestão de Chefias") return DASHBOARD_CONTEXTS.CHEFIAS;
        if (activeView === "Ciclo de Carreira") return DASHBOARD_CONTEXTS.CARREIRA;
        if (activeView === "Substituições Temporárias") return DASHBOARD_CONTEXTS.TEMPORARIOS;
        if (activeView === "Amparo e Seguridade") return DASHBOARD_CONTEXTS.SEGURIDADE;
        return DASHBOARD_CONTEXTS.ROTATIVIDADE;
    };

    const currentContext = getContext();

    return (
        <section className="flex min-h-screen bg-slate-50/50">
            <SidebarMenu activeView={activeView} onSelectView={setActiveView} />

            {/* Container Principal com Scroll */}
            <div className="flex-1 h-screen overflow-y-auto">
                {/* A largura é controlada aqui: 
                   - max-w-[1400px]: Garante que em telas ultra-wide os gráficos não fiquem esticados demais.
                   - mx-auto: Centraliza o bloco.
                   - w-full: Garante que ocupe tudo até o limite do max-w.
                */}
                <div className="max-w-[1400px] mx-auto w-full p-8 pt-10">
                    
                    {/* VISÃO GERAL */}
                    <div className={activeView === "Visão geral" ? "block" : "hidden"}>
                        <Overview />
                    </div>

                    {/* DEMAIS VISUALIZAÇÕES */}
                    <div className={activeView !== "Visão geral" ? "block" : "hidden"}>
                        <div className="flex flex-col gap-8">
                            <CardDashboard context={currentContext} />
                            <ChartArea context={currentContext} />
                            <ChartLineMultianual context={currentContext} />
                            <ChartBarLabelCustom context={currentContext} />
                            <ChartPieRegional context={currentContext} />
                            <ChartBarState context={currentContext} />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}