'use client'

import { useEffect, useState, useMemo } from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import axios from "axios"
import { TrendingUp } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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

export function ChartArea({ context }) {
  const [timeRange, setTimeRange] = useState("90d")
  const [rawData, setRawData] = useState([])
  const [isClient, setIsClient] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setIsClient(true)
    async function fetchData() {
      setLoading(true)
      try {
        const response = await axios.get(`api/dashboard/periodic`)
        setRawData(response.data.periodic_types || [])
      } catch (error) {
        console.error("Erro ao carregar dados do gráfico:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // 1. Filtro de tempo
  const filteredData = useMemo(() => {
    if (!rawData.length || !context) return []
    const now = new Date()
    const daysMap = { "90d": 90, "30d": 30, "7d": 7 }
    const cutoffDate = new Date()
    cutoffDate.setDate(now.getDate() - (daysMap[timeRange] || 90))
    return rawData.filter(item => new Date(item.date) >= cutoffDate)
  }, [rawData, timeRange, context])

  // 2. Mapeamento para o Recharts
  const chartData = useMemo(() => {
    return filteredData.map(item => ({
      date: item.date,
      [context.serieA.key]: item[context.serieA.key] || 0,
      [context.serieB.key]: item[context.serieB.key] || 0,
    }))
  }, [filteredData, context])

  // 3. NOVA REGRA DE SOMA: Apenas os tipos do contexto atual
  const totalSpecificSum = useMemo(() => {
    return filteredData.reduce((acc, item) => {
      const valA = item[context.serieA.key] || 0
      const valB = item[context.serieB.key] || 0
      return acc + valA + valB
    }, 0)
  }, [filteredData, context])

  const chartConfig = useMemo(() => ({
    [context?.serieA.key]: {
      label: context?.serieA.label,
      color: "hsl(210 40% 50%)",
    },
    [context?.serieB.key]: {
      label: context?.serieB.label,
      color: "hsl(210 40% 80%)",
    },
  }), [context])

  if (!isClient) {
    return <div className="w-full h-[450px] bg-white rounded-2xl border border-gray-100 animate-pulse" />
  }

  return (
    <Card className="rounded-2xl shadow-sm border-gray-100 bg-white">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle className="text-xl font-bold text-slate-800">
            {context?.label}
          </CardTitle>
          <CardDescription>
            Análise de {context?.serieA.label} vs {context?.serieB.label}
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto">
            <SelectValue placeholder="Últimos 3 meses" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d">Últimos 3 meses</SelectItem>
            <SelectItem value="30d">Último mês</SelectItem>
            <SelectItem value="7d">Última semana</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {loading ? (
           <div className="h-[350px] w-full flex items-center justify-center bg-slate-50 rounded-lg animate-pulse text-slate-400 italic text-sm">
              Sincronizando dados...
           </div>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-[350px] w-full">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fillA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartConfig[context.serieA.key].color} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={chartConfig[context.serieA.key].color} stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillB" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartConfig[context.serieB.key].color} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={chartConfig[context.serieB.key].color} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => new Date(value).toLocaleDateString("pt-BR", { month: "short", day: "numeric" })}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent labelFormatter={(v) => new Date(v).toLocaleDateString("pt-BR", { day: 'numeric', month: 'long', year: 'numeric' })} indicator="dot" />}
              />
              <Area
                dataKey={context.serieB.key}
                type="natural"
                fill="url(#fillB)"
                stroke={chartConfig[context.serieB.key].color}
                stackId="a"
              />
              <Area
                dataKey={context.serieA.key}
                type="natural"
                fill="url(#fillA)"
                stroke={chartConfig[context.serieA.key].color}
                stackId="a"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>

      <CardFooter className="border-t pt-4">
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none text-slate-700">
              Total de {totalSpecificSum.toLocaleString('pt-BR')} registros no período <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {/* Texto explicativo atualizado */}
              Soma de {context?.serieA.label} e {context?.serieB.label} no intervalo selecionado
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}