'use client'

import { Header } from "../_components/header";

export function PageLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 overflow-x-hidden">
      <Header />
      
      {/* pt-16 no mobile para não colar no header, md:pt-24 no desktop */}
      <main className="flex flex-col items-center pt-16 md:pt-24 pb-16 px-4">
        
        {/* Título da Página: Ajustado para text-4xl no mobile */}
        <div className="text-center mb-10 md:mb-16 w-full max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 leading-tight">
            {title} <span className="text-[#00a36c]">.</span>
          </h1>
          {subtitle && (
            <p className="mt-4 md:mt-6 text-slate-500 text-base md:text-xl max-w-2xl mx-auto leading-relaxed px-2">
              {subtitle}
            </p>
          )}
        </div>

        {/* Área de Conteúdo */}
        <div className="w-full max-w-5xl mx-auto">
          {children}
        </div>
      </main>

      {/* Fundo decorativo sutil adaptado para mobile */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute -top-[5%] -left-[5%] w-[60%] md:w-[40%] h-[40%] rounded-full bg-emerald-50/50 blur-[80px] md:blur-[120px]" />
      </div>
    </div>
  );
}