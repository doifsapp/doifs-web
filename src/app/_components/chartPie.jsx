'use client'

import React, { useEffect, useState, useMemo } from "react"
import { TrendingUp, Globe, Calendar, Map } from "lucide-react"
import { Pie, PieChart, LabelList, ResponsiveContainer, Cell } from "recharts"
import axios from "axios"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

// --- NOVA PALETA DE CORES (Diferenciação nítida entre regiões) ---
const COLORS_A = {
    "nordeste": "#059669",     // Esmeralda Escuro
    "sudeste": "#10b981",     // Esmeralda Médio
    "sul": "#34d399",         // Esmeralda Claro
    "centro-oeste": "#0ea5e9", // Sky Blue (Para quebrar a monotonia e diferenciar bem)
    "norte": "#84cc16",        // Lime (Diferenciação clara por tom)
};

const COLORS_B = {
    "nordeste": "#475569",     // Slate 600
    "sudeste": "#64748b",     // Slate 500
    "sul": "#94a3b8",         // Slate 400
    "centro-oeste": "#cbd5e1", // Slate 300
    "norte": "#e2e8f0",        // Slate 200
};

export function ChartPieRegional({ context }) {
    const [rawData, setRawData] = useState([])
    const [selectedYear, setSelectedYear] = useState("")
    const [isClient, setIsClient] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setIsClient(true)
        async function fetchData() {
            setLoading(true)
            try {
                const response = await axios.get("api/dashboard/region")
                const data = response.data.region_totals || []
                setRawData(data)

                const years = Array.from(new Set(data.map(d => d.year))).sort((a, b) => b - a)
                if (years.length > 0) setSelectedYear(String(years[1]))
            } catch (error) {
                console.error("Erro ao buscar dados regionais:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const availableYears = useMemo(() => {
        return Array.from(new Set(rawData.map(d => d.year))).sort((a, b) => b - a)
    }, [rawData])

    const { dataA, dataB, totalA, totalB } = useMemo(() => {
        if (!rawData.length || !context || !selectedYear) return { dataA: [], dataB: [], totalA: 0, totalB: 0 }

        const yearData = rawData.filter(item => String(item.year) === selectedYear)

        const mapData = (key, palette) => yearData.map(item => ({
            name: item.name,
            regionKey: item.region,
            value: item[key] || 0,
            fill: palette[item.region] || "#cbd5e1"
        })).filter(item => item.value > 0)

        const resA = mapData(context.serieA.key, COLORS_A)
        const resB = mapData(context.serieB.key, COLORS_B)

        return {
            dataA: resA,
            dataB: resB,
            totalA: resA.reduce((acc, curr) => acc + curr.value, 0),
            totalB: resB.reduce((acc, curr) => acc + curr.value, 0)
        }
    }, [rawData, context, selectedYear])

    if (!isClient) return <div className="w-full h-[550px] rounded-3xl border bg-white animate-pulse" />


    {/*Codigo não visual */ }
    return (
        <div className="flex flex-col gap-6 w-full">
            {/* Cabeçalho Superior Responsivo */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm gap-4">
                <div className="flex items-center gap-4">
                    <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100 shrink-0">
                        <Globe className="text-emerald-600" size={24} />
                    </div>
                    <div>
                        <h2 className="text-lg sm:text-xl font-black text-slate-800 tracking-tight">Distribuição Regional</h2>
                        <p className="text-xs sm:text-sm font-medium text-slate-500 line-clamp-1">
                            Análise de {context?.serieA.label} e {context?.serieB.label}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">
                    <Calendar size={16} className="text-slate-400 shrink-0" />
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                        <SelectTrigger className="w-full sm:w-[140px] bg-white rounded-xl border-slate-200 font-bold text-slate-700 h-10 sm:h-11">
                            <SelectValue placeholder="Ano" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                            {availableYears.map(year => (
                                <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Grid de Gráficos: 1 coluna no mobile, 2 no desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PieCard title={context?.serieA.label} data={dataA} total={totalA} loading={loading} />
                <PieCard title={context?.serieB.label} data={dataB} total={totalB} loading={loading} isSecondary />
            </div>
        </div>
    )

    function PieCard({ title, data, total, loading, isSecondary = false }) {
        return (
            <Card className="rounded-2xl sm:rounded-3xl shadow-sm border-slate-100 bg-white flex flex-col overflow-hidden transition-all hover:shadow-md">
                <CardHeader className="text-center border-b border-slate-50 bg-slate-50/30 py-5 sm:py-6 px-4">
                    <CardTitle className={`text-base sm:text-lg font-black tracking-tight line-clamp-1 ${isSecondary ? 'text-slate-500' : 'text-slate-800'}`}>
                        {title}
                    </CardTitle>
                    <CardDescription className="font-medium italic text-[10px] sm:text-xs text-slate-400 uppercase tracking-widest">
                        Proporção geográfica (%)
                    </CardDescription>
                </CardHeader>

                <CardContent className="flex-1 py-6 sm:py-8">
                    {loading ? (
                        <div className="h-[250px] sm:h-[280px] flex flex-col items-center justify-center gap-3">
                            <div className="w-8 h-8 border-4 border-slate-100 border-t-emerald-500 rounded-full animate-spin" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Carregando...</span>
                        </div>
                    ) : (
                        <div className="h-[250px] sm:h-[280px] w-full">
                            <ChartContainer config={{}} className="mx-auto aspect-square h-full w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <ChartTooltip
                                            cursor={false}
                                            content={<ChartTooltipContent
                                                className="rounded-xl border-slate-100 shadow-xl p-3"
                                                hideLabel
                                                formatter={(value, name, props) => (
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-3 w-3 rounded-full shadow-sm" style={{ backgroundColor: props?.payload?.fill }} />
                                                        <div className="flex flex-col">
                                                            <span className="text-[9px] uppercase font-black text-slate-400 leading-none mb-1">{props?.payload?.name}</span>
                                                            <span className="text-xs sm:text-sm font-bold text-slate-800">{value.toLocaleString('pt-BR')} registros</span>
                                                        </div>
                                                    </div>
                                                )} />}
                                        />
                                        <Pie
                                            data={data}
                                            dataKey="value"
                                            nameKey="name"
                                            innerRadius={55}
                                            outerRadius={85}
                                            strokeWidth={4}
                                            stroke="#fff"
                                            className="outline-none"
                                        >
                                            <LabelList
                                                dataKey="value"
                                                stroke="none"
                                                className="fill-white font-black"
                                                fontSize={9}
                                                position="inside"
                                                formatter={(val) => total > 0 ? `${((val / total) * 100).toFixed(1)}%` : ""}
                                            />
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </div>
                    )}
                </CardContent>

                <CardFooter className="flex-col gap-4 border-t border-slate-50 bg-slate-50/20 py-5 sm:py-6 px-6 sm:px-8 mt-auto">
                    <div className="flex flex-wrap justify-center gap-x-3 gap-y-2 border-t border-slate-100 w-full">
                        {data.map((item) => (
                            <div key={item.regionKey} className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-md border border-slate-50 shadow-sm">
                                <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: item.fill }} />
                                <span className="text-[9px] uppercase font-bold text-slate-500 tracking-tighter">{item.name}</span>
                            </div>
                        ))}
                    </div>
                    
                    <div className="flex items-center justify-between w-full pt-4">
                        <div className="grid gap-1">
                            <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-slate-800 leading-none">
                                {total.toLocaleString('pt-BR')} atos em {selectedYear} <TrendingUp className="h-4 w-4 text-emerald-500" />
                            </div>
                            <div className="text-[10px] sm:text-[12px] font-medium text-slate-400">
                                Total de atos por região geográfica
                            </div>
                        </div>
                        <div className={`px-2.5 py-1 rounded-lg border text-[9px] font-black uppercase tracking-wider ${isSecondary ? 'bg-white text-slate-500 border-slate-200' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                            {isSecondary ? 'Secundária' : 'Principal'}
                        </div>
                    </div>
                </CardFooter>
            </Card>
        )
    }
}