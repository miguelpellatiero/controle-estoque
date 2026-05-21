import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { productId, url } = body

    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        companyId: user.companyId,
      },
    })

    if (!product) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 })
    }

    await prisma.photo.create({
      data: {
        productId,
        url,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao salvar foto:', error)
    return NextResponse.json({ error: 'Erro ao salvar foto' }, { status: 500 })
  }
}
