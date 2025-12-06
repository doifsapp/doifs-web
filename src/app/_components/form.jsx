'use client'

import { useState } from "react";
import { FiSearch, FiPlus } from "react-icons/fi";
import { useRouter } from "next/navigation";

export function Form({ alwaysShowFilters = false }) {
    const [formData, setFormData] = useState({
        name: '',
        institute: '',
        type: '',
        year: '',
    });

    const [showFilters, setShowFilters] = useState(alwaysShowFilters);
    const router = useRouter();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const filledData = {}
        for (const key in formData) {
            if (formData[key] && formData[key] !== "null"){
                filledData[key] = formData[key]
            }
        }
        const query = new URLSearchParams(filledData).toString();
        router.push(`/search?${query}`);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-xl mx-auto p-4">
            <div className="flex items-center gap-2">
                <div className="relative flex-1">
                    <input
                        type="text"
                        name="name"
                        placeholder="Digite aqui..."
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full  border border-gray-300 rounded-2xl px-4 py-2 pr-10 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition text-black bg-white"
                    />
                    <button
                        type="submit"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                        aria-label="Buscar"
                    >
                        <FiSearch size={20} />
                    </button>
                </div>

                {!alwaysShowFilters && (
                    <button
                        type="button"
                        onClick={() => setShowFilters(prev => !prev)}
                        className="p-2 border border-white rounded hover:bg-gray-100 text-gray-700 transition"
                        aria-label="Mostrar filtros"
                    >
                        <FiPlus size={20} />
                    </button>
                )}
            </div>

            <div
                className={`transition-all duration-300 overflow-hidden ${showFilters ? 'max-h-[500px] opacity-100 scale-100' : 'max-h-0 opacity-0 scale-95'
                    }`}
            >
                <div className="flex flex-col md:flex-row gap-4 mt-2">
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="border rounded px-3 py-2 w-full"
                    >
                        <option value="" disabled hidden>Ato de pessoal</option>
                        <option value="Nomeação" className="text-blue-900">Nomeação</option>
                        <option value="Exoneração" className="text-blue-900">Exoneração</option>
                    </select>

                    <select
                        name="institute"
                        value={formData.institute}
                        onChange={handleChange}
                        className="border rounded px-3 py-2 w-full"
                    >
                        <option value="" disabled hidden>Instituto</option>
                        {[
                            'IFAC', 'IFAL', 'IFAP', 'IFAM', 'IFBA', 'IF Baiano', 'IFCE', 'IFB',
                            'IFG', 'IF Goiano', 'IFES', 'IFMA', 'IFMG', 'IFNMG', 'IF Sudeste MG',
                            'IFSULDEMINAS', 'IFTM', 'IFMT', 'IFMS', 'IFPA', 'IFPB', 'IFPE',
                            'IF Sertão PE', 'IFPI', 'IFPR', 'IFRJ', 'IFF', 'IFRN', 'IFRS',
                            'IFFar', 'IFSUL', 'IFRO', 'IFRR', 'IFSC', 'IFC', 'IFSP', 'IFS', 'IFTO'
                        ].map((inst) => (
                            <option key={inst} value={inst} className="text-blue-900">{inst}</option>
                        ))}
                    </select>

                    <select
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        className="border rounded px-3 py-2 w-full"
                    >
                        <option value="" disabled hidden>Ano</option>
                        {['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'].map((year) => (
                            <option key={year} value={year} className="text-blue-900">{year}</option>
                        ))}
                    </select>
                </div>
            </div>
        </form>
    );
}
