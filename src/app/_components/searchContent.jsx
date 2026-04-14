'use client'

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { CardPub } from "@/app/_components/cardPub";
import { Loader2, SearchX, LayoutGrid } from "lucide-react";

export function SearchContent() {
    const [publicationsData, setPublications] = useState({ publications: [], count: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const searchParams = useSearchParams();

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const [year, month, day] = dateString.split("-");
        return `${day}/${month}/${year}`;
    };

    useEffect(() => {
        const fetchSearch = async () => {
            const params = Object.fromEntries(searchParams.entries());
            if (Object.keys(params).length === 0) {
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            const query = new URLSearchParams(params);

            try {
                const response = await axios.get(`/api/search?${query.toString()}`);
                const data = response.data;
                
                const formatted = (data.publications || []).map(pub => ({
                    ...pub,
                    date: formatDate(pub.date)
                }));

                setPublications({ publications: formatted, count: data.count || 0 });
            } catch (error) {
                console.error("Erro na busca:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSearch();
    }, [searchParams]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                <p className="text-slate-500 font-medium">Processando dados...</p>
            </div>
        );
    }

    const { publications, count } = publicationsData;

    return (
        <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500">
            {/* Header de Resultados: Flex-col no mobile, Row no desktop */}
            <div className="flex flex-col sm:flex-row sm:pt-8 items-start sm:items-center justify-between gap-4 px-2 md:px-0">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                        <LayoutGrid size={20} className="text-emerald-700" />
                    </div>
                    <h2 className="text-xl font-black text-slate-800 tracking-tight">
                        Resultados
                    </h2>
                </div>
                <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-4 py-1.5 rounded-full border border-emerald-100 shadow-sm">
                    {count} {count === 1 ? 'publicação encontrada' : 'publicações encontradas'}
                </span>
            </div>

            {/* Listagem */}
            {publications.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                    {publications.map((res, index) => (
                        <CardPub key={res.id || index} pubss={res} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 px-6 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                    <div className="bg-slate-50 p-5 rounded-full mb-4">
                        <SearchX className="w-10 h-10 text-slate-300" />
                    </div>
                    <h3 className="text-slate-900 font-bold text-lg">Nenhum resultado</h3>
                    <p className="text-slate-500 text-center max-w-sm mt-2 text-sm leading-relaxed">
                        Não encontramos registros para esta busca. Tente remover alguns filtros ou revisar o nome do servidor.
                    </p>
                </div>
            )}
        </div>
    );
}