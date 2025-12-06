'use client'

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "../_components/header";
import { Form } from "../_components/form";
import { CardPub } from "../_components/cardPub";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { SearchContent } from "../_components/searchContent";

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

  
  
  return (
    <div className="h-[600px] flex flex-col items-center">
      <Header />
      <main className="w-4xl h-full flex flex-col items-center">
        <Form alwaysShowFilters />
        <Suspense fallback={<p className="text-xl p-8">Preparando busca...</p>}>
          <SearchContent/>
        </Suspense>
       
      </main>
    </div>
  );
}
