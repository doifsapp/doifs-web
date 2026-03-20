'use client'

import { Header } from "./_components/header";
import { Form } from "./_components/form";
import Typewriter from 'typewriter-effect';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="flex flex-col items-center pt-24 pb-10">
        
        {/* Seção Hero - Focada em Atos de Pessoal */}
        <div className="text-center mb-12 px-4 h-[140px] flex flex-col justify-center">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-slate-800 flex flex-col sm:flex-row items-center justify-center gap-3">
            <span>DOIFS</span>
            <span className="text-[#00a36c] min-w-[220px]">
              <Typewriter
                onInit={(typewriter) => {
                  typewriter
                    .changeDeleteSpeed(5000)
                    .typeString('Busque')
                    .pauseFor(1000)
                    .deleteAll()
                    .typeString('Filtre')
                    .pauseFor(1000)
                    .deleteAll()
                    .typeString('Analise')
                    .pauseFor(1000)
                    .deleteAll()
                    .typeString('Search')
                    .start();
                }}
                options={{
                  autoStart: true,
                  loop: false, // Executa apenas uma vez
                  cursor: '|',
                  delay: 60,
                }}
              />
            </span>
          </h1>
          <p className="mt-6 text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
            A plataforma inteligente para consulta de <span className="font-bold">atos de pessoal </span> 
             registrados nos Institutos Federais.
          </p>
        </div>

        <div className="w-full">
          <Form />
        </div>

        {/* Fundo decorativo sutil */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-emerald-50/40 blur-[120px]" />
            <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-50/40 blur-[120px]" />
        </div>

      </main>
    </div>
  );
}