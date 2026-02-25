'use client'

import axios from "axios";
import { useState, useEffect } from "react";
import { FiSearch, FiFilter, FiXCircle, FiChevronUp } from "react-icons/fi";
import { useRouter, useSearchParams } from "next/navigation";

export function Form({ alwaysShowFilters = false }) {

    //retorno da rota de filters
    const [types, setTypes] = useState([])
    const [institutes, setInstitutes] = useState([])
    const [years, setYears] = useState([])

    //mensagem de erro
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/filters')
                const data = response.data

                setTypes(data.types || [])
                setInstitutes(data.institutes || [])
                setYears(data.years || [])
            } catch (error) {
                console.error("Erro ao buscar dados para filtros", error.message)
            }
        }
        fetchData()
    }, [])

    const initialFormState = {
        name: '',
        acronym: '',
        type: '',
        year: '',
    };

    const [formData, setFormData] = useState(initialFormState);
    // Inicializa com true se alwaysShowFilters for passado, permitindo fechar depois
    const [showFilters, setShowFilters] = useState(alwaysShowFilters);

    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const params = Object.fromEntries(searchParams.entries());
        setFormData({
            name: params.name || '',
            acronym: params.acronym || '',
            type: params.type || '',
            year: params.year || '',
        });

        // Se houver filtros na URL, forçamos a abertura independente do modo
        if (params.acronym || params.type || params.year) {
            setShowFilters(true);
        }
    }, [searchParams]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleClearFilters = () => {
        setFormData(initialFormState);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        //validção do campo name
        if (!formData.name || formData.name.trim() === "") {
            setError("Por favor, insira o nome do servidor para realizar a busca.")
            return
        }
        //limpa o erro caso exista
        setError("")

        const filledData = {};
        for (const key in formData) {
            if (formData[key] && formData[key] !== "" && formData[key] !== "null") {
                filledData[key] = formData[key];
            }
        }
        //busca repetida
        const query = new URLSearchParams(filledData).toString();
        const targetUrl = `/search?${query}`

        if (window.location.pathname + window.location.search === targetUrl) {
            router.refresh()
        } else {
            router.push(targetUrl)
        }
        router.push(`/search?${query}`);
    };

    return (
        <div className="w-full max-w-5xl mx-auto px-4">
            <form
                onSubmit={handleSubmit}
                className="flex flex-col w-full p-5 bg-white rounded-2xl shadow-sm border border-slate-100 transition-all"
            >
                {/* Linha Principal de Busca */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="relative flex-1 w-full group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                            <FiSearch size={20} />
                        </div>
                        <input
                            type="text"
                            name="name"
                            placeholder="Pesquisar por nome do servidor..."
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border border-slate-200 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-slate-700 bg-white text-lg"
                        />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                            type="submit"
                            className="flex-1 sm:flex-none bg-[#00a36c] hover:bg-[#008f5d] text-white font-bold px-10 py-4 rounded-xl transition-all active:scale-95 text-lg"
                        >
                            Buscar
                        </button>

                        {/* Ícone de Filtro - Agora SEMPRE disponível em ambos os casos (1 e 2) */}
                        <button
                            type="button"
                            onClick={() => setShowFilters(!showFilters)}
                            className={`p-4 rounded-xl border transition-all flex items-center justify-center ${showFilters
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-600 shadow-inner'
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-emerald-300'
                                }`}
                            title={showFilters ? "Esconder filtros" : "Mostrar filtros"}
                        >
                            <FiFilter size={22} />
                        </button>
                    </div>
                </div>

                {/* Sessão de Filtros Expansível */}
                <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${showFilters ? 'max-h-[600px] opacity-100 mt-6' : 'max-h-0 opacity-0 invisible'
                        }`}
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-[#f8fafc] rounded-xl border border-slate-100 relative">

                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Tipo de Ato</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="bg-white border border-slate-200 rounded-lg px-3 py-3 text-sm text-slate-600 outline-none focus:border-emerald-500"
                            >
                                <option value="">Todos os Atos</option>
                                {types.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}

                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Instituto</label>
                            <select
                                name="acronym"
                                value={formData.acronym}
                                onChange={handleChange}
                                className="bg-white border border-slate-200 rounded-lg px-3 py-3 text-sm text-slate-600 outline-none focus:border-emerald-500"
                            >
                                <option value="">Todos Institutos</option>
                                {institutes.map((i) => (
                                    <option key={i} value={i}>{i}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Ano</label>
                            <select
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                className="bg-white border border-slate-200 rounded-lg px-3 py-3 text-sm text-slate-600 outline-none focus:border-emerald-500"
                            >
                                <option value="">Qualquer ano</option>
                                {years.map((y) => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>

                        {/* Rodapé: Alinhamento horizontal do Recolher e Limpar */}
                        <div className="md:col-span-3 flex items-center justify-between mt-2 pt-4 border-t border-slate-200/60">

                            <button
                                type="button"
                                onClick={() => setShowFilters(false)}
                                className="flex items-center gap-2 text-[11px] font-black text-slate-400 hover:text-emerald-600 transition-all uppercase tracking-widest group"
                            >
                                <FiChevronUp size={18} className="group-hover:-translate-y-0.5 transition-transform" />
                                Recolher Filtros
                            </button>

                            <button
                                type="button"
                                onClick={handleClearFilters}
                                className="flex items-center gap-1.5 text-[12px] font-bold text-[#94a3b8] hover:text-red-500 transition-colors uppercase"
                            >
                                <FiXCircle size={16} />
                                Limpar Filtros
                            </button>
                        </div>
                    </div>
                </div>
                <div>

                </div>
                {error && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 animate-in fade-in slide-in-from-top-2 duration-300">
                        <FiXCircle size={18} />
                        <p className="text-sm font-semibold">{error}</p>
                    </div>
                )}
            </form>
        </div>
    );
}