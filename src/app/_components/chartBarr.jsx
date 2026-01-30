'use client'

import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import * as React from "react"
import { useState, useMemo, useEffect } from "react"
import axios from "axios"

import {
    Card,
    CardContent,
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
    SelectValue
} from "@/components/ui/select"

const rawApiDataState = [
    { 'uf': 'AL', 'state_name': 'Alagoas', 'year': 2018, 'nomeacoes': 20, 'exoneracoes': 10 },
    // ... restante dos dados omitidos para brevidade
];

const chartConfigState = {
    nomeacoes: {
        label: "Nomeações",
        color: "hsl(14, 100%, 70%)",
    },
    exoneracoes: {
        label: "Exonerações",
        color: "hsl(210, 100%, 65%)",
    },
};

const transformAndFilterData = (apiData, year) => {
    const filtered = apiData.filter(item => item.year === parseInt(year));
    return filtered.sort((a, b) => b.nomeacoes - a.nomeacoes);
}

export function ChartStateGroupedBar() {
    const [isMounted, setIsMounted] = useState(false);
    const [chartData, setChartData] = useState({});
    const [selectedYear, setSelectedYear] = useState("2018");

    useEffect(() => {
        setIsMounted(true);
        axios.get("api/dashboard/states")
            .then((res) => {
                setChartData(res.data);
                const year_last = res.data.years?.[0]?.years || [];
                if(year_last.length > 0) setSelectedYear(year_last[0].toString());
            })
            .catch((error) => console.error("Erro ao buscar dados", error));
    }, []);

    const statesData = chartData.state_totals || rawApiDataState;
    const years = chartData.years?.[0]?.years || [2018, 2024];

    const filteredData = useMemo(() => {
        return transformAndFilterData(statesData, selectedYear);
    }, [statesData, selectedYear]);

    // AJUSTE PRINCIPAL: Cálculo de altura dinâmica para evitar barras juntas
    // Multiplicamos o número de estados por 60px (espaço para as duas barras + respiro)
    const dynamicHeight = useMemo(() => {
        const minHeight = 400;
        const calculatedHeight = filteredData.length * 60; 
        return Math.max(minHeight, calculatedHeight);
    }, [filteredData]);

    const whiteTextStyle = { fill: 'white', fontSize: 12 };

    return (
        <div className="rounded-2xl w-full mb-28">
            <Card className="flex flex-col shadow-2xl border-none overflow-hidden">
                <CardHeader className="items-start pb-4">
                    <CardTitle>Atos por Estado e Tipo</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm text-gray-400">Ano:</span>
                        <Select value={selectedYear} onValueChange={setSelectedYear}>
                            <SelectTrigger className="w-[100px] text-black bg-white border-white">
                                <SelectValue placeholder="Ano" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                                {years.map(year => (
                                    <SelectItem key={year} value={year.toString()} className="text-black">
                                        {year}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>

                {/* Container com scroll para não vazar da página se houver muitos estados */}
                <CardContent className="flex-1 pb-4 overflow-y-auto max-h-[80vh]">
                    {!isMounted ? (
                        <div className="flex items-center justify-center h-[400px]">Carregando...</div>
                    ) : (
                        <ChartContainer
                            config={chartConfigState}
                            // Aplicando a altura dinâmica aqui
                            style={{ height: `${dynamicHeight}px`, width: '100%' }}
                        >
                            <BarChart
                                data={filteredData}
                                layout="vertical"
                                // Aumentamos o GAP entre as categorias de estados
                                barCategoryGap="35%" 
                                barGap={8}
                                margin={{ left: 20, right: 40, top: 10, bottom: 10 }}
                            >
                                <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="#444444" />
                                <XAxis type="number" tick={whiteTextStyle} stroke="#555555" />
                                <YAxis
                                    type="category"
                                    dataKey="state_name"
                                    tick={whiteTextStyle}
                                    width={120}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <ChartTooltip content={<ChartTooltipContent className="bg-gray-800 text-white" />} />
                                <Legend verticalAlign="top" align="right" height={50} />

                                <Bar
                                    dataKey="nomeacoes"
                                    fill="var(--color-nomeacoes)"
                                    barSize={18} // Largura da barra aumentada
                                    radius={[0, 4, 4, 0]}
                                    name={chartConfigState.nomeacoes.label}
                                />
                                <Bar
                                    dataKey="exoneracoes"
                                    fill="var(--color-exoneracoes)"
                                    barSize={18} // Largura da barra aumentada
                                    radius={[0, 4, 4, 0]}
                                    name={chartConfigState.exoneracoes.label}
                                />
                            </BarChart>
                        </ChartContainer>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}