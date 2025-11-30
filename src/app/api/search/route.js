// Next.js 13+ API Route Handler (BFF)
import axios from "axios";

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

  // Retorno inicial vazio
  let result = { publications: [] }

  // Requisição para a API FastAPI com then/catch
  await axios
    .get(`${FASTAPI_URL}/buscar?${query.toString()}`)
    .then((res) => {
      result = res.data
    })
    .catch((error) => {
      console.error('Erro ao consultar a API FastAPI:', error)
      result = { error: 'Erro na requisição' }
      JSON.stringify({error: 'Esse é um erro' || 'Outro erro'})
    })

  return Response.json(result) //oi
}