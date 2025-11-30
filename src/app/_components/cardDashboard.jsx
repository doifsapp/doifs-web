'use client'

import axios from "axios";
import { TrendingUp, TrendingDown, Sigma, Newspaper } from "lucide-react";
import { useEffect, useState } from "react";


const options = [
    {
        title: 'Nomeações',
        icon: <TrendingUp />,
        count: 0,
        descrition: 'Média geral de nomeações no périodo de Jun/2025 a Jul/2025'
    },
    {
        title: 'Exonerações',
        icon: <TrendingDown />,
        count: 0,
        descrition: 'Média geral de nomeações no périodo de Jun/2025 a Jul/2025'
    },
    {
        title: 'Ato mais recente',
        icon: <Newspaper />,
        institute: 'IFAL',
        date: '20/07/2020',
        descrition: `O  fez uma nomeação em `
    },
    {
        title: 'Total de atos',
        icon: <Sigma />,
        count: 0,
        descrition: 'Número de atos desde 2018.'
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

        const { types_counts = {}, latest_pubs = [], total_count} = restotals


        if (option.title === 'Nomeações') {
            count = types_counts.nomeacoes
        } else if (option.title === 'Exonerações') {
            count = types_counts.exoneracoes 
        } else if (option.title === 'Ato mais recente'){

            const latest = latest_pubs[0]
            console.log("Saida > ", latest_pubs[0])
            if (latest) {
                institute = latest.institute
                date = latest.date//format(new Date(latest.date), 'dd/MM/yyyy', {location: ptBR}) a
                descrition = `O ${latest.institute} fez uma ${latest.type} em `
            }
        } else if (option.title === 'Total de atos') {
            count = total_count
        }

        return {...option, count, institute, date, descrition}
    })


    return (
        <div className="pt-10">
            <ul className="flex justify-between">
                {
                    updatedOptions.map((options, index) => (
                        <li key={index}>
                            <div className="w-3xs p-6 rounded-2xl text-white dark bg-blue-950 shadow-2xl">
                                <div className="flex justify-between items-center">
                                    <p>{options.title}</p>
                                    {options.icon}
                                </div>
                                <p className="font-bold text-2xl">{options.count} {options.institute}</p>
                                <p className="pt-4 text-sm text-gray-400">{options.descrition} {options.date}</p>
                            </div>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}