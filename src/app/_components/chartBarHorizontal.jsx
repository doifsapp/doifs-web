"use client"

import { useEffect, useState } from "react"
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"

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

export const description = "Stacked bar chart showing Top 10 directors acts (Nomeações vs Exonerações) in Dark Mode."

// Mock Data Top 10 Diretores com Nomeações/Exonerações e Instituições
/*
const chartData = [
    {
        'director': 'Dr. João Silva de Oliveira Filho',
        'institute': 'IFAL',
        'director_institute': 'Dr. João S. de O. Filho - IFAL', 
        'total_acts': 987,
        'nomeacoes': 438,
        'exoneracoes': 549
    },
    {
        'director': 'Dra. Maria Aparecida Rodrigues',
        'institute': 'IFCE',
        'director_institute': 'Dra. M. Aparecida R. - IFCE',
        'total_acts': 852,
        'nomeacoes': 441,
        'exoneracoes': 411
    },
    {
        'director': 'Eng. Pedro Henrique Vasconcelos',
        'institute': 'IFSP',
        'director_institute': 'Eng. Pedro H. Vasconcelos - IFSP',
        'total_acts': 745,
        'nomeacoes': 418,
        'exoneracoes': 327
    },
    {
        'director': 'Prof. Ana Cláudia Pereira Santos',
        'institute': 'IFRJ',
        'director_institute': 'Prof. Ana C. P. Santos - IFRJ',
        'total_acts': 698,
        'nomeacoes': 280,
        'exoneracoes': 418
    },
    {
        'director': 'Sr. Carlos Alberto Guimarães',
        'institute': 'IFMG',
        'director_institute': 'Sr. Carlos A. Guimarães - IFMG',
        'total_acts': 610,
        'nomeacoes': 342,
        'exoneracoes': 268
    },
    {
        'director': 'Sra. Fernanda Lima Azevedo',
        'institute': 'IFRS',
        'director_institute': 'Sra. Fernanda L. Azevedo - IFRS',
        'total_acts': 550,
        'nomeacoes': 296,
        'exoneracoes': 254
    },
    {
        'director': 'Dr. Roberto Gomes da Costa',
        'institute': 'IFPE',
        'director_institute': 'Dr. Roberto G. da Costa - IFPE',
        'total_acts': 490,
        'nomeacoes': 229,
        'exoneracoes': 261
    },
    {
        'director': 'Msc. Patrícia Mendes Rocha',
        'institute': 'IFPR',
        'director_institute': 'Msc. Patrícia M. Rocha - IFPR',
        'total_acts': 412,
        'nomeacoes': 177,
        'exoneracoes': 235
    },
    {
        'director': 'Sr. José Paulo Medeiros',
        'institute': 'IFPB',
        'director_institute': 'Sr. José P. Medeiros - IFPB',
        'total_acts': 365,
        'nomeacoes': 215,
        'exoneracoes': 150
    },
    {
        'director': 'Dra. Juliana Ferreira Campos',
        'institute': 'IFTO',
        'director_institute': 'Dra. Juliana F. Campos - IFTO',
        'total_acts': 290,
        'nomeacoes': 135,
        'exoneracoes': 155
    }
];
*/

// Configuração do Gráfico (com cores Azuis - Mantidas para Dark Mode)
const chartConfig = {
    'total_acts': {
        'label': 'Total de Atos'
    },
    'nomeacoes': {
        'label': 'Nomeações',
        // Azul Principal (Funciona bem em dark mode)
        color: "hsl(210 40% 50%)", 
    },
    'exoneracoes': {
        'label': 'Exonerações',
        // Azul mais claro/escuro (Funciona bem em dark mode)
        color: "hsl(210 40% 70%)",
    },
    'label_total': {
        // Esta variável deve ser branca no seu tema escuro, garantindo contraste. var(--background) oi
        color: "var(--background)", 
    },
};

export function ChartBarLabelCustom() {
  //request
  const [chartData, setChartData] = useState({})
  
  useEffect(() => {
    axios
    .get("api/dashboard/personnel")
    .then((res) => {
      setChartData(res.data)
    })
    .catch((error) => {
      console.error("Erro ao buscar dados de responsáveis", error)
    })
  }, [])

  const personnelData = chartData.tops_personnel || []

  //end request
  const totalAtos = personnelData.reduce((sum, item) => sum + item.total_acts, 0);
  
  // Envolvemos o componente Card na classe 'dark' para forçar o tema escuro.
  return (
    <div className="rounded-2xl dark bg-background"> {/* Adiciona a classe dark e um fundo para visualização */}
      <Card className="bg-blue-950 shadow-2xl">
        <CardHeader>
          <CardTitle>Ranking dos top 10 diretores dos Insttutos Federais com mais atos assinados</CardTitle>
          <CardDescription>Distribuição de nomeações e exonerações no intervalo de um ano.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer 
            config={chartConfig}
            className="aspect-auto h-[400px] w-full"
          >
            <BarChart
              accessibilityLayer
              data={personnelData}
              layout="vertical"
              barSize={18} 
              margin={{
                left: 10,
                right: 40,
                top: 10,
                bottom: 10,
              }}
            >
              <CartesianGrid horizontal={false} />
              
              <YAxis dataKey="responsible" type="category" tickLine={false} tickMargin={10} axisLine={false} hide />
              <XAxis dataKey="total_acts" type="number" hide />
              
              <ChartTooltip
                cursor={{ fill: "transparent" }}
                content={<ChartTooltipContent 
                            indicator="line" 
                            labelKey="responsible"
                            nameKey="label"
                        />}
              />
              
              {/* Bar 1: Nomeações (Azul Escuro) */}
              <Bar
                dataKey="nomeacoes"
                layout="vertical"
                stackId="a" 
                fill={chartConfig.nomeacoes.color} 
                radius={[4, 0, 0, 4]} 
              >
                {/* Rótulo 1: Nome do Diretor e Instituto (Dentro da Barra, em BRANCO) */}
                <LabelList
                  dataKey="responsible_institute"
                  position="insideLeft"
                  offset={10}
                  fill="white"
                  // Esta classe deve renderizar em BRANCO em um tema escuro - fill-[var(--color-label)]
                  className=" font-semibold" 
                  fontSize={12}
                  style={{ textAnchor: 'start' }} 
                />
              </Bar>

              {/* Bar 2: Exonerações (Azul Claro)*/}
              <Bar
                dataKey="exoneracoes"
                layout="vertical"
                stackId="a"
                fill={chartConfig.exoneracoes.color}
                radius={[0, 4, 4, 0]} 
              >
                 {/* Rótulo 2: Contagem TOTAL (No fim da barra, lado de fora) */}
                <LabelList
                  dataKey="total_acts"
                  position="right"
                  offset={8}
                  // Esta classe renderiza a cor de foreground, que em dark mode é BRANCO/CLARO
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 leading-none font-medium">
            Total de Atos analisados no último ano: {totalAtos}
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-muted-foreground leading-none">
            Ranking dos diretores com maior volume de atos, discriminado por Nomeação (Azul Escuro) e Exoneração (Azul Claro).
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}