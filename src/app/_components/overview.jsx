'use client'

import React, { useState, useEffect, useMemo, useRef } from 'react';
import axios from 'axios';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Info,
  BarChart3,
  TrendingUp,
  Filter,
  ChevronLeft
} from 'lucide-react';

// --- Sub-componente: Círculo de Progresso ---
const MiniProgress = ({ percent }) => {
  const data = [{ value: percent }, { value: 100 - percent }];
  const COLORS = ['#10b981', '#f1f5f9'];

  return (
    <div className="flex flex-col items-center justify-center relative w-[48px] h-[48px] sm:w-[56px] sm:h-[56px] flex-shrink-0">
      <PieChart width={56} height={56}>
        <Pie
          data={data}
          innerRadius={14}
          outerRadius={20}
          dataKey="value"
          stroke="none"
          startAngle={90}
          endAngle={-270}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
      </PieChart>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[8px] sm:text-[9px] font-bold text-slate-700">{percent.toFixed(0)}%</span>
      </div>
    </div>
  );
};

// --- Sub-componente: Stat Card ---
const StatCard = ({ title, value, totalGeneral }) => {
  const percentage = totalGeneral > 0 ? (value / totalGeneral) * 100 : 0;

  return (
    <div className="
      bg-white p-4 rounded-2xl border border-slate-100 shadow-sm 
      flex flex-col justify-between
      min-h-[115px] sm:h-[125px] 
      hover:shadow-md hover:border-emerald-100 transition-all group
      min-w-0 w-full
    ">
      {/* Título: Ocupa a linha superior */}
      <div className="w-full mb-1">
        <p className="text-slate-400 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider truncate block">
          {title}
        </p>
      </div>

      {/* Conteúdo Central: Agora expandido */}
      <div className="flex items-end justify-between gap-2 mt-auto">

        {/* div do Valor e Descrição (Área amarela preenchida aqui com flex-1) */}
        <div className="flex-1 flex flex-col min-w-0">
          <h3 className="
            text-xl sm:text-2xl font-bold tracking-tight text-slate-700 
            truncate leading-none mb-1
          ">
            {value?.toLocaleString() || 0}
          </h3>
          <p className="text-[9px] sm:text-[10px] text-slate-400 font-medium italic opacity-70 truncate">
            Participação
          </p>
        </div>

        {/* Círculo de Progresso: Mantém seu tamanho fixo à direita */}
        <div className="flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
          <MiniProgress percent={percentage} />
        </div>
      </div>
    </div>
  );
};
export function Overview() {
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(2024);

  const [showHelp, setShowHelp] = useState(true);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    axios.get("api/dashboard/totals")
      .then((res) => {
        setApiData(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      // Retorna o ícone se o usuário estiver no início (<= 10px)
      setShowHelp(scrollLeft <= 10);
    }
  };

  const chartData = useMemo(() => {
    if (!apiData?.monthly_totals) return [];
    return apiData.monthly_totals.filter(item => item.year === selectedYear);
  }, [apiData, selectedYear]);

  if (loading) return (
    <div className="p-12 w-full flex flex-col items-center justify-center animate-in fade-in">
      <BarChart3 className="w-10 h-10 text-emerald-400 animate-pulse mb-4" />
      <p className="text-slate-500 text-sm font-medium">Carregando indicadores...</p>
    </div>
  );

  const counts = apiData?.count_by_type_all_time || {};
  const totalGeral = apiData?.total_count || 0;

  const categories = [
    { title: "Nomeações", val: counts.total_nomeação },
    { title: "Exonerações", val: counts.total_exoneração },
    { title: "Afastamentos", val: counts.total_afastamento },
    { title: "Aposentadorias", val: counts.total_aposentadoria },
    { title: "Pensões", val: counts.total_pensão },
    { title: "Demissões", val: counts.total_demissão },
    { title: "Dispensas", val: counts.total_dispensa },
    { title: "Designações", val: counts.total_designação },
    { title: "Substituições", val: counts.total_substituição },
  ];

  return (
    <div className="w-full bg-slate-50/50 animate-in slide-in-from-bottom-3 duration-500">
      <div className="max-w-7xl mx-auto pb-10 lg:pt-24 xl:pt-0 xl:pb-0">


        {/* Cabeçalho com fundo para melhor agrupamento visual */}
        <div className="
          bg-white p-4 sm:p-6 rounded-3xl border border-slate-100 shadow-sm 
          flex flex-col sm:flex-row sm:items-center gap-3 
          mb-8 sm:mb-12">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-50 p-2.5 rounded-2xl">
              <TrendingUp size={24} className="text-emerald-600 flex-shrink-0" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tighter text-slate-900">
              Visão Geral
            </h1>
          </div>

          <span className="
    bg-emerald-50 text-emerald-700 text-[10px] font-bold 
    px-4 py-2 rounded-full border border-emerald-100 
    sm:ml-auto flex items-center gap-1.5 self-start sm:self-center
  ">
            <Info size={14} />
            Total: {totalGeral.toLocaleString()}
          </span>
        </div>

        {/* Seção de Cards */}
        <div className="flex flex-col gap-4 mb-8">

          <div className="bg-emerald-600 p-6 rounded-2xl shadow-lg shadow-emerald-200 flex flex-col justify-between h-[120px] lg:hidden">
            <p className="text-emerald-50 text-[10px] font-bold uppercase tracking-wider">Acumulado Geral</p>
            <h3 className="text-3xl font-black tracking-tighter text-white">
              {totalGeral.toLocaleString()}
            </h3>
            <p className="text-emerald-100 text-[10px] font-medium italic">Atos desde 2018</p>
          </div>

          <div className="relative">
            {/* Ícone de Ajuda (Fixo sobre o padding, sem empurrar cards) */}
            <div className={`
              absolute left-[-4px] top-0 bottom-0 w-12 z-20 flex items-center justify-center lg:hidden pointer-events-none 
              transition-all duration-300
              ${showHelp ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}
            `}>
              <div className="bg-white shadow-xl w-10 h-10 rounded-full flex justify-center items-center border border-slate-100 text-emerald-600">
                <ChevronLeft size={24} />
              </div>
            </div>

            {/* Container do Carrossel / Grid */}
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="flex items-stretch overflow-x-auto pb-4 gap-4 snap-x snap-mandatory scrollbar-hide lg:grid lg:grid-cols-5 lg:overflow-visible lg:pb-0 pl-10 lg:pl-0"
            >
              {categories.map((item, idx) => (
                /* Aumentado de 50% para 85% da largura na faixa mobile/tablet */
                <div key={idx} className="min-w-[50%] sm:min-w-[45%] lg:min-w-full snap-center flex-shrink-0">
                  <StatCard
                    title={item.title}
                    value={item.val}
                    totalGeneral={totalGeral}
                  />
                </div>
              ))}

              <div className="hidden lg:flex bg-emerald-600 p-6 rounded-2xl shadow-lg shadow-emerald-200 flex-col justify-between h-[120px] transition-transform hover:scale-[1.02]">
                <p className="text-emerald-50 text-[11px] font-bold uppercase tracking-wider">Acumulado Geral</p>
                <h3 className="text-4xl font-black tracking-tighter text-white">
                  {totalGeral.toLocaleString()}
                </h3>
                <p className="text-emerald-100 text-[11px] font-medium italic">Atos desde 2018</p>
              </div>
            </div>
          </div>
        </div>

        {/* Gráfico */}
        <div className="bg-white p-4 sm:p-8 rounded-2xl border border-slate-100 shadow-sm mt-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div className="flex items-center gap-3">
              <BarChart3 size={20} className="text-emerald-600" />
              <h2 className="text-lg font-extrabold text-slate-800 tracking-tight">Evolução Mensal</h2>
            </div>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all"
            >
              {[2026, 2025, 2024, 2023, 2022, 2019, 2018].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div className="h-[250px] sm:h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                <Area type="monotone" dataKey="total" stroke="#10b981" strokeWidth={3} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}