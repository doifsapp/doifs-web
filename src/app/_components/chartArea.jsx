'use client'

import {useEffect, useState} from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
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
import axios from "axios"

export const description = "An interactive area chart comparing Nomeações and Exonerações over time in Dark Mode."

// Dados mantidos, mas as chaves 'desktop' e 'mobile' agora representam Nomeações e Exonerações oii
/*
const chartData = [
  { date: "2024-04-01", nomeacoes: 222, exoneracoes: 150 },
  { date: "2024-04-02", nomeacoes: 97, exoneracoes: 180 },
  { date: "2024-04-03", nomeacoes: 167, exoneracoes: 120 },
  { date: "2024-04-04", nomeacoes: 242, exoneracoes: 260 },
  { date: "2024-04-05", nomeacoes: 373, exoneracoes: 290 },
  { date: "2024-04-06", nomeacoes: 301, exoneracoes: 340 },
  { date: "2024-04-07", nomeacoes: 245, exoneracoes: 180 },
  { date: "2024-04-08", nomeacoes: 409, exoneracoes: 320 },
  { date: "2024-04-09", nomeacoes: 59, exoneracoes: 110 },
  { date: "2024-04-10", nomeacoes: 261, exoneracoes: 190 },
  { date: "2024-04-11", nomeacoes: 327, exoneracoes: 350 },
  { date: "2024-04-12", nomeacoes: 292, exoneracoes: 210 },
  { date: "2024-04-13", nomeacoes: 342, exoneracoes: 380 },
  { date: "2024-04-14", nomeacoes: 137, exoneracoes: 220 },
  { date: "2024-04-15", nomeacoes: 120, exoneracoes: 170 },
  { date: "2024-04-16", nomeacoes: 138, exoneracoes: 190 },
  { date: "2024-04-17", nomeacoes: 446, exoneracoes: 360 },
  { date: "2024-04-18", nomeacoes: 364, exoneracoes: 410 },
  { date: "2024-04-19", nomeacoes: 243, exoneracoes: 180 },
  { date: "2024-04-20", nomeacoes: 89, exoneracoes: 150 },
  { date: "2024-04-21", nomeacoes: 137, exoneracoes: 200 },
  { date: "2024-04-22", nomeacoes: 224, exoneracoes: 170 },
  { date: "2024-04-23", nomeacoes: 138, exoneracoes: 230 },
  { date: "2024-04-24", nomeacoes: 387, exoneracoes: 290 },
  { date: "2024-04-25", nomeacoes: 215, exoneracoes: 250 },
  { date: "2024-04-26", nomeacoes: 75, exoneracoes: 130 },
  { date: "2024-04-27", nomeacoes: 383, exoneracoes: 420 },
  { date: "2024-04-28", nomeacoes: 122, exoneracoes: 180 },
  { date: "2024-04-29", nomeacoes: 315, exoneracoes: 240 },
  { date: "2024-04-30", nomeacoes: 454, exoneracoes: 380 },
  { date: "2024-05-01", nomeacoes: 165, exoneracoes: 220 },
  { date: "2024-05-02", nomeacoes: 293, exoneracoes: 310 },
  { date: "2024-05-03", nomeacoes: 247, exoneracoes: 190 },
  { date: "2024-05-04", nomeacoes: 385, exoneracoes: 420 },
  { date: "2024-05-05", nomeacoes: 481, exoneracoes: 390 },
  { date: "2024-05-06", nomeacoes: 498, exoneracoes: 520 },
  { date: "2024-05-07", nomeacoes: 388, exoneracoes: 300 },
  { date: "2024-05-08", nomeacoes: 149, exoneracoes: 210 },
  { date: "2024-05-09", nomeacoes: 227, exoneracoes: 180 },
  { date: "2024-05-10", nomeacoes: 293, exoneracoes: 330 },
  { date: "2024-05-11", nomeacoes: 335, exoneracoes: 270 },
  { date: "2024-05-12", nomeacoes: 197, exoneracoes: 240 },
  { date: "2024-05-13", nomeacoes: 197, exoneracoes: 160 },
  { date: "2024-05-14", nomeacoes: 448, exoneracoes: 490 },
  { date: "2024-05-15", nomeacoes: 473, exoneracoes: 380 },
  { date: "2024-05-16", nomeacoes: 338, exoneracoes: 400 },
  { date: "2024-05-17", nomeacoes: 499, exoneracoes: 420 },
  { date: "2024-05-18", nomeacoes: 315, exoneracoes: 350 },
  { date: "2024-05-19", nomeacoes: 235, exoneracoes: 180 },
  { date: "2024-05-20", nomeacoes: 177, exoneracoes: 230 },
  { date: "2024-05-21", nomeacoes: 82, exoneracoes: 140 },
  { date: "2024-05-22", nomeacoes: 81, exoneracoes: 120 },
  { date: "2024-05-23", nomeacoes: 252, exoneracoes: 290 },
  { date: "2024-05-24", nomeacoes: 294, exoneracoes: 220 },
  { date: "2024-05-25", nomeacoes: 201, exoneracoes: 250 },
  { date: "2024-05-26", nomeacoes: 213, exoneracoes: 170 },
  { date: "2024-05-27", nomeacoes: 420, exoneracoes: 460 },
  { date: "2024-05-28", nomeacoes: 233, exoneracoes: 190 },
  { date: "2024-05-29", nomeacoes: 78, exoneracoes: 130 },
  { date: "2024-05-30", nomeacoes: 340, exoneracoes: 280 },
  { date: "2024-05-31", nomeacoes: 178, exoneracoes: 230 },
  { date: "2024-06-01", nomeacoes: 178, exoneracoes: 200 },
  { date: "2024-06-02", nomeacoes: 470, exoneracoes: 410 },
  { date: "2024-06-03", nomeacoes: 103, exoneracoes: 160 },
  { date: "2024-06-04", nomeacoes: 439, exoneracoes: 380 },
  { date: "2024-06-05", nomeacoes: 88, exoneracoes: 140 },
  { date: "2024-06-06", nomeacoes: 294, exoneracoes: 250 },
  { date: "2024-06-07", nomeacoes: 323, exoneracoes: 370 },
  { date: "2024-06-08", nomeacoes: 385, exoneracoes: 320 },
  { date: "2024-06-09", nomeacoes: 438, exoneracoes: 480 },
  { date: "2024-06-10", nomeacoes: 155, exoneracoes: 200 },
  { date: "2024-06-11", nomeacoes: 92, exoneracoes: 150 },
  { date: "2024-06-12", nomeacoes: 492, exoneracoes: 420 },
  { date: "2024-06-13", nomeacoes: 81, exoneracoes: 130 },
  { date: "2024-06-14", nomeacoes: 426, exoneracoes: 380 },
  { date: "2024-06-15", nomeacoes: 307, exoneracoes: 350 },
  { date: "2024-06-16", nomeacoes: 371, exoneracoes: 310 },
  { date: "2024-06-17", nomeacoes: 475, exoneracoes: 520 },
  { date: "2024-06-18", nomeacoes: 107, exoneracoes: 170 },
  { date: "2024-06-19", nomeacoes: 341, exoneracoes: 290 },
  { date: "2024-06-20", nomeacoes: 408, exoneracoes: 450 },
  { date: "2024-06-21", nomeacoes: 169, exoneracoes: 210 },
  { date: "2024-06-22", nomeacoes: 317, exoneracoes: 270 },
  { date: "2024-06-23", nomeacoes: 480, exoneracoes: 530 },
  { date: "2024-06-24", nomeacoes: 132, exoneracoes: 180 },
  { date: "2024-06-25", nomeacoes: 141, exoneracoes: 190 },
  { date: "2024-06-26", nomeacoes: 434, exoneracoes: 380 },
  { date: "2024-06-27", nomeacoes: 448, exoneracoes: 490 },
  { date: "2024-06-28", nomeacoes: 149, exoneracoes: 200 },
  { date: "2024-06-29", nomeacoes: 103, exoneracoes: 160 },
  { date: "2024-06-30", nomeacoes: 446, exoneracoes: 400 },
]

*/

