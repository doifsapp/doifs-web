'use client'

import { useEffect, useState, useMemo } from "react"
import { TrendingUp, Award, Building2, BarChart3 } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LabelList, ResponsiveContainer } from "recharts"
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

export function ChartBarLabelCustom({ context }) {
  const [rawData, setRawData] = useState([])
  const [isClient, setIsClient] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setIsClient(true)
    async function fetchData() {
      setLoading(true)
      try {
        const response = await axios.get("api/dashboard/personnel")
        setRawData(response.data.tops_personnel || [])
      } catch (error) {
        console.error("Erro ao buscar dados do ranking:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const chartData = useMemo(() => {
    if (!rawData.length || !context) return []

    return rawData
      .map(item => {
        const valA = item[context.serieA.key] || 0
        const valB = item[context.serieB.key] || 0
        return {
          ...item,
          displayName: item.acronym,
          fullName: item.responsible,
          [context.serieA.key]: valA,
          [context.serieB.key]: valB,
          totalContext: valA + valB
        }
      })
      .sort((a, b) => b.totalContext - a.totalContext)
      .slice(0, 10)
  }, [rawData, context])

  const totalRankingSum = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.totalContext, 0)
  }, [chartData])

  // --- CONFIGURAÇÃO DE CORES NORMALIZADA (Emerald 600 e Emerald 200) ---
  const chartConfig = useMemo(() => ({
    [context?.serieA.key]: {
      label: context?.serieA.label,
      color: "#059669", // Emerald 600
    },
    [context?.serieB.key]: {
      label: context?.serieB.label,
      color: "#a7f3d0", // Emerald 200
    },
  }), [context])

  if (!isClient) return <div className="w-full h-[500px] bg-white rounded-3xl border border-slate-100 animate-pulse" />

  return (
    <Card className="rounded-3xl shadow-sm border-slate-100 bg-white h-full overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="border-b border-slate-50 bg-slate-50/30 py-6 px-8">
        <div className="flex items-center justify-between">
          <div className="grid gap-1">
            <CardTitle className="text-xl font-black tracking-tight text-slate-800 flex items-center gap-2">
              <Award className="text-emerald-500" size={20} />
              Top 10 Institutos Mais Ativos - {context?.label}
            </CardTitle>
            <CardDescription className="text-slate-500 font-medium">
              Ranking por volume de {context?.serieA.label} e {context?.serieB.label}
            </CardDescription>
          </div>
          <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm hidden sm:block">
            <BarChart3 size={20} className="text-slate-400" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-8 px-4 sm:px-8">
        {loading ? (
          <div className="h-[400px] flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl animate-pulse text-slate-400 gap-3">
            <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin" />
            <span className="text-sm font-medium italic">Gerando ranking de gestão...</span>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="min-h-[400px] w-full">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ left: 0, right: 45, top: 0, bottom: 0 }}
              barGap={0}
            >
              <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="#f1f5f9" />
              <YAxis
                dataKey="displayName"
                type="category"
                tickLine={false}
                tickMargin={12}
                axisLine={false}
                width={70}
                tick={{ fill: '#475569', fontSize: 13, fontWeight: 'bold' }}
              />
              <XAxis type="number" hide />
              
              <ChartTooltip
                cursor={{ fill: "#f8fafc" }}
                content={
                  <ChartTooltipContent 
                    className="rounded-xl border-slate-100 shadow-xl p-3"
                    hideLabel 
                    formatter={(value, name, props) => (
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 border-b border-slate-100 pb-1 mb-1">
                          <Building2 size={12} className="text-emerald-600" />
                          <span className="text-[11px] font-bold text-slate-700 uppercase leading-none">{props.payload.fullName}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: props.color }} />
                            <span className="text-xs text-slate-500">{name}:</span>
                          </div>
                          <span className="text-xs font-black text-slate-800">{value}</span>
                        </div>
                      </div>
                    )}
                  />
                }
              />

              <Bar
                dataKey={context.serieA.key}
                stackId="a"
                fill={chartConfig[context.serieA.key].color}
                radius={[0, 0, 0, 0]} 
                barSize={24}
              />
              <Bar
                dataKey={context.serieB.key}
                stackId="a"
                fill={chartConfig[context.serieB.key].color}
                radius={[0, 6, 6, 0]}
                barSize={24}
              >
                <LabelList
                  dataKey="totalContext"
                  position="right"
                  offset={12}
                  className="fill-slate-800 font-black"
                  fontSize={13}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>

      <CardFooter className="flex-col items-start gap-3 border-t border-slate-50 bg-slate-50/20 py-6 px-8 mt-4">
        <div className="flex w-full items-center justify-between gap-2">
          <div className="grid gap-1">
            <div className="flex items-center gap-2 text-base font-bold text-slate-800 leading-none">
              {totalRankingSum.toLocaleString('pt-BR')} atos no Top 10 <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="text-[12px] font-medium text-slate-400">
              Soma consolidada do ranking baseado no contexto selecionado
            </div>
          </div>
          <div className="hidden md:flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
             <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-tight">Dados de Gestão do Último ano</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}