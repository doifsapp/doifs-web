'use client'

import React, { useEffect, useState, useMemo } from "react"
import { TrendingUp, MapPin, ArrowUpRight, Calendar } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Legend } from "recharts"
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

    // Cores padronizadas com o ChartArea (Emerald)
    const chartConfig = {
        valA: { label: context?.serieA.label, color: "#10b981" }, // Emerald 500
        valB: { label: context?.serieB.label, color: "#6BD0AF" }, // Emerald 200
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
                if (years.length > 0) setSelectedYear(String(years[1]))
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

    if (!isClient) return <div className="w-full h-[600px] rounded-3xl border bg-slate-50 animate-pulse" />

    return (
        <Card className="rounded-3xl shadow-sm border-slate-100 bg-white overflow-hidden transition-all hover:shadow-md flex flex-col h-full">
            <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-100  gap-4">
                <div className="grid gap-1">
                    <CardTitle className="text-xl font-black tracking-tight text-slate-800 flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-emerald-600" />
                        Distribuição por Estado
                    </CardTitle>
                    <CardDescription className="text-slate-500 font-medium">
                        Ranking por unidade federativa em {selectedYear}
                    </CardDescription>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">
                    <Calendar size={16} className="text-slate-400 shrink-0" />
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="w-full sm:w-[140px] bg-white rounded-xl border-slate-200 font-bold text-slate-700 h-10 sm:h-11">
                        <SelectValue placeholder="Ano" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                        {availableYears.map(year => (
                            <SelectItem key={year} value={String(year)} className="rounded-lg">{year}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                </div>
            </CardHeader>

            <CardContent className="flex-1 px-4 pt-8 sm:px-8">
                {loading ? (
                    <div className="h-[500px] flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl animate-pulse text-slate-400 gap-3">
                        <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin" />
                        <span className="text-sm font-medium italic">Sincronizando estados...</span>
                    </div>
                ) : (
                    <ChartContainer config={chartConfig} className="min-h-[1200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={chartData}
                                layout="vertical"
                                margin={{ left: 10, right: 40, top: 20, bottom: 20 }}
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
                                        className="rounded-xl border-slate-100 shadow-lg"
                                        indicator="dot"
                                        labelFormatter={(_, payload) => payload[0]?.payload?.full_name}
                                    />}
                                />

                                <Bar
                                    dataKey="valA"
                                    name={context?.serieA.label}
                                    fill={chartConfig.valA.color}
                                    radius={[0, 4, 4, 0]}
                                    barSize={16}
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
                                        fontWeight: '800',
                                        color: '#64748b'
                                    }}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                )}
            </CardContent>

            <CardFooter className="border-t border-slate-50 bg-slate-50/20 py-6 px-8 flex-row items-center justify-between">
                <div className="flex flex-col sm:flex-row w-full items-start sm:items-center justify-between gap-4">
                    <div className="grid gap-1">
                        <div className="flex items-center gap-2 text-base font-bold text-slate-800 leading-none">
                            {totalPeriod.toLocaleString('pt-BR')} atos em {selectedYear}
                            <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                        </div>
                        <div className="text-[12px] font-medium text-slate-400">
                            Ranking de produtividade por unidade da federação
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                        <TrendingUp className="h-4 w-4 text-emerald-600" />
                        <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-tight">Análise Geográfica</span>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}