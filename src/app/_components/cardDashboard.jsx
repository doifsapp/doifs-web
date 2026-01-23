'use client'

import axios from "axios";
import { TrendingUp, TrendingDown, Sigma, Newspaper } from "lucide-react";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const options = [
    {
        title: 'Nomeações',
        icon: TrendingUp,
        count: 0,
        descrition: 'Média geral de nomeações no período de Jun/2025 a Jul/2025',
        color: 'rgb(5, 150, 105)', // Emerald 600
        background: 'bg-emerald-100'
    },
    {
        title: 'Exonerações',
        icon: TrendingDown,
        count: 0,
        descrition: 'Média geral de nomeações no período de Jun/2025 a Jul/2025',
        color: 'rgb(225, 29, 72)', // Rose 600
        background: 'bg-rose-100'
    },
    {
        title: 'Ato mais recente',
        icon: Newspaper,
        institute: 'IFAL',
        date: '20/07/2020',
        descrition: 'O fez uma nomeação em',
        color: 'rgb(37, 99, 235)', // Blue 600
        background: 'bg-blue-100'
    },
    {
        title: 'Total de atos',
        icon: Sigma,
        count: 0,
        descrition: 'Número de atos desde 2018.',
        color: 'rgb(124, 58, 237)', // Violet 600
        background: 'bg-violet-100'
    },
]

export function CardDashboard() {
    const [restotals, setResTotals] = useState({
        types_counts: { nomeacoes: null, exoneracoes: null },
        latest_pubs: [],
        total_count: null,
    })

    useEffect(() => {
        axios
            .get('/api/dashboard/totals')
            .then((res) => {
                setResTotals(res.data)
            })
            .catch((error) => {
                console.error("Erro ao buscar totais: ", error)
            })
    }, [])

    //mapeando dados da api oi
    const updatedOptions = options.map(option => {

        let count = option.count
        let institute = option.institute
        let date = option.date
        let descrition = option.descrition

        const { types_counts = {}, latest_pubs = [], total_count } = restotals


        if (option.title === 'Nomeações') {
            count = types_counts.nomeacoes
        } else if (option.title === 'Exonerações') {
            count = types_counts.exoneracoes
        } else if (option.title === 'Ato mais recente') {

            const latest = latest_pubs[0]
            console.log("Saida > ", latest_pubs[0])
            if (latest) {
                institute = latest.institute
                date = format(new Date(latest.date), 'dd/MM/yyyy', { location: ptBR })
                descrition = `O ${latest.institute} fez uma ${latest.type} em `
            }
        } else if (option.title === 'Total de atos') {
            count = total_count
        }

        return { ...option, count, institute, date, descrition }
    })


    return (
        <div className="mt-16">
            <ul className="flex justify-between">
                {
                    updatedOptions.map((options, index) => {
                        const Icon = options.icon
                        return (
                            <li key={index}>
                                <div className="w-3xs h-full p-6 rounded-2xl shadow-2xl bg-white">
                                    <div className="flex justify-between items-center">
                                        <p>{options.title}</p>
                                        <div className={`p-2 rounded-4xl ${options.background}`}>
                                            <Icon size={28} color={options.color}/>
                                        </div>
                                    </div>
                                    <p className="font-bold text-2xl">{options.count} {options.institute}</p>
                                    <p className="pt-4 text-sm text-gray-400">{options.descrition} {options.date}</p>
                                </div>
                            </li>
                        )


                    })
                }
            </ul>
        </div>
    )
}