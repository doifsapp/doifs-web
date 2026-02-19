'use client'

import axios from "axios";
import { TrendingUp, TrendingDown, Sigma, Newspaper } from "lucide-react";
import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export function CardDashboard({ context }) {
    const [data, setData] = useState(null);
    const [mounted, setMounted] = useState(false);

    // Função auxiliar para normalizar strings (remove acentos e deixa em minúsculo)
    const normalize = (str) => {
        if (!str) return "";
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    };

    useEffect(() => {
        setMounted(true);
        const getTotals = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/get-totals');
                setData(response.data);
            } catch (error) {
                console.error("Erro ao buscar totais:", error);
            }
        };
        getTotals();
    }, []);

    if (!mounted || !data || !context) {
        return (
            <div className="mt-16 w-full">
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <li key={i} className="h-[140px] bg-white/50 rounded-2xl border border-gray-100 animate-pulse" />
                    ))}
                </ul>
            </div>
        );
    }

    const { types_counts, latest_pubs } = data;

    // Lógica de filtragem aprimorada para lidar com Nomeação vs Nomeações
    const filteredPubs = (latest_pubs || []).filter((pub) => {
        const typeNorm = normalize(pub.type); // ex: "nomeacao"
        const labelANorm = normalize(context.serieA.label); // ex: "nomeacoes"
        const labelBNorm = normalize(context.serieB.label); // ex: "exoneracoes"
        
        // Comparamos apenas o início da palavra (primeiros 5 caracteres) 
        // para ignorar variações de plural/singular e acentuação
        return labelANorm.startsWith(typeNorm.substring(0, 5)) || 
               labelBNorm.startsWith(typeNorm.substring(0, 5));
    });

    const latest = filteredPubs.length > 0 ? filteredPubs[0] : null;

    const cards = [
        {
            title: context.serieA.label,
            count: types_counts[context.serieA.key] || 0,
            icon: TrendingUp,
            description: `Total acumulado`,
            color: 'rgb(5, 150, 105)',
            background: 'bg-emerald-100'
        },
        {
            title: context.serieB.label,
            count: types_counts[context.serieB.key] || 0,
            icon: TrendingDown,
            description: `Total acumulado`,
            color: 'rgb(225, 29, 72)',
            background: 'bg-rose-100'
        },
        {
            title: 'Ato mais recente',
            count: latest ? latest.acronym : '---',
            icon: Newspaper,
            description: latest ? `${latest.type} em ` : 'Sem registros',
            date: latest ? format(parseISO(latest.date), "dd/MM/yy", { locale: ptBR }) : '',
            color: 'rgb(37, 99, 235)',
            background: 'bg-blue-100'
        },
        {
            title: 'Soma do Contexto',
            count: (types_counts[context.serieA.key] || 0) + (types_counts[context.serieB.key] || 0),
            icon: Sigma,
            description: 'Total de atos na comparação',
            color: 'rgb(245, 158, 11)',
            background: 'bg-amber-100'
        }
    ];

    return (
        <div className="mt-16 w-full">
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <li key={index} className="list-none">
                            <div className="h-full p-6 rounded-2xl shadow-sm border border-gray-100 bg-white hover:shadow-md transition-all duration-300">
                                <div className="flex justify-between items-start mb-4">
                                    <p className="text-gray-400 font-semibold text-[11px] uppercase tracking-wider">{card.title}</p>
                                    <div className={`p-2 rounded-xl ${card.background}`}>
                                        <Icon size={20} color={card.color}/>
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <h4 className="font-bold text-2xl text-slate-800">
                                        {card.count}
                                    </h4>
                                    <p className="mt-2 text-[11px] text-gray-400 leading-tight">
                                        {card.description} 
                                        {card.date && <span className="block font-bold text-slate-500">{card.date}</span>}
                                    </p>
                                </div>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    );
}