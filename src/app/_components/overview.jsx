import React, { useState } from 'react';
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
import { TrendingUp, TrendingDown } from 'lucide-react';

// --- Dados de Exemplo (Agora a taxa controla o gráfico) ---
const cardStats = [
  { id: 1, titulo: "Resumo Nomeações", total: 200, taxa: -36, hasChart: true },
  { id: 2, titulo: "Resumo Exonerações", total: 150, taxa: 45, hasChart: true },
  { id: 3, titulo: "Resumo Afastamentos", total: 80, taxa: 8, hasChart: true },
  { id: 4, titulo: "Resumo Aposentadorias", total: 40, taxa: 25, hasChart: true },
  { id: 5, titulo: "Resumo Pensão", total: 15, taxa: 5, hasChart: true },
  { id: 6, titulo: "Resumo Demissão", total: 5, taxa: 2, hasChart: true },
  { id: 7, titulo: "Resumo Dispensa", total: 110, taxa: 60, hasChart: true },
  { id: 8, titulo: "Resumo Designação", total: 300, taxa: 85, hasChart: true },
  { id: 9, titulo: "Resumo Substituição", total: 190, taxa: 30, hasChart: true },
  { id: 10, titulo: "Resumo Total geral", total: 2000, hasChart: false },
];

const chartDataRaw = [
  { total: 4000, year: 2024, month: "Jan" }, { total: 3200, year: 2024, month: "Fev" },
  { total: 4500, year: 2024, month: "Mar" }, { total: 3800, year: 2024, month: "Abr" },
  { total: 5000, year: 2024, month: "Mai" }, { total: 4200, year: 2024, month: "Jun" },
  { total: 3900, year: 2024, month: "Jul" }, { total: 40, year: 2024, month: "Ago" },
  { total: 4600, year: 2024, month: "Set" }, { total: 480, year: 2024, month: "Out" },
  { total: 5200, year: 2024, month: "Nov" }, { total: 550, year: 2024, month: "Dez" },
];

// --- Sub-componente: Mini Pie Chart DINÂMICO ---
const MiniPie = ({ percent }) => {
  // Garante que o valor seja absoluto para o gráfico e não passe de 100
  const safePercent = Math.min(Math.abs(percent), 100);
  const data = [
    { value: safePercent }, 
    { value: 100 - safePercent }
  ];
  
  // Se a taxa for positiva, azul. Se for negativa, usamos um tom de alerta ou mantemos o padrão.
  const COLORS = [percent >= 0 ? '#3b82f6' : '#ef4444', '#f1f5f9'];

  return (
    <PieChart width={42} height={42}>
      <Pie 
        data={data} 
        innerRadius={13} 
        outerRadius={19} 
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
  );
};

// --- Sub-componente: Stat Card ---
const StatCard = ({ item }) => {
  const isPositive = item.taxa >= 0;
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between h-[115px] hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="max-w-[65%]">
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider leading-tight">
            {item.titulo}
          </p>
          <h3 className="text-xl font-extrabold text-slate-800 mt-1">
            {item.total.toLocaleString()}
          </h3>
        </div>
        {/* Passamos a taxa para o gráfico ser gerado dinamicamente */}
        {item.hasChart && <MiniPie percent={item.taxa || 0} />}
      </div>
      
      {item.taxa !== undefined && (
        <div className={`flex items-center text-[11px] font-bold ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
          {isPositive ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
          {Math.abs(item.taxa)}%
        </div>
      )}
    </div>
  );
};

export function Overview() {
  const [selectedYear, setSelectedYear] = useState(2024);

  return (
    <div className="w-full bg-slate-50 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Grid de Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {cardStats.map((item) => (
            <StatCard key={item.id} item={item} />
          ))}
        </div>

        {/* Área do Gráfico Principal */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Performance Over Time</h2>
              <p className="text-gray-400 text-sm">Volume mensal de atos registrados</p>
            </div>
            
            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-slate-50 border border-gray-200 rounded-lg px-4 py-2 text-sm font-bold text-slate-600 outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer shadow-sm"
            >
              <option value={2024}>2024</option>
              <option value={2023}>2023</option>
            </select>
          </div>

          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartDataRaw} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.01}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}}
                  dy={15}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                    fontSize: '12px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#3b82f6" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorTotal)" 
                  animationDuration={1200}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}