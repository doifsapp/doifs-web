// app/search/_components/search-content.js
'use client'

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { CardPub } from "@/app/_components/cardPub"; // Ajuste o caminho conforme necessário

export function SearchContent() {
    const [publications, setPublications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const searchParams = useSearchParams();

    useEffect(() => {
        const name = searchParams.get("name");
        const institute = searchParams.get("institute");
        const type = searchParams.get("type");
        const year = searchParams.get("year");

        // Se nenhum parâmetro de filtro principal estiver presente (página acessada sem busca)
        if (!name && !institute && !type && !year) {
            setPublications([]);
            setIsLoading(false);
            return;
        }

        // Se algum parâmetro estiver faltando, você pode decidir buscar ou retornar
        if (!name || !institute || !type || !year) {
            // Decisão: Você pode querer exibir uma mensagem ou não fazer a busca
            // Por enquanto, faremos a busca APENAS se todos os 4 estiverem presentes
            setIsLoading(false);
            return;
        }
        
        setIsLoading(true);

        const query = new URLSearchParams({
            name,
            institute,
            type,
            year,
        })

        axios
        .get(`/api/search?${query.toString()}`)
        .then((res) => {
            // Supondo que a API retorna { publications: [...] }
            setPublications(res.data.publications || []);
        })
        .catch((error) => {
            console.error('Erro ao buscar publicações: ', error);
            setPublications([]); // Limpa em caso de erro
        })
        .finally(() => {
            setIsLoading(false);
        });
    }, [searchParams]); // Dependência em searchParams garante que a busca ocorre a cada mudança de URL

    // ---------------------------------
    // Renderização do Conteúdo de Busca
    // ---------------------------------
    if (isLoading) {
        return <p className="text-xl p-8">Buscando publicações...</p>;
    }
    
    return (
        <div className="w-full py-6">
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