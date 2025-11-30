//rota oi

import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
    const FASTAPI_URL = process.env.PATH_URL_BASE_API
    //requisição
    if (!FASTAPI_URL) {
        return NextResponse.json({error: "FASTAPI_URL não está configurada."}, {status: 500})
    }

    try {
        //requisição sincrona
        const response = await axios.get(`${FASTAPI_URL}/get-totals`);
        //resposta correta
        console.log("API ROUTE")
        return NextResponse.json(response.data)
    } catch (error) {
        console.error("Erro ao consultar API FASTAPI: ", error.message)

        return NextResponse.json(
            {error: "Falha ao conectar ou processar a API do do backend.", details: error.message},
            {status: 502}
        );
    }
}