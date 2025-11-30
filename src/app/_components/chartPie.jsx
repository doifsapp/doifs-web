'use client'

import { TrendingUp } from "lucide-react"
import { Pie, PieChart } from "recharts"
import { useEffect, useState, useMemo} from "react"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import axios from "axios"

// =========================================================================
// 1. DADOS E CONFIGURAÇÃO DE CORES
// =========================================================================
const rawApiDatao = [
    { "region": "norte", "name": "Norte", "nomeacoes": 3500, "exoneracoes": 800 },
    { "region": "nordeste", "name": "Nordeste", "nomeacoes": 8000, "exoneracoes": 2000 },
    { "region": "centro_oeste", "name": "Centro-Oeste", "nomeacoes": 4500, "exoneracoes": 1200 },
    { "region": "sudeste", "name": "Sudeste", "nomeacoes": 10500, "exoneracoes": 2800 },
    { "region": "sul", "name": "Sul", "nomeacoes": 5500, "exoneracoes": 1500 }
];

// Configuração das cores (e Labels) - Usado pela função de transformação e Tooltip
const chartConfig = {
    'total_atos': {
        'label': 'Total de Atos' // MANTIDO
    },
    'norte': {
        'label': 'Região Norte', // MANTIDO
        'color': 'hsl(14, 100%, 70%)'
    },
    'nordeste': {
        'label': 'Região Nordeste', // MANTIDO
        'color': 'hsl(210, 100%, 65%)'
    },
    'centro_oeste': {
        'label': 'Região Centro-Oeste', // MANTIDO
        'color': 'hsl(90, 100%, 45%)'
    },
    'sudeste': {
        'label': 'Região Sudeste', // MANTIDO
        'color': 'hsl(270, 80%, 65%)'
    },
    'sul': {
        'label': 'Região Sul', // MANTIDO
        'color': 'hsl(40, 100%, 65%)'
    }
};

// =========================================================================
// 2. FUNÇÃO DE TRANSFORMAÇÃO (Inclui o 'fill' e o valor como 'total_atos')
// =========================================================================

const transformApiData = (apiData, config) => {

    const mapItem = (item, key) => ({
        region: item.region,
        name: item.name,
        total_atos: item[key],
        // INCLUÍDO NOVAMENTE: Adiciona a cor 'fill' para controle direto do <Pie>
        fill: config[item.region]?.color || '#808080',
    });

    const nomeacoesData = apiData.map(item => mapItem(item, 'nomeacoes'));
    const exoneracoesData = apiData.map(item => mapItem(item, 'exoneracoes'));

    return { nomeacoesData, exoneracoesData };
};

// Aplica a transformação
//const { nomeacoesData, exoneracoesData } = transformApiData(rawApiData, chartConfig);


// =========================================================================
// 3. COMPONENTE AUXILIAR (Rótulo e Gráfico)
// =========================================================================

const CustomPieLabel = (props) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, value, payload, totalAtos } = props;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const percentage = ((value / totalAtos) * 100);

    if (percentage < 3) return null;

    return (
        <text
            x={x}
            y={y}
            fill="white"
            textAnchor="middle"
            dominantBaseline="central"
            className="select-none"
        >
            <tspan x={x} dy={-6} fontSize={12}>{payload.name}</tspan>
            <tspan x={x} dy={14} fontSize={12}>{`${percentage.toFixed(1)}%`}</tspan>
        </text>
    );
};

function SinglePieChart({ data, title, description, colorKey, valueKey }) {
    const totalAtos = data.reduce((sum, item) => sum + item[valueKey], 0);

    return (
        <Card className="flex flex-col p-4 mb-8 bg-blue-950 shadow-2xl">
            <CardHeader className="items-center pb-0">
                <CardTitle className="text-white">{title}</CardTitle> 
                <CardDescription className="text-gray-300">{description}</CardDescription> 
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={{}} // Deixamos o config vazio para que o Tooltip use o formato default e o Pie controle a cor.
                    className="mx-auto aspect-square max-h-[250px] md:max-h-[300px]"
                >
                    <PieChart>
                        <ChartTooltip
                            // Tooltip Customizado para exibir os dados corretamente, já que o config está vazio
                            content={({ payload }) => {
                                if (!payload || payload.length === 0) return null;
                                const item = payload[0].payload;
                                const percentage = ((item[valueKey] / totalAtos) * 100).toFixed(1);
                                return (
                                    <ChartTooltipContent
                                        className="w-[150px]"
                                        hideLabel
                                        formatter={() => [
                                            `${item[valueKey].toLocaleString()} (${percentage}%)`,
                                            item.name
                                        ]}
                                    />
                                );
                            }}
                        />
                        <Pie
                            data={data}
                            dataKey={valueKey}
                            nameKey="name"
                            innerRadius={60}
                            stroke="none"
                            paddingAngle={3}
                            labelLine={false}
                            label={<CustomPieLabel totalAtos={totalAtos} />}
                            fill='fill' // USA A PROPRIEDADE 'fill' DO OBJETO DE DADOS
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm justify-center text-white">
                <div className="flex items-center gap-2 font-medium leading-none">
                    Total de Atos: {totalAtos.toLocaleString()}
                </div>
                <p className="text-xs text-gray-400">
                    Distribuição percentual do volume de atos pelas 5 regiões.
                </p>
            </CardFooter>
        </Card>
    )
}

// =========================================================================
// 4. Componente Principal
// =========================================================================
export function ChartPieRegional() {
    const [chartData, setChartData] = useState({})

    //request
    useEffect(() => {
        axios
        .get("api/dashboard/region")
        .then((res) => {
            setChartData(res.data)
        })
        .catch((error) => {
            console.error("Erro ao buscar dados regionais", error)
        })

    }, [])
    //end request

    const regionData = chartData.region_totals || []
    const {nomeacoesData, exoneracoesData} = useMemo(() => {
        return transformApiData(regionData, chartConfig)
    }, [chartData])

    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

            {/* Gráfico 1: Nomeações por Região */}
            <SinglePieChart
                data={nomeacoesData}
                title="Nomeações por Região Geográfica"
                description="Distribuição do total de Nomeações."
                colorKey="region"
                valueKey="total_atos"
            />

            {/* Gráfico 2: Exonerações por Região */}
            <SinglePieChart
                data={exoneracoesData}
                title="Exonerações por Região Geográfica"
                description="Distribuição do total de Exonerações."
                colorKey="region"
                valueKey="total_atos"
            />
        </div>
    )
}