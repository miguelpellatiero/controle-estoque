import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateInventoryExcel } from '@/lib/excel'
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
        countLogs: {
          orderBy: { countedAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { name: 'asc' },
    })

    const buffer = await generateInventoryExcel(products)

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename=inventario-${new Date().toISOString().split('T')[0]}.xlsx`,
      },
    })
  } catch (error) {
    console.error('Erro ao gerar relatório:', error)
    return NextResponse.json(
      { error: 'Erro ao gerar relatório' },
      { status: 500 }
    )
  }
}
