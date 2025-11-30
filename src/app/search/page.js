'use client'

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "../_components/header";
import { Form } from "../_components/form";
import { CardPub } from "../_components/cardPub";
import { useSearchParams } from "next/navigation";
import axios from "axios";

const pubshhh = [
  {
    ordinance: "Portaria de 10/04/2024",
    institute: "Instituto Federal de Ciencia e Tecnologia de Alagoas",
    act: "Nomeação",
    date: "10/04/2024"
  },
  {
    ordinance: "Portaria de 10/04/2023",
    institute: "Instituto Federal de Ciencia e Tecnologia de Alagoas",
    act: "Nomeação",
    date: "10/04/2023"
  },
  {
    ordinance: "Portaria de 10/04/2025",
    institute: "Instituto Federal de Ciencia e Tecnologia de Alagoas",
    act: "Exoneração",
    date: "10/04/2025"
  },
  {
    ordinance: "Portaria de 10/04/2025",
    institute: "Instituto Federal de Ciencia e Tecnologia de Alagoas",
    act: "Exoneração",
    date: "10/04/2025"
  },
  {
    ordinance: "Portaria de 10/04/2025",
    institute: "Instituto Federal de Ciencia e Tecnologia de Alagoas",
    act: "Exoneração",
    date: "10/04/2025"
  },
  {
    ordinance: "Portaria de 10/04/2025",
    institute: "Instituto Federal de Ciencia e Tecnologia de Alagoas",
    act: "Exoneração",
    date: "10/04/2025"
  },
  {
    ordinance: "Portaria de 10/04/2025",
    institute: "Instituto Federal de Ciencia e Tecnologia de Alagoas",
    act: "Exoneração",
    date: "10/04/2025"
  },
  {
    ordinance: "Portaria de 10/04/2025",
    institute: "Instituto Federal de Ciencia e Tecnologia de Alagoas",
    act: "Exoneração",
    date: "10/04/2025"
  },
  {
    ordinance: "Portaria de 10/04/2025",
    institute: "Instituto Federal de Ciencia e Tecnologia de Alagoas",
    act: "Exoneração",
    date: "10/04/2025"
  },
  {
    ordinance: "Portaria de 10/04/2025",
    institute: "Instituto Federal de Ciencia e Tecnologia de Alagoas",
    act: "Exoneração",
    date: "10/04/2025"
  },
];

export default function Search() {
  //const data = await fetch('http://127.0.0.1:8000/buscar?name=JOSE DIOGO&institute=IFAL&year=2018')
  //const res = await data.json() oi

  const [publications, setPublications] = useState([]);
  const searchParams = useSearchParams();

  useEffect(() => {
    const name = searchParams.get("name");
    const institute = searchParams.get("institute");
    const type = searchParams.get("type");
    const year = searchParams.get("year");

    if (!name || !institute || !type || !year ) return;

    const query = new URLSearchParams({
      name,
      institute,
      type,
      year,
    })

    axios
    .get(`/api/search?${query.toString()}`)
    .then((res) => {
      setPublications(res.data.publications || [])
    })
    .catch((error) => {
      console.error('Erro ao buscar publicações: ', error)
    })
  }, [searchParams])

  

  return (
    <div className="h-[600px] flex flex-col items-center">
      <Header />
      <main className="w-4xl h-full flex flex-col items-center">
        <Form alwaysShowFilters />
        <div className="w-full py-6">
          {publications.length > 0 ? (
            publications.map((res, index) => (
              <CardPub key={index} pubss={res}/>
            ))
          ) : (
            <p>Nenhuma publicação econtrada</p>
          )
            
          }
        </div>
      </main>
    </div>
  );
}
