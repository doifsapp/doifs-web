import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
    const FASTAPI_URL = process.env.PATH_URL_BASE_API

    if (!FASTAPI_URL) {
        return NextResponse.json({error: "FASTAPI_URL não está configurada."}, {status: 500})
    }

    try {
        const response = await axios.get(`${FASTAPI_URL}/states-totals`)
        return NextResponse.json(response.data)
    } catch (error) {
        console.error("Erro ao consultar API", error.message)

        return NextResponse.json(
            {error: "Falha ao conectar ou processar a API", detail:error.message},
            {status: 502}
        )
    }
}