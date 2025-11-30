'use client'

import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Legend, Tooltip } from "recharts"
import * as React from "react"
import { useState, useMemo, useEffect } from "react" // Adicionado useEffect

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
// Importações de componentes de UI (Assumindo shadcn/ui)
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import axios from "axios"

// ... (Resto do rawApiDataState, YEARS e chartConfigState mantidos) ... oi

const rawApiDataState = [
    { 'uf': 'AL', 'state_name': 'Alagoas', 'year': 2018, 'nomeacoes': 20, 'exoneracoes': 10 },
    { 'uf': 'AM', 'state_name': 'Amazonas', 'year': 2018, 'nomeacoes': 0, 'exoneracoes': 1 },
    { 'uf': 'BA', 'state_name': 'Bahia', 'year': 2018, 'nomeacoes': 1, 'exoneracoes': 0 },
    { 'uf': 'CE', 'state_name': 'Ceará', 'year': 2018, 'nomeacoes': 1, 'exoneracoes': 0 },
    { 'uf': 'DF', 'state_name': 'Distrito Federal', 'year': 2018, 'nomeacoes': 1, 'exoneracoes': 0 },
    { 'uf': 'ES', 'state_name': 'Espírito Santo', 'year': 2018, 'nomeacoes': 1, 'exoneracoes': 1 },
    { 'uf': 'GO', 'state_name': 'Goiás', 'year': 2018, 'nomeacoes': 2, 'exoneracoes': 1 },
    { 'uf': 'MA', 'state_name': 'Maranhão', 'year': 2018, 'nomeacoes': 1, 'exoneracoes': 0 },
    { 'uf': 'MG', 'state_name': 'Minas Gerais', 'year': 2018, 'nomeacoes': 6, 'exoneracoes': 1 },
    { 'uf': 'MS', 'state_name': 'Mato Grosso do Sul', 'year': 2018, 'nomeacoes': 2, 'exoneracoes': 0 },
    { 'uf': 'MT', 'state_name': 'Mato Grosso', 'year': 2018, 'nomeacoes': 2, 'exoneracoes': 2 },
    { 'uf': 'PA', 'state_name': 'Pará', 'year': 2018, 'nomeacoes': 2, 'exoneracoes': 0 },

    { 'uf': 'PB', 'state_name': 'Paraíba', 'year': 2018, 'nomeacoes': 2, 'exoneracoes': 0 },
    { 'uf': 'PE', 'state_name': 'Pernambuco', 'year': 2018, 'nomeacoes': 2, 'exoneracoes': 0 },
    { 'uf': 'PI', 'state_name': 'Piauí', 'year': 2018, 'nomeacoes': 1, 'exoneracoes': 0 },
    { 'uf': 'PR', 'state_name': 'Paraná', 'year': 2018, 'nomeacoes': 1, 'exoneracoes': 3 },
    { 'uf': 'RJ', 'state_name': 'Rio de Janeiro', 'year': 2018, 'nomeacoes': 4, 'exoneracoes': 0 },
    { 'uf': 'RN', 'state_name': 'Rio Grande do Norte', 'year': 2018, 'nomeacoes': 1, 'exoneracoes': 0 },
    { 'uf': 'RO', 'state_name': 'Rondônia', 'year': 2018, 'nomeacoes': 1, 'exoneracoes': 0 },
    { 'uf': 'RR', 'state_name': 'Roraima', 'year': 2018, 'nomeacoes': 1, 'exoneracoes': 0 },
    { 'uf': 'RS', 'state_name': 'Rio Grande do Sul', 'year': 2018, 'nomeacoes': 5, 'exoneracoes': 1 },
    { 'uf': 'SC', 'state_name': 'Santa Catarina', 'year': 2018, 'nomeacoes': 3, 'exoneracoes': 0 },
    { 'uf': 'SE', 'state_name': 'Sergipe', 'year': 2018, 'nomeacoes': 1, 'exoneracoes': 0 },
    { 'uf': 'SP', 'state_name': 'São Paulo', 'year': 2018, 'nomeacoes': 1, 'exoneracoes': 0 },
    { 'uf': 'TO', 'state_name': 'Tocantins', 'year': 2018, 'nomeacoes': 1, 'exoneracoes': 0 },

    { 'uf': 'AL', 'state_name': 'Alagoas', 'year': 2019, 'nomeacoes': 120, 'exoneracoes': 27 },

    { 'uf': 'AL', 'state_name': 'Alagoas', 'year': 2020, 'nomeacoes': 62, 'exoneracoes': 20 },

    { 'uf': 'AL', 'state_name': 'Alagoas', 'year': 2021, 'nomeacoes': 77, 'exoneracoes': 29 },

    { 'uf': 'AL', 'state_name': 'Alagoas', 'year': 2022, 'nomeacoes': 90, 'exoneracoes': 24 },

    { 'uf': 'AL', 'state_name': 'Alagoas', 'year': 2023, 'nomeacoes': 144, 'exoneracoes': 73 },

    { 'uf': 'AC', 'state_name': 'Acre', 'year': 2024, 'nomeacoes': 3, 'exoneracoes': 0 },
    { 'uf': 'AL', 'state_name': 'Alagoas', 'year': 2024, 'nomeacoes': 29, 'exoneracoes': 29 },
    { 'uf': 'DF', 'state_name': 'Distrito Federal', 'year': 2024, 'nomeacoes': 1, 'exoneracoes': 0 },
    { 'uf': 'MG', 'state_name': 'Minas Gerais', 'year': 2024, 'nomeacoes': 1, 'exoneracoes': 0 },

    { 'uf': 'AL', 'state_name': 'Alagoas', 'year': 2025, 'nomeacoes': 2, 'exoneracoes': 1 },
    { 'uf': 'PB', 'state_name': 'Paraíba', 'year': 2025, 'nomeacoes': 1, 'exoneracoes': 0 },
    { 'uf': 'ET', 'state_name': 'Estado Teste', 'year': 2025, 'nomeacoes': 0, 'exoneracoes': 0 }
];

