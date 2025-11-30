'use client'

import {useEffect, useState, useMemo} from "react"
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
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
import axios from "axios"

export const description = "A Line chart comparing act totals (Nomeações/Exonerações) across multiple selected years for a specific institute."

const INSTITUICOES = [
  'IFAC', 'IFAL', 'IFAP', 'IFAM', 'IFBA', 'IF Baiano', 'IFCE', 'IFB',
  'IFG', 'IF Goiano', 'IFES', 'IFMA', 'IFMG', 'IFNMG', 'IF Sudeste MG',
  'IFSULDEMINAS', 'IFTM', 'IFMT', 'IFMS', 'IFPA', 'IFPB', 'IFPE',
  'IF Sertão PE', 'IFPI', 'IFPR', 'IFRJ', 'IFF', 'IFRN', 'IFRS',
  'IFFar', 'IFSUL', 'IFRO', 'IFRR', 'IFSC', 'IFC', 'IFSP', 'IFS', 'IFTO'
  // ... (Instituições restantes) oi
]

//const ANOS_DISPONIVEIS = [2024, 2023, 2022, 2021, 2020, 2019, 2018];

// Dados provisórios (Meses, Anos, Institutos)
const chartDataAPI = [
  // --- IFAL - 2023 ---
  {'institute': 'IFAC', 'year': 2024, 'month': 'Jan', 'nomeacoes': 3, 'exoneracoes': 0},
    {'institute': 'IFAL', 'year': 2018, 'month': 'Mar', 'nomeacoes': 1, 'exoneracoes': 2},
    {'institute': 'IFAL', 'year': 2018, 'month': 'Jan', 'nomeacoes': 2, 'exoneracoes': 0},
    {'institute': 'IFAL', 'year': 2018, 'month': 'Fev', 'nomeacoes': 5, 'exoneracoes': 1},
    {'institute': 'IFAL', 'year': 2018, 'month': 'Abr', 'nomeacoes': 5, 'exoneracoes': 2},
    {'institute': 'IFAL', 'year': 2018, 'month': 'Mai', 'nomeacoes': 8, 'exoneracoes': 4},
    {'institute': 'IFAL', 'year': 2018, 'month': 'Jun', 'nomeacoes': 4, 'exoneracoes': 2},
    {'institute': 'IFAL', 'year': 2018, 'month': 'Jul', 'nomeacoes': 4, 'exoneracoes': 1},
    {'institute': 'IFAL', 'year': 2018, 'month': 'Ago', 'nomeacoes': 0, 'exoneracoes': 1},
    {'institute': 'IFAL', 'year': 2018, 'month': 'Set', 'nomeacoes': 1, 'exoneracoes': 0},
    {'institute': 'IFAL', 'year': 2018, 'month': 'Out', 'nomeacoes': 0, 'exoneracoes': 1},
    {'institute': 'IFAL', 'year': 2018, 'month': 'Nov', 'nomeacoes': 1, 'exoneracoes': 0},
    {'institute': 'IFAL', 'year': 2018, 'month': 'Dez', 'nomeacoes': 0, 'exoneracoes': 0},
    {'institute': 'IFAL', 'year': 2019, 'month': 'Mar', 'nomeacoes': 10, 'exoneracoes': 2},
    {'institute': 'IFAL', 'year': 2019, 'month': 'Jan', 'nomeacoes': 1, 'exoneracoes': 0},
    {'institute': 'IFAL', 'year': 2019, 'month': 'Fev', 'nomeacoes': 6, 'exoneracoes': 7},
    {'institute': 'IFAL', 'year': 2019, 'month': 'Abr', 'nomeacoes': 21, 'exoneracoes': 11},
    {'institute': 'IFAL', 'year': 2019, 'month': 'Mai', 'nomeacoes': 7, 'exoneracoes': 2},
    {'institute': 'IFAL', 'year': 2019, 'month': 'Jun', 'nomeacoes': 11, 'exoneracoes': 2},
    {'institute': 'IFAL', 'year': 2019, 'month': 'Jul', 'nomeacoes': 0, 'exoneracoes': 0},
    {'institute': 'IFAL', 'year': 2019, 'month': 'Ago', 'nomeacoes': 4, 'exoneracoes': 0},
    {'institute': 'IFAL', 'year': 2019, 'month': 'Set', 'nomeacoes': 3, 'exoneracoes': 0},
    {'institute': 'IFAL', 'year': 2019, 'month': 'Out', 'nomeacoes': 8, 'exoneracoes': 2},
    {'institute': 'IFAL', 'year': 2019, 'month': 'Nov', 'nomeacoes': 9, 'exoneracoes': 0},
    {'institute': 'IFAL', 'year': 2019, 'month': 'Dez', 'nomeacoes': 40, 'exoneracoes': 1},
    {'institute': 'IFAL', 'year': 2020, 'month': 'Mar', 'nomeacoes': 6, 'exoneracoes': 4},
    {'institute': 'IFAL', 'year': 2020, 'month': 'Jan', 'nomeacoes': 8, 'exoneracoes': 2},
    {'institute': 'IFAL', 'year': 2020, 'month': 'Fev', 'nomeacoes': 2, 'exoneracoes': 0},
    {'institute': 'IFAL', 'year': 2020, 'month': 'Abr', 'nomeacoes': 6, 'exoneracoes': 0},
    {'institute': 'IFAL', 'year': 2020, 'month': 'Mai', 'nomeacoes': 14, 'exoneracoes': 2},
    {'institute': 'IFAL', 'year': 2020, 'month': 'Jun', 'nomeacoes': 2, 'exoneracoes': 2},
    {'institute': 'IFAL', 'year': 2020, 'month': 'Jul', 'nomeacoes': 2, 'exoneracoes': 2},
    {'institute': 'IFAL', 'year': 2020, 'month': 'Ago', 'nomeacoes': 2, 'exoneracoes': 2},
    {'institute': 'IFAL', 'year': 2020, 'month': 'Set', 'nomeacoes': 3, 'exoneracoes': 2},
    {'institute': 'IFAL', 'year': 2020, 'month': 'Out', 'nomeacoes': 0, 'exoneracoes': 0},
    {'institute': 'IFAL', 'year': 2020, 'month': 'Nov', 'nomeacoes': 5, 'exoneracoes': 1},
    {'institute': 'IFAL', 'year': 2020, 'month': 'Dez', 'nomeacoes': 12, 'exoneracoes': 3},
    {'institute': 'IFAL', 'year': 2021, 'month': 'Mar', 'nomeacoes': 3, 'exoneracoes': 3},
    {'institute': 'IFAL', 'year': 2021, 'month': 'Jan', 'nomeacoes': 2, 'exoneracoes': 3},
    {'institute': 'IFAL', 'year': 2021, 'month': 'Fev', 'nomeacoes': 4, 'exoneracoes': 3},
    {'institute': 'IFAL', 'year': 2021, 'month': 'Abr', 'nomeacoes': 1, 'exoneracoes': 1},
    {'institute': 'IFAL', 'year': 2021, 'month': 'Mai', 'nomeacoes': 8, 'exoneracoes': 2},
    {'institute': 'IFAL', 'year': 2021, 'month': 'Jun', 'nomeacoes': 3, 'exoneracoes': 2},
    {'institute': 'IFAL', 'year': 2021, 'month': 'Jul', 'nomeacoes': 12, 'exoneracoes': 5},
    {'institute': 'IFAL', 'year': 2021, 'month': 'Ago', 'nomeacoes': 21, 'exoneracoes': 5},
    {'institute': 'IFAL', 'year': 2021, 'month': 'Set', 'nomeacoes': 8, 'exoneracoes': 2},
    {'institute': 'IFAL', 'year': 2021, 'month': 'Out', 'nomeacoes': 7, 'exoneracoes': 1},
    {'institute': 'IFAL', 'year': 2021, 'month': 'Nov', 'nomeacoes': 2, 'exoneracoes': 2},
    {'institute': 'IFAL', 'year': 2021, 'month': 'Dez', 'nomeacoes': 6, 'exoneracoes': 0},
    {'institute': 'IFAL', 'year': 2022, 'month': 'Mar', 'nomeacoes': 2, 'exoneracoes': 1},
    {'institute': 'IFAL', 'year': 2022, 'month': 'Jan', 'nomeacoes': 4, 'exoneracoes': 6},
    {'institute': 'IFAL', 'year': 2022, 'month': 'Fev', 'nomeacoes': 2, 'exoneracoes': 0},
    {'institute': 'IFAL', 'year': 2022, 'month': 'Abr', 'nomeacoes': 19, 'exoneracoes': 3},
    {'institute': 'IFAL', 'year': 2022, 'month': 'Mai', 'nomeacoes': 10, 'exoneracoes': 1},
    {'institute': 'IFAL', 'year': 2022, 'month': 'Jun', 'nomeacoes': 8, 'exoneracoes': 3},
    {'institute': 'IFAL', 'year': 2022, 'month': 'Jul', 'nomeacoes': 8, 'exoneracoes': 3},
    {'institute': 'IFAL', 'year': 2022, 'month': 'Ago', 'nomeacoes': 16, 'exoneracoes': 1},
    {'institute': 'IFAL', 'year': 2022, 'month': 'Set', 'nomeacoes': 14, 'exoneracoes': 2},
    {'institute': 'IFAL', 'year': 2022, 'month': 'Out', 'nomeacoes': 3, 'exoneracoes': 0},
    {'institute': 'IFAL', 'year': 2022, 'month': 'Nov', 'nomeacoes': 4, 'exoneracoes': 1},
    {'institute': 'IFAL', 'year': 2022, 'month': 'Dez', 'nomeacoes': 0, 'exoneracoes': 3},
    {'institute': 'IFAL', 'year': 2023, 'month': 'Mar', 'nomeacoes': 0, 'exoneracoes': 1},
    {'institute': 'IFAL', 'year': 2023, 'month': 'Jan', 'nomeacoes': 1, 'exoneracoes': 7},
    {'institute': 'IFAL', 'year': 2023, 'month': 'Fev', 'nomeacoes': 3, 'exoneracoes': 3},
    {'institute': 'IFAL', 'year': 2023, 'month': 'Abr', 'nomeacoes': 1, 'exoneracoes': 6},
    {'institute': 'IFAL', 'year': 2023, 'month': 'Mai', 'nomeacoes': 5, 'exoneracoes': 2},
    {'institute': 'IFAL', 'year': 2023, 'month': 'Jun', 'nomeacoes': 44, 'exoneracoes': 29},
    {'institute': 'IFAL', 'year': 2023, 'month': 'Jul', 'nomeacoes': 18, 'exoneracoes': 18},
    {'institute': 'IFAL', 'year': 2023, 'month': 'Ago', 'nomeacoes': 2, 'exoneracoes': 1},
    {'institute': 'IFAL', 'year': 2023, 'month': 'Set', 'nomeacoes': 12, 'exoneracoes': 3},
    {'institute': 'IFAL', 'year': 2023, 'month': 'Out', 'nomeacoes': 1, 'exoneracoes': 2},
    {'institute': 'IFAL', 'year': 2023, 'month': 'Nov', 'nomeacoes': 23, 'exoneracoes': 1},
    {'institute': 'IFAL', 'year': 2023, 'month': 'Dez', 'nomeacoes': 34, 'exoneracoes': 0},
    {'institute': 'IFAL', 'year': 2024, 'month': 'Mar', 'nomeacoes': 9, 'exoneracoes': 12},
    {'institute': 'IFAL', 'year': 2024, 'month': 'Jan', 'nomeacoes': 3, 'exoneracoes': 2},
    {'institute': 'IFAL', 'year': 2024, 'month': 'Fev', 'nomeacoes': 5, 'exoneracoes': 9},
    {'institute': 'IFAL', 'year': 2024, 'month': 'Abr', 'nomeacoes': 5, 'exoneracoes': 0},
    {'institute': 'IFAL', 'year': 2024, 'month': 'Mai', 'nomeacoes': 3, 'exoneracoes': 1},
    {'institute': 'IFAL', 'year': 2024, 'month': 'Jun', 'nomeacoes': 1, 'exoneracoes': 2},
    {'institute': 'IFAL', 'year': 2024, 'month': 'Jul', 'nomeacoes': 2, 'exoneracoes': 4},
    {'institute': 'IFAL', 'year': 2024, 'month': 'Ago', 'nomeacoes': 2, 'exoneracoes': 0},
    {'institute': 'IFAL', 'year': 2024, 'month': 'Nov', 'nomeacoes': 0, 'exoneracoes': 0},
    {'institute': 'IFAL', 'year': 2025, 'month': 'Jul', 'nomeacoes': 0, 'exoneracoes': 1},
    {'institute': 'IFAL', 'year': 2025, 'month': 'Ago', 'nomeacoes': 2, 'exoneracoes': 0},
    {'institute': 'IFPB', 'year': 2025, 'month': 'Jan', 'nomeacoes': 1, 'exoneracoes': 0}
];

