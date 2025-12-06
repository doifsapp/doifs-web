// app/search/_components/search-content.js
'use client'

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { CardPub } from "@/app/_components/cardPub"; // Ajuste o caminho conforme necessário

export function SearchContent() {
    const [publicationsData, setPublications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const searchParams = useSearchParams();

    useEffect(() => {
        const name = searchParams.get("name");
        const institute = searchParams.get("institute");
        const type = searchParams.get("type");
        const year = searchParams.get("year");
       
        
        setIsLoading(true);

        const params = {}

        if (name) params.name = name
        if (institute) params.institute = institute
        if (type) params.type = type
        if (year) params.year = year
        
        if (Object.keys(params).length === 0) {
            setIsLoading(false)
            return;
        }

        const query = new URLSearchParams(params)

        axios
        .get(`/api/search?${query.toString()}`)
        .then((res) => {
            setPublications(res.data);
            
        })
        .catch((error) => {
            console.error("Erro ao realizar consulta.", error)
            setPublications([]); 
        })
        .finally(() => {
            setIsLoading(false);
        });
    }, [searchParams]);

    const publications = publicationsData.publications || []
    const count = publicationsData.count || []
    

    if (isLoading) {
        return <p className="text-xl p-8">Buscando publicações...</p>;
    }
    
    return (
        <div className="w-full py-6">
           <h2 className="text-amber-500">SAIDA - {count}</h2>

            {publications.length > 0 ? (
                // Mapeie e exiba os resultados
                publications.map((res, index) => (
                    // Certifique-se de que a prop CardPub está correta
                    <CardPub key={index} pubss={res}/> 
                ))
            ) : (
                <p className="text-xl p-8">Nenhuma publicação encontrada. Tente refinar a busca.</p>
            )}
        </div>
    );
}