'use client'

import React, { useEffect, useState, useMemo } from "react"
import { TrendingUp, MapPin } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend } from "recharts"
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

export function ChartBarState({ context }) {
    const [rawData, setRawData] = useState([])
    const [selectedYear, setSelectedYear] = useState("")
    const [isClient, setIsClient] = useState(false)
    const [loading, setLoading] = useState(true)

    const chartConfig = {
        valA: { label: context?.serieA.label, color: "#2563eb" },
        valB: { label: context?.serieB.label, color: "#93c5fd" },
    }

    useEffect(() => {
        setIsClient(true)
        async function fetchData() {
            setLoading(true)
            try {
                const response = await axios.get("api/dashboard/states")
                const data = response.data.state_totals || []
                setRawData(data)
                
                const years = Array.from(new Set(data.map(d => d.year))).sort((a, b) => b - a)
                if (years.length > 0) setSelectedYear(String(years[0]))
            } catch (error) {
                console.error("Erro ao buscar dados estaduais:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [context])

    const availableYears = useMemo(() => {
        return Array.from(new Set(rawData.map(d => d.year))).sort((a, b) => b - a)
    }, [rawData])

    const chartData = useMemo(() => {
        if (!rawData.length || !context || !selectedYear) return []

        return rawData
            .filter(item => String(item.year) === selectedYear)
            .map(item => ({
                state: item.uf,
                full_name: item.state_name,
                valA: item[context.serieA.key] || 0,
                valB: item[context.serieB.key] || 0,
                total: (item[context.serieA.key] || 0) + (item[context.serieB.key] || 0)
            }))
            .sort((a, b) => b.total - a.total)
    }, [rawData, context, selectedYear])

    const totalPeriod = useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.total, 0)
    }, [chartData])

    if (!isClient) return <div className="w-full h-[600px] rounded-2xl border bg-slate-50 animate-pulse" />

    return (
        <Card className="rounded-2xl shadow-sm border-gray-100 bg-white flex flex-col h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div className="grid gap-1">
                    <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-blue-600" />
                        Distribuição por Estado
                    </CardTitle>
                    <CardDescription>Ranking completo por unidade federativa</CardDescription>
                </div>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="w-[110px] bg-slate-50">
                        <SelectValue placeholder="Ano" />
                    </SelectTrigger>
                    <SelectContent>
                        {availableYears.map(year => (
                            <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </CardHeader>

            <CardContent className="flex-1">
                {loading ? (
                    <div className="h-[500px] flex items-center justify-center italic text-slate-400">Processando estados...</div>
                ) : (
                    /* AJUSTE 1: Altura aumentada para 1100px para acomodar todos os estados com folga */
                    <ChartContainer config={chartConfig} className="min-h-[1200px] w-full">
                        <BarChart
                            data={chartData}
                            layout="vertical"
                            margin={{ left: 10, right: 40, top: 20, bottom: 20 }}
                            /* AJUSTE 2: barCategoryGap em 40% cria um grande espaço entre os estados */
                            barCategoryGap="50%" 
                            barGap={2}
                        >
                            <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                            
                            <YAxis
                                dataKey="state"
                                type="category"
                                tickLine={false}
                                axisLine={false}
                                fontSize={12}
                                fontWeight={700}
                                tick={{ fill: '#1e293b' }}
                            />

                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                dataKey="total"
                                type="category"
                                tickLine={false}
                                axisLine={false}
                                fontSize={11}
                                fontWeight={600}
                                tick={{ fill: '#64748b' }}
                                tickFormatter={(value) => `${value}`}
                            />

                            <XAxis type="number" hide />
                            
                            <ChartTooltip
                                cursor={{ fill: "#f8fafc" }}
                                content={<ChartTooltipContent 
                                    indicator="dot" 
                                    labelFormatter={(_, payload) => payload[0]?.payload?.full_name} 
                                />}
                            />

                            <Bar
                                dataKey="valA"
                                name={context?.serieA.label}
                                fill={chartConfig.valA.color}
                                radius={[0, 4, 4, 0]}
                                barSize={16} /* Barra levemente mais grossa para preencher o novo espaço */
                            />
                            
                            <Bar
                                dataKey="valB"
                                name={context?.serieB.label}
                                fill={chartConfig.valB.color}
                                radius={[0, 4, 4, 0]}
                                barSize={16}
                            />

                            <Legend 
                                verticalAlign="top" 
                                align="right" 
                                iconType="circle"
                                wrapperStyle={{ 
                                    paddingBottom: '40px', 
                                    fontSize: '12px',
                                    color: '#64748b'
                                }}
                            />
                        </BarChart>
                    </ChartContainer>
                )}
            </CardContent>

            <CardFooter className="flex-col items-start gap-2 border-t pt-4 text-sm bg-slate-50/50">
                <div className="flex gap-2 font-bold text-slate-700 leading-none">
                    Total de {totalPeriod.toLocaleString('pt-BR')} atos em {selectedYear}
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                </div>
                <div className="text-sm text-slate-500 italic">
                    Ranking de produtividade e movimentação de pessoal por unidade da federação.
                </div>
            </CardFooter>
        </Card>
    )
}