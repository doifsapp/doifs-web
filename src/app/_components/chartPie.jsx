'use client'

import React, { useEffect, useState, useMemo } from "react"
import { TrendingUp } from "lucide-react"
import { Pie, PieChart, Cell } from "recharts"
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

// =========================================================================
// 1. CONFIGURAÇÃO DE CORES (JavaScript Puro)
// =========================================================================
const chartConfig = {
    norte: {
        label: 'Norte',
        color: '#fb923c', // Laranja
    },
    nordeste: {
        label: 'Nordeste',
        color: '#38bdf8', // Azul
    },
    centro_oeste: {
        label: 'Centro-Oeste',
        color: '#a3e635', // Verde
    },
    sudeste: {
        label: 'Sudeste',
        color: '#a855f7', // Roxo
    },
    sul: {
        label: 'Sul',
        color: '#facc15', // Amarelo
    }
};

// =========================================================================
// 2. FUNÇÃO DE TRANSFORMAÇÃO
// =========================================================================
const transformApiData = (apiData, config) => {
    if (!apiData) return { nomeacoesData: [], exoneracoesData: [] };

    const mapItem = (item, key) => ({
        region: item.region,
        name: config[item.region]?.label || item.name,
        total_atos: item[key],
        fill: config[item.region]?.color || '#808080',
    });

    const nomeacoesData = apiData.map(item => mapItem(item, 'nomeacoes'));
    const exoneracoesData = apiData.map(item => mapItem(item, 'exoneracoes'));

    return { nomeacoesData, exoneracoesData };
};

// =========================================================================
// 3. COMPONENTES AUXILIARES
// =========================================================================

const CustomPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value, totalAtos }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const percentage = ((value / totalAtos) * 100);

    if (percentage < 5) return null;

    return (
        <text
            x={x}
            y={y}
            fill="white"
            textAnchor="middle"
            dominantBaseline="central"
            className="text-[11px] font-bold fill-white"
        >
            {`${percentage.toFixed(0)}%`}
        </text>
    );
};

function SinglePieChart({ data, title, description, valueKey }) {
    const totalAtos = data.reduce((sum, item) => sum + item[valueKey], 0);

    return (
        <Card className="flex flex-col shadow-xl border-zinc-200">
            <CardHeader className="items-center pb-2">
                <CardTitle className="text-xl">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        {/* 1. CURSOR DINÂMICO: O Tooltip do shadcn gerencia o estado do cursor.
                          4. TOOLTIP: Exibe o valor absoluto (quantidade) no hover.
                        */}
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent 
                                    hideLabel 
                                    formatter={(value, name) => (
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold">{name}:</span>
                                            <span>{Number(value).toLocaleString('pt-BR')}</span>
                                        </div>
                                    )}
                                />
                            }
                        />
                        <Pie
                            data={data}
                            dataKey={valueKey}
                            nameKey="name"
                            innerRadius={60}
                            strokeWidth={5}
                            labelLine={false}
                            /* 4. DENTRO DA SEÇÃO: Apenas porcentagem */
                            label={(props) => <CustomPieLabel {...props} totalAtos={totalAtos} />}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Pie>
                    </PieChart>
                </ChartContainer>

                {/* 3. LEGENDA PARA CADA REGIÃO */}
                <div className="grid grid-cols-2 gap-2 pb-6 px-2 sm:flex sm:flex-wrap sm:justify-center">
                    {data.map((entry) => (
                        <div key={entry.region} className="flex items-center gap-2">
                            <div 
                                className="h-3 w-3 rounded-full shrink-0" 
                                style={{ backgroundColor: entry.fill }}
                            />
                            <span className="text-xs font-medium text-zinc-600 truncate">
                                {entry.name}
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="flex-col gap-1 text-sm border-t bg-zinc-50/50 py-3">
                <div className="flex items-center gap-2 font-bold text-zinc-800">
                    Total: {totalAtos.toLocaleString('pt-BR')} <TrendingUp className="h-4 w-4 text-emerald-600" />
                </div>
            </CardFooter>
        </Card>
    )
}

// =========================================================================
// 4. COMPONENTE PRINCIPAL
// =========================================================================
export function ChartPieRegional() {
    const [chartData, setChartData] = useState({ region_totals: [] })

    useEffect(() => {
        axios.get("api/dashboard/region")
            .then((res) => {
                setChartData(res.data)
            })
            .catch((error) => {
                console.error("Erro ao buscar dados regionais", error)
            })
    }, [])

    const { nomeacoesData, exoneracoesData } = useMemo(() => {
        return transformApiData(chartData.region_totals, chartConfig)
    }, [chartData])

    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 p-4">
            <SinglePieChart
                data={nomeacoesData}
                title="Nomeações por Região"
                description="Volume total de atos de nomeação"
                valueKey="total_atos"
            />

            <SinglePieChart
                data={exoneracoesData}
                title="Exonerações por Região"
                description="Volume total de atos de exoneração"
                valueKey="total_atos"
            />
        </div>
    )
}