import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
    console.log("INICIOOOOO...")
    const FASTAPI_URL = process.env.PATH_URL_BASE_API

    if (!FASTAPI_URL) {
        return NextResponse.json({error: "FASTAPI_URL não está configurada."}, {status: 500})
    }

    try {
        const response = await axios.get(`${FASTAPI_URL}/institutes-overview`)
        return NextResponse.json(response.data)
    } catch (error) {
        console.error("Erro ao consultar API", error.message)

        return NextResponse.json(
            {error: "falha ao conectar processar a API", detail:error.message},
            {status: 502}
        );
    }

}