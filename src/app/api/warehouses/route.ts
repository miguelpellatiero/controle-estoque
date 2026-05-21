import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return new Response(JSON.stringify({ error: 'Não autorizado' }), { status: 401, headers: { 'content-type': 'application/json' } })
    }

    const warehouses = await prisma.warehouse.findMany({
      where: { companyId: user.companyId },
      include: { addresses: true },
      orderBy: { name: 'asc' },
    })

    return new Response(JSON.stringify(warehouses), { headers: { 'content-type': 'application/json' } })
  } catch (error) {
    console.error('Erro ao buscar armazéns:', error)
    return new Response(JSON.stringify({ error: 'Erro ao buscar armazéns' }), { status: 500, headers: { 'content-type': 'application/json' } })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return new Response(JSON.stringify({ error: 'Não autorizado' }), { status: 401, headers: { 'content-type': 'application/json' } })
    }

    const { name, addressTemplate } = await request.json()

    if (!name || typeof name !== 'string') {
      return new Response(JSON.stringify({ error: 'Nome de armazém inválido' }), { status: 400, headers: { 'content-type': 'application/json' } })
    }

    const warehouse = await prisma.warehouse.create({
      data: {
        name,
        companyId: user.companyId,
        addressTemplate: Array.isArray(addressTemplate) ? addressTemplate : ['Rua', 'Prédio', 'Nível', 'Vão'],
      },
      include: { addresses: true },
    })

    return new Response(JSON.stringify(warehouse), { status: 201, headers: { 'content-type': 'application/json' } })
  } catch (error) {
    console.error('Erro ao criar armazém:', error)
    return new Response(JSON.stringify({ error: 'Erro ao criar armazém' }), { status: 500, headers: { 'content-type': 'application/json' } })
  }
}
