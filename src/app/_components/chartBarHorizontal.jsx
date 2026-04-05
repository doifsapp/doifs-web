'use client'

import { useEffect, useState, useMemo } from "react"
import { TrendingUp, Award, Building2, BarChart3 } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LabelList, ResponsiveContainer, Text } from "recharts" // Importado 'Text'
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

// --- Sub-componente: Custom Tick para truncar texto ---
// Isso garante que nomes longos como "Sudeste MG" não quebrem o layout.
const CustomYAxisTick = (props) => {
  const { x, y, payload } = props;
  
  return (
    <Text
      x={x}
      y={y}
      width={75} // Largura máxima do texto antes de truncar
      textAnchor="end"
      verticalAnchor="middle"
      className="fill-slate-600 font-bold text-[11px]"
      scaleToFit={false}
      style={{fontFamily: 'inherit'}}
    >
      {payload.value}
    </Text>
  );
};

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

  const chartConfig = useMemo(() => ({
    [context?.serieA.key]: {
      label: context?.serieA.label,
      color: "#059669", 
    },
    [context?.serieB.key]: {
      label: context?.serieB.label,
      color: "#a7f3d0", 
    },
  }), [context])

  if (!isClient) return <div className="w-full h-[450px] md:h-[500px] bg-white rounded-3xl border border-slate-100 animate-pulse" />

  return (
    <Card className="rounded-2xl sm:rounded-3xl shadow-sm border-slate-100 bg-white h-full overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="border-b border-slate-50 bg-slate-50/30 py-5 px-6 sm:py-6 sm:px-8">
        <div className="flex items-center justify-between gap-4">
          <div className="grid gap-1">
            <CardTitle className="text-lg sm:text-xl font-black tracking-tight text-slate-800 flex items-center gap-2">
              <Award className="text-emerald-500 shrink-0" size={18} />
              <span className="truncate">Top 10 - {context?.label}</span>
            </CardTitle>
            <CardDescription className="text-slate-500 text-xs sm:text-sm font-medium line-clamp-1">
              Ranking por volume de publicações
            </CardDescription>
          </div>
          <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm hidden sm:block">
            <BarChart3 size={18} className="text-slate-400" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6 px-1 sm:pt-8 sm:px-8"> {/* Ajuste sutil de padding lateral */}
        {loading ? (
          <div className="h-[350px] sm:h-[400px] flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl animate-pulse text-slate-400 gap-3">
            <div className="w-6 h-6 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin" />
            <span className="text-xs font-medium italic">Gerando ranking...</span>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="min-h-[350px] sm:min-h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                // AJUSTE: Aumentada a margem esquerda (de -10 para 5) 
                // para dar espaço ao novo Tick customizado.
                margin={{ left: 5, right: 35, top: 0, bottom: 0 }}
                barGap={0}
              >
                <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                <YAxis
                  dataKey="displayName"
                  type="category"
                  tickLine={false}
                  tickMargin={8}
                  axisLine={false}
                  // AJUSTE: Aumentada a largura do eixo (de 55 para 85)
                  width={85} 
                  // AJUSTE: Usando componente customizado para renderizar e truncar o texto
                  tick={<CustomYAxisTick />} 
                />
                <XAxis type="number" hide />
                
                <ChartTooltip
                  cursor={{ fill: "#f8fafc" }}
                  content={
                    <ChartTooltipContent 
                      className="rounded-xl border-slate-100 shadow-xl p-3"
                      hideLabel 
                    />
                  }
                />

                <Bar
                  dataKey={context.serieA.key}
                  stackId="a"
                  fill={chartConfig[context.serieA.key].color}
                  barSize={20}
                />
                <Bar
                  dataKey={context.serieB.key}
                  stackId="a"
                  fill={chartConfig[context.serieB.key].color}
                  radius={[0, 4, 4, 0]}
                  barSize={20}
                >
                  <LabelList
                    dataKey="totalContext"
                    position="right"
                    offset={10}
                    className="fill-slate-800 font-black"
                    fontSize={11}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>

      <CardFooter className="flex-col items-start gap-3 border-t border-slate-50 bg-slate-50/20 py-5 px-6 sm:py-6 sm:px-8 mt-4">
        <div className="flex flex-col sm:flex-row w-full items-start sm:items-center justify-between gap-4">
          <div className="grid gap-1">
            <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-slate-800 leading-none">
              {totalRankingSum.toLocaleString('pt-BR')} atos <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="text-[10px] sm:text-[12px] font-medium text-slate-400">
              Soma do Top 10 Institucional
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
             <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-tight">Gestão Anual</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}