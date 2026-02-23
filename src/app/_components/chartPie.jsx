'use client'

import React, { useEffect, useState, useMemo } from "react"
import { TrendingUp } from "lucide-react"
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

// Paleta A: Cores Sólidas (Série A)
const COLORS_A = {
    "centro-oeste": "#f97316", 
    "nordeste": "#0ea5e9",     
    "norte": "#84cc16",        
    "sudeste": "#8b5cf6",      
    "sul": "#eab308",          
};

// Paleta B: Cores Pastel (Série B) para diferenciar visualmente
const COLORS_B = {
    "centro-oeste": "#fdba74", 
    "nordeste": "#7dd3fc",     
    "norte": "#bef264",        
    "sudeste": "#c4b5fd",      
    "sul": "#fde047",          
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

    if (!isClient) return <div className="w-full h-[500px] rounded-2xl border bg-slate-50 animate-pulse" />

    return (
        <div className="flex flex-col gap-4 w-full">
            {/* Cabeçalho de Controle Único */}
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div>
                    <h2 className="text-lg font-bold text-slate-800">Distribuição Regional</h2>
                    <p className="text-sm text-slate-500">Comparativo: {context?.serieA.label} vs {context?.serieB.label}</p>
                </div>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="w-[120px] bg-slate-50 font-medium">
                        <SelectValue placeholder="Ano" />
                    </SelectTrigger>
                    <SelectContent>
                        {availableYears.map(year => (
                            <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <PieCard title={context?.serieA.label} data={dataA} total={totalA} loading={loading} />
                <PieCard title={context?.serieB.label} data={dataB} total={totalB} loading={loading} isSecondary />
            </div>
        </div>
    )
}

function PieCard({ title, data, total, loading, isSecondary = false }) {
    return (
        <Card className="rounded-2xl shadow-sm border-gray-100 bg-white flex flex-col">
            <CardHeader className="pb-0 text-center">
                <CardTitle className={`text-md font-bold ${isSecondary ? 'text-slate-500' : 'text-slate-800'}`}>
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                {loading ? (
                    <div className="h-[250px] flex items-center justify-center italic text-slate-400">Carregando...</div>
                ) : (
                    <ChartContainer config={{}} className="mx-auto aspect-square max-h-[250px]">
                        <PieChart id={`pie-${title}`}>
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel formatter={(value, name, props) => (
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: props?.payload?.fill }} />
                                        <span className="font-bold text-slate-700">{props?.payload?.name}:</span>
                                        <span>{value.toLocaleString('pt-BR')} atos</span>
                                    </div>
                                )}/>}
                            />
                            <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} strokeWidth={4}>
                                <LabelList 
                                    dataKey="value" 
                                    stroke="none" // CORREÇÃO: Remove o contorno que causa o "borrado"
                                    className="fill-white font-medium" // Mudado de font-bold para medium para maior nitidez
                                    fontSize={11}
                                    position="inside"
                                    formatter={(val) => total > 0 ? `${((val / total) * 100).toFixed(1)}%` : ""}
                                />
                            </Pie>
                        </PieChart>
                    </ChartContainer>
                )}
            </CardContent>
            <CardFooter className="flex-col gap-2 border-t pt-4 text-sm mt-4 bg-slate-50/30">
                <div className="flex items-center gap-2 font-bold text-slate-700">
                    Total: {total.toLocaleString('pt-BR')} <TrendingUp className={`h-4 w-4 ${isSecondary ? 'text-slate-400' : 'text-emerald-500'}`} />
                </div>
                <div className="flex flex-wrap justify-center gap-2 mt-1">
                    {data.map((item) => (
                        <div key={item.regionKey} className="flex items-center gap-1 text-[9px] uppercase font-bold text-slate-400">
                            <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: item.fill }} />
                            {item.name}
                        </div>
                    ))}
                </div>
            </CardFooter>
        </Card>
    )
}