// Cores base para as duas linhas
const CHART_COLORS = [
  "hsl(210 40% 50%)", // Azul Escuro (Linha 1)
  "hsl(142 71% 45%)", // Verde (Linha 2)
  "hsl(0 72% 51%)",   // Vermelho (Linha 3 - Se precisar)
];

// Configuração do Gráfico (mantém apenas as chaves de ato, pois o ano é dinâmico)
const chartConfig = {
  views: {
    label: "Total de Atos",
  },
  nomeacoes: {
    label: "Nomeações",
  },
  exoneracoes: {
    label: "Exonerações",
  },
}

export function ChartLineMultianual() {
  // Estados para Filtros
  const [instituicaoSelecionada, setInstituicaoSelecionada] = useState(INSTITUICOES[0]);
  const [tipoAto, setTipoAto] = useState("nomeacoes");
  const [charDatat, setChartData] = useState({})
  // 1. Adicionado: Estados para a seleção dos Anos (padrão: 2024 vs 2023)
  const [ano1, setAno1] = useState("2025"); // 2024
  const [ano2, setAno2] = useState("2024"); // 2023

  //requisição
  useEffect(() => {
    axios
    .get("api/dashboard/overview")
    .then((res) => {
      //set
      setChartData(res.data);
      console.log("Ponnto >> ", res.data)
      const anos = res.data.years?.[0]?.years || [];
      if (anos.length >= 2) {
        setAno1(anos[-1].toString());
        setAno2(anos[-2].toString())
      }
    })
    .catch((error) => {
      console.error("Erro ao buscar dados periodicos", error)
    })
  }, [])

  const periodicData = charDatat.institutes_overview || []
  const ANOS_DISPONIVEIS =  charDatat.years?.[0]?.years || [];
  console.log("Anos > ", ANOS_DISPONIVEIS)

  

  // Reorganiza os dados para o formato de comparação do Recharts (Eixo X = Mês)
  const chartData = useMemo(() => {
    // 1. Filtra os dados da API pelo Instituto selecionado
    const dataFiltrada = periodicData.filter(
      (item) => item.institute === instituicaoSelecionada &&
        (item.year.toString() === ano1 || item.year.toString() === ano2)
        
    );

    // 2. Transforma o array para ter o Mês no Eixo X e as duas séries de dados (Ano 1 e Ano 2)
    // O Recharts precisa de um array com 12 objetos (1 por mês)
    const dataAgrupada = dataFiltrada.reduce((acc, item) => {
      // Encontra o objeto do mês correspondente ou cria um novo
      let mesObj = acc.find(d => d.month === item.month);
      if (!mesObj) {
        mesObj = { month: item.month };
        acc.push(mesObj);
      }

      // Adiciona o valor do ato (nomeacoes ou exoneracoes) com a chave dinâmica (ex: '2024')
      mesObj[item.year.toString()] = item[tipoAto]; // item['2024'] = item['nomeacoes']

      return acc;
    }, []);

    // 3. Garante a ordem correta dos meses no eixo X (crucial para gráficos de linha)
    //const ordemMeses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const ordemMeses = ["janeiro", "fevereiro", "marco", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
    

    // Filtra e ordena para garantir que os meses inexistentes (se a API não devolver) sejam removidos
    const dataFinal = ordemMeses
      .map(mes => dataAgrupada.find(item => item.month === mes) || { month: mes }) // Mantém todos os 12 meses, preenche ausentes com objeto vazio
      //.filter(item => item[ano1] || item[ano2]); // Remove meses que não têm dados nos anos selecionados
      if (periodicData.length === 0) {
        return []
      }

    return dataFinal;
  }, [instituicaoSelecionada, tipoAto, ano1, ano2, periodicData]); // Recalcula quando qualquer filtro mudar

  // Título e descrição dinâmicos
  const activeLabel = chartConfig[tipoAto].label;
  const chartTitle = `${activeLabel} Mensais - Comparação Anual`;
  const chartDescription = `Comparando o volume de ${activeLabel.toLowerCase()} para ${instituicaoSelecionada} em ${ano1} e ${ano2}.`;

  // 3. Mapeamento das séries de dados (para as legendas e linhas)
  const series = [
    { key: ano1, label: `Total em ${ano1}`, color: CHART_COLORS[0] },
    { key: ano2, label: `Total em ${ano2}`, color: CHART_COLORS[1] },
  ];

  return (
    <div className="rounded-2xl dark bg-background">
      <Card className="py-0 bg-blue-950 shadow-2xl">
        <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
            <CardTitle>{chartTitle}</CardTitle>
            <CardDescription>{chartDescription}</CardDescription>
          </div>

          <div className="flex flex-wrap items-center justify-end p-4 sm:p-6 gap-3">
            {/* Select 1: Tipo de Ato */}
            <Select value={tipoAto} onValueChange={setTipoAto}>
              <SelectTrigger className="w-[140px] rounded-lg">
                <SelectValue placeholder="Nomeações" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="nomeacoes" className="rounded-lg">Nomeações</SelectItem>
                <SelectItem value="exoneracoes" className="rounded-lg">Exonerações</SelectItem>
              </SelectContent>
            </Select>

            {/* Select 2: Instituição */}
            <Select value={instituicaoSelecionada} onValueChange={setInstituicaoSelecionada}>
              <SelectTrigger className="w-[120px] rounded-lg">
                <SelectValue placeholder="Instituto" />
              </SelectTrigger>
              <SelectContent className="rounded-xl max-h-[300px]">
                {INSTITUICOES.map((instituicao) => (
                  <SelectItem key={instituicao} value={instituicao} className="rounded-lg">
                    {instituicao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Select 3: Ano 1 */}
            <Select value={ano1} onValueChange={setAno1}>
              <SelectTrigger className="w-[100px] rounded-lg">
                <SelectValue placeholder="Ano 1" />
              </SelectTrigger>
              <SelectContent className="rounded-xl max-h-[300px]">
                {ANOS_DISPONIVEIS.map((ano) => (
                  <SelectItem key={ano} value={ano.toString()} className="rounded-lg" disabled={ano.toString() === ano2}>
                    {ano}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Select 4: Ano 2 */}
            <Select value={ano2} onValueChange={setAno2}>
              <SelectTrigger className="w-[100px] rounded-lg">
                <SelectValue placeholder="Ano 2" />
              </SelectTrigger>
              <SelectContent className="rounded-xl max-h-[300px]">
                {ANOS_DISPONIVEIS.map((ano) => (
                  <SelectItem key={ano} value={ano.toString()} className="rounded-lg" disabled={ano.toString() === ano1}>
                    {ano}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="px-2 sm:p-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{ left: 12, right: 12, top: 20 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              {/* Eixo X: Mês do Ano */}
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
              />
              <YAxis
                type="number"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[200px]"
                    // Label agora é o nome do mês
                    labelFormatter={(value) => `Mês: ${value}`}
                    nameKey="label"
                  />
                }
              />

              {/* Renderiza as Linhas Dinamicamente */}
              {series.map((serie, index) => (
                <Line
                  key={serie.key}
                  dataKey={serie.key} // Ex: '2024' ou '2023'
                  name={serie.label}
                  type="monotone"
                  stroke={serie.color}
                  strokeWidth={index === 0 ? 3 : 2} // Linha 1 mais grossa (padrão)
                  dot={true}
                  activeDot={{ r: 6, fill: serie.color, stroke: "black", strokeWidth: 2 }}
                />
              ))}

            </LineChart>
          </ChartContainer>

          {/* Legenda Manual Dinâmica oi*/}
          <div className="flex justify-center mt-4 text-sm text-muted-foreground">
            {series.map((serie) => (
              <div key={serie.key} className="flex items-center space-x-2 ml-4 first:ml-0">
                <span className="h-2 w-4 rounded-full" style={{ backgroundColor: serie.color }}></span>
                <p className="text-sm font-medium">{serie.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <h2 className="text-amber-500">Teste: {periodicData.year}</h2>
    </div>
  )
}