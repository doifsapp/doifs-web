'use client'

import React, { useEffect, useState, useMemo } from "react"
import { TrendingUp, Globe, Calendar, Map } from "lucide-react"
import { Pie, PieChart, LabelList, Cell } from "recharts"
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
                if (years.length > 0) setSelectedYear(String(years[0]))
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

    return (
        <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm gap-4">
                <div className="flex items-center gap-4">
                    <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100">
                        <Globe className="text-emerald-600" size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-800 tracking-tight">Distribuição Regional</h2>
                        <p className="text-sm font-medium text-slate-500">Análise de {context?.serieA.label} e {context?.serieB.label}</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Calendar size={16} className="text-slate-400" />
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                        <SelectTrigger className="w-full sm:w-[140px] bg-white rounded-xl border-slate-200 font-bold text-slate-700 h-11">
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PieCard title={context?.serieA.label} data={dataA} total={totalA} loading={loading} />
                <PieCard title={context?.serieB.label} data={dataB} total={totalB} loading={loading} isSecondary />
            </div>
        </div>
    )
}

function PieCard({ title, data, total, loading, isSecondary = false }) {
    return (
        <Card className="rounded-3xl shadow-sm border-slate-100 bg-white flex flex-col overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="text-center border-b border-slate-50 bg-slate-50/30 py-6">
                <CardTitle className={`text-lg font-black tracking-tight ${isSecondary ? 'text-slate-500' : 'text-slate-800'}`}>
                    {title}
                </CardTitle>
                <CardDescription className="font-medium italic text-xs text-slate-400">Proporção geográfica (%)</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 py-8">
                {loading ? (
                    <div className="h-[280px] flex items-center justify-center animate-spin">
                        <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-500 rounded-full" />
                    </div>
                ) : (
                    <ChartContainer config={{}} className="mx-auto aspect-square max-h-[280px]">
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
                                            <span className="text-[10px] uppercase font-black text-slate-400 leading-none mb-1">{props?.payload?.name}</span>
                                            <span className="text-sm font-bold text-slate-800">{value.toLocaleString('pt-BR')} registros</span>
                                        </div>
                                    </div>
                                )}/>}
                            />
                            <Pie data={data} dataKey="value" nameKey="name" innerRadius={65} outerRadius={100} strokeWidth={4} stroke="#fff">
                                {/* CORREÇÃO 1: Mantendo o cálculo original com .toFixed(1) para precisão decimal */}
                                <LabelList 
                                    dataKey="value" 
                                    stroke="none"
                                    className="fill-white font-black"
                                    fontSize={10}
                                    position="inside"
                                    formatter={(val) => total > 0 ? `${((val / total) * 100).toFixed(1)}%` : ""}
                                />
                            </Pie>
                        </PieChart>
                    </ChartContainer>
                )}
            </CardContent>
            <CardFooter className="flex-col gap-4 border-t border-slate-50 bg-slate-50/20 py-6 px-8 mt-auto">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2 font-black text-slate-800 text-base">
                        {total.toLocaleString('pt-BR')} <span className="text-slate-400 font-medium text-xs">Atos</span>
                    </div>
                    <div className={`px-3 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wider ${isSecondary ? 'bg-slate-100 text-slate-500' : 'bg-emerald-50 text-emerald-600'}`}>
                        {isSecondary ? 'Série Secundária' : 'Série Principal'}
                    </div>
                </div>
                
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 pt-3 border-t border-slate-100 w-full">
                    {data.map((item) => (
                        <div key={item.regionKey} className="flex items-center gap-1.5">
                            <div className="h-2 w-2 rounded-full shadow-sm" style={{ backgroundColor: item.fill }} />
                            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-tighter">{item.name}</span>
                        </div>
                    ))}
                </div>
            </CardFooter>
        </Card>
    )
}