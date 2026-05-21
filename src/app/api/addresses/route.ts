import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const addresses = await prisma.address.findMany({
      where: {
        warehouse: {
          companyId: user.companyId,
        },
      },
      include: { warehouse: true },
      orderBy: { fullAddress: 'asc' },
    })

    return NextResponse.json(addresses)
  } catch (error) {
    console.error('Erro ao buscar endereços:', error)
    return NextResponse.json({ error: 'Erro ao buscar endereços' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { fullAddress, warehouseId } = await request.json()

    if (!fullAddress || typeof fullAddress !== 'string') {
      return NextResponse.json({ error: 'Endereço inválido' }, { status: 400 })
    }

    if (!warehouseId || typeof warehouseId !== 'string') {
      return NextResponse.json({ error: 'Armazém inválido' }, { status: 400 })
    }

    const warehouse = await prisma.warehouse.findFirst({
      where: { id: warehouseId, companyId: user.companyId },
    })

    if (!warehouse) {
      return NextResponse.json({ error: 'Armazém não encontrado' }, { status: 404 })
    }

    const address = await prisma.address.create({
      data: {
        fullAddress,
        warehouseId,
        addressParts: [fullAddress],
      },
      include: { warehouse: true },
    })

    return NextResponse.json(address, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar endereço:', error)
    return NextResponse.json({ error: 'Erro ao criar endereço' }, { status: 500 })
  }
}
