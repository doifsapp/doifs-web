
import { Header } from "./_components/header";
import { Form } from "./_components/form";
import { TypewriterClient } from "./_components/TypewriterClient";
import { Suspense } from "react";

export default function Home() {
  return (
    // overflow-x-hidden é a trava de segurança contra o "balanço lateral"
    <div className="min-h-screen bg-slate-50 overflow-x-hidden relative flex flex-col">
      <Header />

      {/* pt-16 no mobile e pt-24 no desktop para compensar o header fixo */}
      <main className="flex-1 flex flex-col items-center pt-12 md:pt-24 pb-12 px-4">

        {/* Seção Hero: Altura mínima adaptável para evitar pulos de layout no Typewriter */}
        <div className="text-center mb-10 md:mb-16 w-full max-w-4xl min-h-[160px] md:min-h-[140px] flex flex-col justify-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-800 flex flex-col sm:flex-row items-center justify-center gap-2 md:gap-3">
            <span>DOIFS</span>

            {/* min-w reduzido no mobile para evitar estouro de margem */}
            <span
              className="text-[#00a36c] min-w-[140px] sm:min-w-[220px] text-center sm:text-left"
              translate="no"
              lang="en"
            >
              <TypewriterClient />
            </span>
          </h1>

          {/* Texto descritivo com tamanho de fonte fluido */}
          <p className="mt-6 text-slate-500 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed px-4">
            A plataforma inteligente para consulta de <span className="font-bold text-slate-700">atos de pessoal</span>
            registrados nos Institutos Federais.
          </p>
        </div>

        {/* Container do Form com respiro nas bordas mobile */}
        <div className="w-full max-w-5xl mx-auto px-1 sm:px-0">
          <Suspense fallback={<div>Carregando...</div>}>
            <Form />
          </Suspense>
        </div>

        {/* Fundo decorativo sutil - Ajustado para não criar scroll horizontal */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute -top-[5%] -left-[5%] w-[60%] md:w-[40%] h-[40%] rounded-full bg-emerald-50/50 blur-[80px] md:blur-[120px]" />
          <div className="absolute -bottom-[5%] -right-[5%] w-[60%] md:w-[40%] h-[40%] rounded-full bg-blue-50/50 blur-[80px] md:blur-[120px]" />
        </div>

      </main>
    </div>
  );
}