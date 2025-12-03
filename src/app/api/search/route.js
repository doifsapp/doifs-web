// Next.js 13+ API Route Handler (BFF)
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const name = searchParams.get('name')
  const institute = searchParams.get('institute')
  const type = searchParams.get('type')
  const year = searchParams.get('year')

  // Monta a query string para a FastAPI
  const query = new URLSearchParams()
  if (name) query.append('name', name)
  if (institute) query.append('institute', institute)
  if (type) query.append('type', type)
  if (year) query.append('year', year)

  const FASTAPI_URL = process.env.PATH_URL_BASE_API

  
  if (!FASTAPI_URL) {
        return NextResponse.json({error: "FASTAPI_URL não está configurada"}, {status: 500})
      }

  try {
      console.log("ROUTE SEARCH ><")
      const response = await axios.get(`${FASTAPI_URL}/buscar?${query.toString()}`)
      return NextResponse.json(response.data)

    } catch (error) {
      console.error("Erro ao consultar a API", error.message)

      return NextResponse.json(
        {error: "Falha ao conectar ou processar a API", detail: error.message},
        {status: 502}
      )
    }
}