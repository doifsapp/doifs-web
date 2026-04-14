'use client'

import { FileText, Calendar, Tag, ExternalLink } from "lucide-react";

export function CardPub({ pubss }) {
  // A data já vem formatada (dd/mm/yyyy) do searchContent
  
  return (
    // AJUSTE PAI: flex-col por padrão (mobile), flex-row no sm (tablet+)
    <div className="group relative flex flex-col sm:flex-row sm:items-center justify-between p-5 md:p-6 mb-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:border-emerald-400 transition-all duration-300 gap-4 md:gap-6">
      
      {/* Container Esquerdo: Ícone + Textos */}
      {/* AJUSTE: items-center no mobile para alinhar ícone e texto centralizados */}
      <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-4 md:gap-5 flex-1 min-w-0">
        
        {/* Ícone de Documento - Ajuste de tamanho responsivo */}
        <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
          <FileText size={28} className="md:size-[32px]" />
        </div>

        {/* Bloco de Textos - min-w-0 para evitar quebra de layout por texto longo */}
        <div className="space-y-3 flex-1 min-w-0 w-full">
          <div>
            {/* Título/Ordinance - Ajuste de fonte responsiva */}
            <a 
              href={pubss.url} 
              target="_blank"
              rel="noopener noreferrer"
              className="text-base md:text-lg font-bold text-slate-900 hover:text-emerald-700 hover:underline decoration-2 underline-offset-4 transition-colors flex items-center justify-center sm:justify-start gap-2 leading-snug break-words"
            >
              {pubss.ordinance}
              <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </a>
            
            {/* Instituto - Fonte ajustada e flex-wrap para não quebrar */}
            <p className="text-sm md:text-base font-medium text-slate-600 flex flex-wrap items-center justify-center sm:justify-start gap-x-2 gap-y-1 mt-2 leading-relaxed">
              <span className="text-emerald-600 font-extrabold tracking-wide flex-shrink-0">{pubss.acronym}</span>
              <span className="text-slate-300 text-xl hidden sm:inline">•</span>
              <span className="break-words">{pubss.institute}</span>
            </p>
          </div>

          {/* Tags - flex-wrap garante que elas quebrem linha e não cortem */}
          {pubss.tags && pubss.tags.length > 0 && (
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3 w-full">
              {pubss.tags.map((tag, idx) => (
                <span 
                  key={idx} 
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200 group-hover:border-emerald-200 group-hover:bg-white transition-colors whitespace-nowrap"
                >
                  <Tag size={12} className="flex-shrink-0" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Badges Laterais e Data - Layout robusto e alinhado */}
      {/* AJUSTE: flex-row no mobile (badges lado a lado) e flex-col no sm (empilhados à direita) */}
      <div className="flex flex-row items-center justify-center sm:flex-col sm:items-end gap-3 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 w-full sm:w-auto">
        <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs md:text-sm font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-sm whitespace-nowrap">
          {pubss.type}
        </span>
        
        <div className="flex items-center text-xs md:text-sm font-medium text-slate-500 gap-2 px-1 whitespace-nowrap">
          <Calendar size={16} className="text-slate-400 flex-shrink-0" />
          <span>{pubss.date}</span>
        </div>
      </div>

    </div>
  );
}