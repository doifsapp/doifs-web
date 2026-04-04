'use client'

import axios from "axios";
import { TrendingUp, Info, TrendingDown, Sigma, Clock3, ChevronLeft } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

// --- Sub-componente: Stat Card Padronizado ---
const StatCard = ({ title, value, description, date, Icon, iconColor, bgColor, textColor }) => {
    const bgClass = bgColor || "bg-white";
    const borderClass = bgColor ? "border-emerald-700" : "border-slate-100";
    const titleColorClass = textColor ? "text-emerald-100" : "text-slate-400";
    const valueColorClass = textColor ? "text-white" : "text-slate-800";
    const descColorClass = textColor ? "text-emerald-50" : "text-slate-400";
    const dateColorClass = textColor ? "text-white bg-emerald-700" : "text-emerald-600 bg-emerald-50";

    return (
        <div className={`${bgClass} p-5 rounded-2xl border ${borderClass} shadow-sm flex flex-row items-center justify-between h-[100px] sm:h-[120px] hover:shadow-md transition-all group overflow-hidden`}>
            <div className="flex-1 flex flex-col justify-between h-full pr-3 min-w-0">
                <div>
                    <p className={`${titleColorClass} text-[10px] sm:text-[11px] font-bold uppercase tracking-wider mb-1 truncate`}>
                        {title}
                    </p>
                    <h3 className={`font-medium tracking-tighter ${valueColorClass} ${typeof value === 'string' && value.length > 8 ? 'text-xl' : 'text-2xl sm:text-3xl'} truncate`}>
                        {typeof value === 'number' ? value.toLocaleString() : value || '---'}
                    </h3>
                </div>
                <div className="flex flex-col gap-0.5 mt-auto">
                    <p className={`text-[10px] ${descColorClass} italic truncate`}>{description}</p>
                </div>
            </div>

            <div className="group-hover:scale-105 transition-transform flex items-center justify-center flex-shrink-0 ml-1">
                <div className={`w-[44px] h-[44px] sm:w-[50px] sm:h-[50px] rounded-full flex items-center justify-center ${textColor ? 'bg-emerald-700' : 'bg-slate-50 border border-slate-100'}`}>
                    <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${iconColor || 'text-slate-400'}`} strokeWidth={textColor ? 3 : 2} />
                </div>
            </div>
        </div>
    );
};

export function CardDashboard({ context }) {
    const [data, setData] = useState(null);
    const [mounted, setMounted] = useState(false);
    
    // Estados para o Carrossel
    const [showHelp, setShowHelp] = useState(true);
    const scrollContainerRef = useRef(null);

    const historicKeyMap = {
        'nomeacoes': 'total_nomeação',
        'exoneracoes': 'total_exoneração',
        'designacoes': 'total_designação',
        'dispensas': 'total_dispensa',
        'aposentadorias': 'total_aposentadoria',
        'demissoes': 'total_demissão',
        'substituicoes': 'total_substituição',
        'afastamentos': 'total_afastamento',
        'pensoes': 'total_pensão'
    };

    const normalize = (str) => {
        if (!str) return "";
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    };

    useEffect(() => {
        setMounted(true);
        const getTotals = async () => {
            try {
                const response = await axios.get('/api/dashboard/totals');
                setData(response.data);
            } catch (error) {
                console.error("Erro ao buscar totais:", error);
            }
        };
        getTotals();
    }, []);

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const scrollLeft = scrollContainerRef.current.scrollLeft;
            setShowHelp(scrollLeft <= 10);
        }
    };

    if (!mounted || !data || !context) {
        return (
            <div className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-[120px] bg-slate-50 rounded-2xl border border-slate-100" />
                    ))}
                </div>
            </div>
        );
    }

    const { types_counts, latest_pubs, count_by_type_all_time } = data;

    const filteredPubs = (latest_pubs || []).filter((pub) => {
        const typeNorm = normalize(pub.type);
        const labelANorm = normalize(context.serieA.label);
        const labelBNorm = normalize(context.serieB.label);
        return labelANorm.startsWith(typeNorm.substring(0, 5)) ||
            labelBNorm.startsWith(typeNorm.substring(0, 5));
    });

    const latest = filteredPubs.length > 0 ? filteredPubs[0] : null;
    const keyA_historic = historicKeyMap[context.serieA.key];
    const keyB_historic = historicKeyMap[context.serieB.key];
    const total_geral = (count_by_type_all_time[keyA_historic] || 0) + (count_by_type_all_time[keyB_historic] || 0);

    return (
        <div className="w-full">
            {/* Cabeçalho */}
            <div className="flex items-center gap-3 mb-6 sm:mb-10 border-b border-slate-100 pb-5">
                <TrendingUp size={24} className="text-emerald-600" />
                <h1 className="text-xl sm:text-2xl font-black tracking-tighter text-slate-900">
                    {context.label}
                </h1>
                <span className="hidden sm:flex bg-emerald-50 text-emerald-700 text-[11px] font-bold px-3 py-1 rounded-full border border-emerald-100 ml-auto items-center gap-1.5">
                    <Info size={14} />
                    Volume histórico: {total_geral.toLocaleString()} registros
                </span>
            </div>

            <div className="flex flex-col gap-4">
                {/* 1. Card Histórico Total - Fixo acima no Mobile */}
                <div className="lg:hidden">
                    <StatCard
                        title="Histórico Total"
                        value={total_geral}
                        description="Registros consolidados desde 2018"
                        Icon={Sigma}
                        iconColor="text-white"
                        bgColor="bg-emerald-600"
                        textColor="text-white"
                    />
                </div>

                <div className="relative">
                    {/* Ícone de Ajuda (Apenas Mobile) */}
                    <div className={`
                        absolute left-[-4px] top-0 bottom-0 w-12 z-20 flex items-center justify-center lg:hidden pointer-events-none 
                        transition-all duration-300
                        ${showHelp ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}
                    `}>
                        <div className="bg-white shadow-xl w-10 h-10 rounded-full flex justify-center items-center border border-slate-100 text-emerald-600">
                            <ChevronLeft size={24} />
                        </div>
                    </div>

                    {/* Container do Carrossel / Grid Desktop */}
                    <div 
                        ref={scrollContainerRef}
                        onScroll={handleScroll}
                        className="flex items-center overflow-x-auto pb-4 gap-4 snap-x snap-mandatory scrollbar-hide lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0 pl-8 lg:pl-0"
                    >
                        {/* Card Série A */}
                        <div className="min-w-[calc(50%-8px)] snap-center lg:min-w-full">
                            <StatCard
                                title={`TOTAL ${context.serieA.label}`}
                                value={types_counts[context.serieA.key] || 0}
                                description="Último mês"
                                Icon={TrendingUp}
                                iconColor="text-emerald-500"
                            />
                        </div>

                        {/* Card Série B */}
                        <div className="min-w-[calc(50%-8px)] snap-center lg:min-w-full">
                            <StatCard
                                title={`TOTAL ${context.serieB.label}`}
                                value={types_counts[context.serieB.key] || 0}
                                description="Último mês"
                                Icon={TrendingDown}
                                iconColor="text-rose-500"
                            />
                        </div>

                        {/* Card Ato Mais Recente */}
                        <div className="min-w-[calc(50%-8px)] snap-center lg:min-w-full">
                            <StatCard
                                title="Ato mais recente"
                                value={latest ? latest.acronym : '---'}
                                description={latest ? format(parseISO(latest.date), "dd 'de' MMMM", { locale: ptBR }) : 'Sem registros'}
                                Icon={Clock3}
                                iconColor="text-slate-400"
                            />
                        </div>

                        {/* Card Histórico Total (Apenas Desktop na Grid) */}
                        <div className="hidden lg:block hover:scale-[1.02] transition-transform">
                            <StatCard
                                title="Histórico Total"
                                value={total_geral}
                                description="Registros consolidados"
                                Icon={Sigma}
                                iconColor="text-white"
                                bgColor="bg-emerald-600"
                                textColor="text-white"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Banner Informativo */}
            <div className="flex items-start md:items-center gap-3 mt-6 mb-10 p-4 bg-white rounded-xl border border-slate-100">
                <Info size={18} className="text-emerald-500 flex-shrink-0 mt-0.5 md:mt-0" />
                <p className="text-[12px] text-slate-500 leading-relaxed max-w-5xl">
                    O volume histórico consolida o total de ambos os atos de pessoal registrados desde 2018 para o contexto de <strong>{context.label}</strong>.
                </p>
            </div>
        </div>
    );
}