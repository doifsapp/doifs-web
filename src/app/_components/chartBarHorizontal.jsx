'use client'

import { useEffect, useState, useMemo } from "react"
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LabelList } from "recharts"
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

  // 1. Processamento e Ranking (Top 10)
  const chartData = useMemo(() => {
    if (!rawData.length || !context) return []

    return rawData
      .map(item => {
        const valA = item[context.serieA.key] || 0
        const valB = item[context.serieB.key] || 0
        return {
          ...item,
          displayName: item.acronym, // Usando a sigla para o eixo Y ficar limpo
          fullName: item.responsible,
          [context.serieA.key]: valA,
          [context.serieB.key]: valB,
          totalContext: valA + valB
        }
      })
      // Ordena do maior para o menor com base na soma dos dois atos do contexto
      .sort((a, b) => b.totalContext - a.totalContext)
      // Pega apenas os 10 primeiros
      .slice(0, 10)
  }, [rawData, context])

  // 2. Cálculo do Total Geral do Ranking para o rodapé
  const totalRankingSum = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.totalContext, 0)
  }, [chartData])

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

  if (!isClient) return <div className="w-full h-[450px] bg-white rounded-2xl border border-gray-100 animate-pulse" />

  return (
    <Card className="rounded-2xl shadow-sm border-gray-100 bg-white h-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-slate-800">
          Top 10 Institutos - {context?.label}
        </CardTitle>
        <CardDescription>
          Volume acumulado de {context?.serieA.label} e {context?.serieB.label} por gestão
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="h-[400px] flex items-center justify-center italic text-slate-400">
            Gerando ranking...
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="min-h-[400px] w-full">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ left: 10, right: 40, top: 10, bottom: 10 }}
            >
              <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="#f1f5f9" />
              <YAxis
                dataKey="displayName"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                width={80}
              />
              <XAxis type="number" hide />
              
              <ChartTooltip
                cursor={{ fill: "transparent" }}
                content={
                  <ChartTooltipContent 
                    hideLabel 
                    formatter={(value, name, props) => (
                      <div className="flex flex-col">
                        <span className="text-[10px] text-muted-foreground uppercase">{props.payload.fullName}</span>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: props.color }} />
                          <span className="font-bold">{value} {name}</span>
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
              />
              <Bar
                dataKey={context.serieB.key}
                stackId="a"
                fill={chartConfig[context.serieB.key].color}
                radius={[0, 4, 4, 0]}
              >
                <LabelList
                  dataKey="totalContext"
                  position="right"
                  offset={10}
                  className="fill-slate-500 font-medium"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 border-t pt-4">
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none text-slate-700">
              Total de {totalRankingSum.toLocaleString('pt-BR')} registros no Top 10 <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground italic">
              Ranking baseado na soma de {context?.serieA.label} e {context?.serieB.label}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}