const chartConfig = {
  visitors: {
    label: "Atos",
  },
  nomeacoes: { // Renomeado de desktop
    label: "Nomeações",
    color: "hsl(210 40% 50%)", // Azul Principal
  },
  exoneracoes: { // Renomeado de mobile
    label: "Exonerações",
    color: "hsl(210 40% 70%)", // Azul Claro
  },
} 

export function ChartArea() {
  const [timeRange, setTimeRange] = useState("90d")
  const [chartData, setChartData] = useState({})


  useEffect(() => { //oi
    axios
    .get('api/dashboard/periodic')
    .then((res) => {
      setChartData(res.data)
    })
    .catch((error) => {
      console.error("Erro ao buscar dados periodicos", error)
    })
  }, [])

  //mapeando dados
  const periodicData = chartData.periodic_types || []
  const lastDataDate = periodicData.length > 0
    ? new Date(periodicData[periodicData.length - 1].date)
    : new Date();

  const referenceDate = lastDataDate;
  
  
  const filteredData = periodicData.filter((item) => {
    const date = new Date(item.date)

    //const referenceDate = new Date("2024-06-30")
    
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  // Aplica a classe 'dark' para forçar o tema escuro em todo o componente - 101828
  return (
    <div className="rounded-2xl dark bg-background">
      <Card className="pt-0 bg-blue-950 shadow-2xl">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1">
            <CardTitle>Visão geral de atos de pessoal (nomeações e exonerações)</CardTitle>
            <CardDescription>
              Mostrando o volume de atos dos últimos 3 meses
            </CardDescription>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Últimos 3 meses" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Últimos 3 meses
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Últimos 30 dias
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Últimos 7 dias
              </SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={filteredData}>
              <defs>
                {/* Ajusta o gradiente para Nomeações (Azul Escuro) */}
                <linearGradient id="fillNomeacoes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartConfig.nomeacoes.color} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={chartConfig.nomeacoes.color} stopOpacity={0.1} />
                </linearGradient>
                {/* Ajusta o gradiente para Exonerações (Azul Claro) */}
                <linearGradient id="fillExoneracoes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartConfig.exoneracoes.color} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={chartConfig.exoneracoes.color} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  // Formatado para pt-BR
                  return date.toLocaleDateString("pt-BR", {
                    month: "short",
                    day: "numeric",
                  })
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      // Formatado para pt-BR
                      return new Date(value).toLocaleDateString("pt-BR", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    }}
                    indicator="dot"
                  />
                }
              />
              {/* Área 1: Exonerações (Base da pilha) */}
              <Area
                dataKey="exoneracoes"
                type="natural"
                fill="url(#fillExoneracoes)"
                stroke={chartConfig.exoneracoes.color}
                stackId="a" // Mantido como empilhado (Stacked Area Chart)
              />
              {/* Área 2: Nomeações (Topo da pilha) */}
              <Area
                dataKey="nomeacoes"
                type="natural"
                fill="url(#fillNomeacoes)"
                stroke={chartConfig.nomeacoes.color}
                stackId="a" // Mantido como empilhado (Stacked Area Chart)
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}