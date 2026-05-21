import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')

    const products = await prisma.product.findMany({
      where: {
        companyId: user.companyId,
        ...(categoryId && { categoryId }),
      },
      include: {
        category: true,
        address: true,
        photos: {
          orderBy: { takenAt: 'desc' },
          take: 1,
        },
        countLogs: {
          orderBy: { countedAt: 'desc' },
          take: 1,
          include: {
            user: {
              select: { name: true },
            },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Erro ao buscar produtos:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar produtos' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { name, sku, categoryId } = body

    const availableAddress = await prisma.address.findFirst({
      where: {
        status: 'EMPTY',
        warehouse: {
          companyId: user.companyId,
        },
      },
      orderBy: { fullAddress: 'asc' },
    })

    const product = await prisma.product.create({
      data: {
        name,
        sku,
        categoryId,
        companyId: user.companyId,
        addressId: availableAddress?.id || null,
      },
      include: {
        category: true,
        address: true,
      },
    })

    if (availableAddress) {
      await prisma.address.update({
        where: { id: availableAddress.id },
        data: { status: 'OCCUPIED' },
      })
    }

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar produto:', error)
    return NextResponse.json(
      { error: 'Erro ao criar produto' },
      { status: 500 }
    )
  }
}
