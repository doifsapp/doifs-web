'use client'

import { PageLayout } from "../_components/pageLayout";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContatoPage() {
  return (
    <PageLayout 
      title="Contato" 
      subtitle="Dúvidas, sugestões ou interesse em parcerias? Entre em contato conosco."
    >
      {/* Grid: 1 coluna no mobile, Layout proporcional no desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,1.5fr] gap-6 md:gap-8 px-2 sm:px-0">
        
        {/* Coluna de Informações (Esquerda) */}
        <div className="flex flex-col gap-6 md:gap-8 order-2 lg:order-1">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-6 hover:border-emerald-200 transition-all">
            <h3 className="text-xl font-bold text-slate-900">Informações de Contato</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
                Nossa equipe está disponível para auxiliar com dúvidas técnicas sobre a plataforma ou solicitações de parcerias institucionais.
            </p>
            
            <div className="flex flex-col gap-5 text-sm text-slate-600">
                <div className="flex items-start gap-4 p-3 rounded-xl bg-slate-50/50 border border-transparent hover:border-emerald-100 transition-colors">
                    <div className="bg-white p-2 rounded-lg shadow-sm">
                        <Mail size={18} className="text-emerald-500" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">E-mail</span>
                        <span className="font-medium">doifsapp@gmail.com</span>
                    </div>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-xl bg-slate-50/50 border border-transparent hover:border-emerald-100 transition-colors">
                    <div className="bg-white p-2 rounded-lg shadow-sm">
                        <Phone size={18} className="text-emerald-500" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Telefone</span>
                        <span className="font-medium">+55 (82) 98223-9323</span>
                    </div>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-xl bg-slate-50/50 border border-transparent hover:border-emerald-100 transition-colors">
                    <div className="bg-white p-2 rounded-lg shadow-sm">
                        <MapPin size={18} className="text-emerald-500" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Localização</span>
                        <span className="font-medium">IFAL, Arapiraca - AL, Brasil</span>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}