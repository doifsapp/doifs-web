'use client'

import { useEffect, useState, useMemo } from "react"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import axios from "axios"
import { TrendingUp, Calendar, Building2, Layers, ArrowRightLeft } from "lucide-react"

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

const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

export function ChartLineMultianual({ context }) {
  const [rawData, setRawData] = useState([])
  const [availableYears, setAvailableYears] = useState([])
  const [isClient, setIsClient] = useState(false)
  const [loading, setLoading] = useState(true)

  const [instituicao, setInstituicao] = useState("IFAC")
  const [activeSerie, setActiveSerie] = useState("both")
  const [anoA, setAnoA] = useState("")
  const [anoB, setAnoB] = useState("")

  useEffect(() => {
    setIsClient(true)
    async function fetchData() {
      setLoading(true)
      try {
        const response = await axios.get('api/dashboard/overview')
        const data = response.data.institutes_overview || []
        
        // Captura e inverte a ordem dos anos aqui
        const years = response.data.years ? [...response.data.years] : []
        
        setRawData(data)
        setAvailableYears(years)
        
        if (years.length >= 2) {
          // Agora, como o array está invertido, os anos mais recentes 
          // estarão no início do array (índice 0 e 1)
          setAnoA(String(years[1]))
          setAnoB(String(years[2]))
        }
      } catch (error) {
        console.error("Erro ao carregar dados multianuais:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const instituicoes = useMemo(() => {
    return Array.from(new Set(rawData.map(item => item.acronym))).sort()
  }, [rawData])

  const chartData = useMemo(() => {
    if (!rawData.length || !context || !anoA || !anoB) return []
    const filteredByInst = rawData.filter(item => item.acronym === instituicao)
    
    return MESES.map(mes => {
      const dataPoint = { month: mes };
      [anoA, anoB].forEach(year => {
        const record = filteredByInst.find(r => r.month === mes && String(r.year) === year)
        if (record) {
          const valA = record[context.serieA.key] || 0
          const valB = record[context.serieB.key] || 0
          
          if (activeSerie === 'serieA') dataPoint[year] = valA
          else if (activeSerie === 'serieB') dataPoint[year] = valB
          else dataPoint[year] = valA + valB
        } else {
          dataPoint[year] = 0
        }
      })
      return dataPoint
    })
  }, [rawData, instituicao, context, anoA, anoB, activeSerie])

  const totalDisplaySum = useMemo(() => {
    return chartData.reduce((acc, curr) => {
      return acc + (curr[anoA] || 0) + (curr[anoB] || 0)
    }, 0)
  }, [chartData, anoA, anoB])

  const chartConfig = {
    [anoA]: { label: `Ano ${anoA}`, color: "#059669" },
    [anoB]: { label: `Ano ${anoB}`, color: "#6ee7b7" },
  }

  if (!isClient) return <div className="w-full h-[350px] md:h-[480px] bg-white rounded-3xl border border-slate-100 animate-pulse" />

  return (
    <Card className="rounded-2xl sm:rounded-3xl shadow-sm border-slate-100 bg-white overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="flex flex-col border-b border-slate-50 p-0 lg:flex-row bg-slate-50/30">
        <div className="flex flex-1 flex-col justify-center gap-1 px-5 py-5 sm:px-8 sm:py-6">
          <CardTitle className="text-lg sm:text-xl font-black tracking-tight text-slate-800">Comparativo Multianual</CardTitle>
          <CardDescription className="text-slate-500 text-xs sm:text-sm font-medium">Análise temporal entre períodos anuais por instituição</CardDescription>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 p-4 lg:border-l border-slate-100 bg-white/50 backdrop-blur-sm">
          <div className="flex flex-1 sm:flex-none items-center gap-2">
            <Layers size={14} className="text-slate-400 hidden sm:block" />
            <Select value={activeSerie} onValueChange={setActiveSerie}>
                <SelectTrigger className="w-full sm:w-[130px] h-9 bg-white rounded-xl border-slate-200 font-semibold text-slate-600 focus:ring-emerald-500/10 text-xs">
                    <SelectValue placeholder="Métrica" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                    <SelectItem value="both">Ambos</SelectItem>
                    <SelectItem value="serieA">{context?.serieA.label}</SelectItem>
                    <SelectItem value="serieB">{context?.serieB.label}</SelectItem>
                </SelectContent>
            </Select>
          </div>

          <div className="flex flex-1 sm:flex-none items-center gap-2">
            <Building2 size={14} className="text-slate-400 hidden sm:block" />
            <Select value={instituicao} onValueChange={setInstituicao}>
                <SelectTrigger className="w-full sm:w-[100px] h-9 bg-white rounded-xl border-slate-200 font-semibold text-slate-600 focus:ring-emerald-500/10 text-xs">
                    <SelectValue placeholder="Inst." />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-100 shadow-xl max-h-[300px]">
                    {instituicoes.map(inst => <SelectItem key={inst} value={inst}>{inst}</SelectItem>)}
                </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl px-2 h-9 shadow-sm w-full sm:w-auto justify-center">
            <Calendar size={14} className="text-slate-400 mr-1" />
            <Select value={anoA} onValueChange={setAnoA}>
              <SelectTrigger className="w-fit border-0 shadow-none focus:ring-0 font-bold text-emerald-600 text-xs px-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                {availableYears.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
              </SelectContent>
            </Select>
            <ArrowRightLeft size={10} className="text-slate-300 mx-0.5" />
            <Select value={anoB} onValueChange={setAnoB}>
              <SelectTrigger className="w-fit border-0 shadow-none focus:ring-0 font-bold text-emerald-400 text-xs px-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                {availableYears.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-2 pt-6 sm:px-8 sm:pt-10">
        {loading ? (
          <div className="h-[250px] sm:h-[350px] flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl animate-pulse text-slate-400 gap-3">
             <div className="w-6 h-6 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin" />
             <span className="text-xs font-medium italic">Cruzando dados...</span>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[250px] sm:h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ left: -15, right: 10 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  dataKey="month" 
                  tickLine={false} 
                  axisLine={false} 
                  tickMargin={10}
                  minTickGap={10}
                  tick={{fill: '#64748b', fontSize: 10, fontWeight: 500}}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{fill: '#94a3b8', fontSize: 10}}
                />
                <ChartTooltip
                  cursor={{ stroke: '#e2e8f0', strokeWidth: 2, strokeDasharray: '5 5' }}
                  content={<ChartTooltipContent className="rounded-xl border-slate-100 shadow-lg" />}
                />
                <Line
                  dataKey={anoA}
                  type="monotone"
                  stroke={chartConfig[anoA]?.color}
                  strokeWidth={3}
                  dot={{ r: 3, fill: chartConfig[anoA]?.color, strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
                <Line
                  dataKey={anoB}
                  type="monotone"
                  stroke={chartConfig[anoB]?.color}
                  strokeWidth={3}
                  dot={{ r: 3, fill: chartConfig[anoB]?.color, strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>

      <CardFooter className="border-t border-slate-50 bg-slate-50/20 py-5 sm:py-6 px-5 sm:px-8">
        <div className="flex flex-col sm:flex-row w-full items-start sm:items-center justify-between gap-4">
          <div className="grid gap-1">
            <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-slate-800 leading-none">
              {totalDisplaySum.toLocaleString('pt-BR')} registros <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="text-[10px] sm:text-[12px] font-medium text-slate-400">
               Total com base nos filtros
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
             <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-tight">Comparativo Multianual</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

/*

<div className="text-[12px] font-medium text-slate-400">
              {activeSerie === 'both' 
                ? `Soma de ${context?.serieA.label} e ${context?.serieB.label}` 
                : `Apenas ${activeSerie === 'serieA' ? context?.serieA.label : context?.serieB.label}`} em {instituicao} ({anoA} vs {anoB})
            </div>

*/