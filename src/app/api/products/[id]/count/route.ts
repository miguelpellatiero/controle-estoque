import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { quantity } = body
    const productId = params.id

    const currentProduct = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!currentProduct || currentProduct.companyId !== user.companyId) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      )
    }

    const [updatedProduct, countLog] = await prisma.$transaction([
      prisma.product.update({
        where: { id: productId },
        data: { quantity },
      }),
      prisma.countLog.create({
        data: {
          productId,
          userId: user.id,
          previousQty: currentProduct.quantity,
          newQty: quantity,
        },
      }),
    ])

    return NextResponse.json({
      product: updatedProduct,
      countLog,
    })
  } catch (error) {
    console.error('Erro ao registrar contagem:', error)
    return NextResponse.json(
      { error: 'Erro ao registrar contagem' },
      { status: 500 }
    )
  }
}