const YEARS = [2025, 2024, 2023];

const chartConfigState = {
    uf: { label: "Estado" },
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
    const filtered = apiData.filter(item => item.year === year);
    const sorted = filtered.sort((a, b) => b.nomeacoes - a.nomeacoes);
    return sorted;
}


// =========================================================================
// 3. COMPONENTE PRINCIPAL (CORRIGIDO PARA HIDRATAÇÃO)
// =========================================================================

export function ChartStateGroupedBar() {
    const [isMounted, setIsMounted] = useState(false);
    const [chartData, setChartData] = useState({})
    const [selectedYear, setSelectedYear] = useState("2018");

    useEffect(() => {
        axios
        .get("api/dashboard/states")
        .then((res) => {
            setChartData(res.data)
            const year_last = res.data.years?.[0]?.years || []
            setSelectedYear(year_last[0].toString())
        })
        .catch((error) => {
            console.error("Erro ao buscar dados estaduais", error)
        })
    }, [])

    const statesData = chartData.state_totals || []
    const years = chartData.years?.[0]?.years || []


    // Efeito para definir isMounted como true após a montagem no cliente
    useEffect(() => {
        setIsMounted(true);
    }, []); // Executa apenas uma vez após a primeira renderização do cliente

    

    const filteredData = useMemo(() => {
        return transformAndFilterData(statesData, selectedYear);
    }, [selectedYear]);

    const whiteTextStyle = { fill: 'white', fontSize: 12 };

    return (
        <div className="rounded-2xl dark bg-background">
            <Card className="flex flex-col bg-blue-950 shadow-2xl">
                <CardHeader className="items-start pb-0">
                    <CardTitle className="text-white">Atos por Estado e Tipo</CardTitle>

                    {/* FILTRO DE ANO - Não precisa de isMounted, pois é HTML simples */}
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm text-gray-400">Ano:</span>
                        <Select
                            value={selectedYear.toString()}
                            onValueChange={(value) => setSelectedYear(parseInt(value))}
                        >
                            <SelectTrigger className="w-[100px] text-white bg-gray-700 border-gray-600">
                                <SelectValue placeholder="Selecione o Ano" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700">
                                {years.map(year => (
                                    <SelectItem key={year} value={year.toString()} className="text-white">
                                        {year}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                </CardHeader>

                <CardContent className="flex-1 pb-0 ">
                    {/* NOVO: Renderiza o gráfico SÓ SE estiver montado no cliente */}
                    {!isMounted ? (
                        // Placeholder para evitar "jump" de layout (opcional)
                        <div className="flex items-center justify-center h-[400px] text-gray-500">
                            Carregando Gráfico...
                        </div>
                    ) : (
                        <ChartContainer
                            config={chartConfigState}
                            className="mx-auto h-[1000px]"
                        >
                            <BarChart
                                data={filteredData}
                                layout="vertical"
                                margin={{ left: 10, right: 10, top: 10, bottom: 10 }}
                            >
                                <CartesianGrid
                                    horizontal={false}
                                    strokeDasharray="3 3"
                                    stroke="#444444"
                                />

                                <XAxis
                                    type="number"
                                    tick={whiteTextStyle}
                                    stroke="#555555"
                                    tickFormatter={(value) => value.toLocaleString()}
                                />

                                <YAxis
                                    type="category"
                                    dataKey="state_name"
                                    tickLine={false}
                                    tick={whiteTextStyle}
                                    width={100}
                                    stroke="#555555"
                                />

                                <ChartTooltip
                                    content={<ChartTooltipContent
                                        className="bg-gray-800 text-white"
                                        labelClassName="text-white"
                                    />}
                                />

                                <Legend
                                    verticalAlign="top"
                                    height={36}
                                    wrapperStyle={{ color: 'white' }}
                                //formatter={(value) => <span style={{ color: 'white' }}>{chartConfigState[value].label}</span>}
                                />

                                <Bar
                                    dataKey="nomeacoes"
                                    fill="var(--color-nomeacoes)"
                                    radius={[4, 4, 0, 0]}
                                    name={chartConfigState.nomeacoes.label}
                                />

                                <Bar
                                    dataKey="exoneracoes"
                                    fill="var(--color-exoneracoes)"
                                    radius={[4, 4, 0, 0]}
                                    name={chartConfigState.exoneracoes.label}
                                />

                            </BarChart>
                        </ChartContainer>
                    )}
                </CardContent>
                <div className="p-6 pt-0 text-sm text-gray-400">
                    *Os dados são filtrados pelo ano selecionado e ordenados pelo volume de nomeações.
                </div>
            </Card>
        </div>
    )
}