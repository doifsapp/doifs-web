'use client'

import { useEffect, useState, useMemo } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import axios from "axios"
import { TrendingUp, Calendar, ArrowUpRight } from "lucide-react"

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

  const filteredData = useMemo(() => {
    if (!rawData.length || !context) return []
    const now = new Date()
    const daysMap = { "90d": 90, "30d": 30, "7d": 7 }
    const cutoffDate = new Date()
    cutoffDate.setDate(now.getDate() - (daysMap[timeRange] || 90))
    return rawData.filter(item => new Date(item.date) >= cutoffDate)
  }, [rawData, timeRange, context])

  const chartData = useMemo(() => {
    return filteredData.map(item => ({
      date: item.date,
      [context.serieA.key]: item[context.serieA.key] || 0,
      [context.serieB.key]: item[context.serieB.key] || 0,
    }))
  }, [filteredData, context])

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
      color: "#10b981", 
    },
    [context?.serieB.key]: {
      label: context?.serieB.label,
      color: "#a7f3d0", 
    },
  }), [context])

  if (!isClient) {
    return <div className="w-full h-[300px] md:h-[450px] bg-white rounded-3xl border border-slate-100 animate-pulse" />
  }

  return (
    <Card className="rounded-2xl sm:rounded-3xl shadow-sm border-slate-100 bg-white overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4 space-y-0 border-b border-slate-50 py-5 sm:py-6 bg-slate-50/30">
        <div className="grid flex-1 gap-1 text-left">
          <CardTitle className="text-lg sm:text-xl font-black tracking-tight text-slate-800">
            {context?.label} Trimestral
          </CardTitle>
          <CardDescription className="text-slate-500 text-xs sm:text-sm font-medium">
            Comparativo: {context?.serieA.label} vs {context?.serieB.label}
          </CardDescription>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
            <Calendar size={16} className="text-slate-400 hidden sm:block" />
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-full sm:w-[180px] h-9 rounded-xl border-slate-200 bg-white font-semibold text-slate-600 focus:ring-emerald-500/10">
                  <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                  <SelectItem value="90d" className="rounded-lg">Últimos 3 meses</SelectItem>
                  <SelectItem value="30d" className="rounded-lg">Último mês</SelectItem>
                  <SelectItem value="7d" className="rounded-lg">Última semana</SelectItem>
              </SelectContent>
            </Select>
        </div>
      </CardHeader>
      
      <CardContent className="px-2 pt-6 sm:px-8 sm:pt-10">
        {loading ? (
           <div className="h-[250px] sm:h-[350px] w-full flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl animate-pulse text-slate-400 gap-3">
              <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin" />
              <span className="text-xs font-medium italic">Sincronizando...</span>
           </div>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-[250px] sm:h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ left: -15, right: 10 }}>
                <defs>
                  <linearGradient id="fillA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartConfig[context.serieA.key].color} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={chartConfig[context.serieA.key].color} stopOpacity={0.01} />
                  </linearGradient>
                  <linearGradient id="fillB" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartConfig[context.serieB.key].color} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={chartConfig[context.serieB.key].color} stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  minTickGap={25}
                  tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("pt-BR", { month: "short", day: "numeric" });
                  }}
                />
                <YAxis 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fill: '#64748b', fontSize: 10 }} 
                />
                <ChartTooltip
                  cursor={{ stroke: '#e2e8f0', strokeWidth: 1 }}
                  content={
                      <ChartTooltipContent 
                          className="rounded-xl border-slate-100 shadow-lg"
                          labelFormatter={(v) => new Date(v).toLocaleDateString("pt-BR", { day: 'numeric', month: 'long' })} 
                          indicator="dot" 
                      />
                  }
                />
                <Area
                  dataKey={context.serieB.key}
                  type="monotone"
                  fill="url(#fillB)"
                  stroke={chartConfig[context.serieB.key].color}
                  strokeWidth={2}
                  stackId="a"
                />
                <Area
                  dataKey={context.serieA.key}
                  type="monotone"
                  fill="url(#fillA)"
                  stroke={chartConfig[context.serieA.key].color}
                  strokeWidth={3}
                  stackId="a"
                />
                <ChartLegend content={<ChartLegendContent className="pt-4 text-[10px] sm:text-xs" />} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>

      <CardFooter className="border-t border-slate-50 bg-slate-50/20 py-5 sm:py-6 px-5 sm:px-8">
        <div className="flex flex-col sm:flex-row w-full items-start sm:items-center justify-between gap-4">
          <div className="grid gap-1">
            <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-slate-800 leading-none">
              {totalSpecificSum.toLocaleString('pt-BR')} registros <ArrowUpRight className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="text-[10px] sm:text-[12px] font-medium text-slate-400">
              Total do período selecionado
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
             <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
             <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-tight">Consolidado</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}