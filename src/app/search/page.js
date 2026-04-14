'use client'

import { Suspense } from "react";
import { Header } from "../_components/header";
import { Form } from "../_components/form";
import { SearchContent } from "../_components/searchContent";

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden flex flex-col">
      <Header />
      
      <main className="flex-1 flex flex-col items-center pt-8 md:pt-12 pb-10 px-4">
        
        {/* Formulário de Busca - Sempre visível para novos filtros */}
        <div className="w-full max-w-5xl mb-8 md:mb-12">
            <Form alwaysShowFilters={false} />
        </div>

        {/* Área de Resultados */}
        <div className="w-full max-w-5xl mx-auto">
            <Suspense fallback={
                <div className="flex flex-col items-center py-20 gap-4">
                    <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                    <p className="text-slate-400 font-medium animate-pulse">Buscando publicações...</p>
                </div>
            }>
                <SearchContent />
            </Suspense>
        </div>

        {/* Fundo decorativo sutil */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-[50%] h-[30%] rounded-full bg-emerald-50/30 blur-[100px]" />
        </div>
      </main>
    </div>
  );
}