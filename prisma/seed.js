const { PrismaClient } = require('@prisma/client')
const { hash } = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  let company = await prisma.company.findFirst({
    where: { name: 'Empresa Demo' },
  })

  if (!company) {
    company = await prisma.company.create({
      data: {
        name: 'Empresa Demo',
      },
    })
  }

  const passwordHash = await hash('admin123', 10)

  await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: {
      name: 'Administrador',
      password: passwordHash,
      companyId: company.id,
    },
    create: {
      name: 'Administrador',
      email: 'admin@demo.com',
      password: passwordHash,
      role: 'ADMIN',
      companyId: company.id,
    },
  })

  const category =
    (await prisma.category.findFirst({
      where: { name: 'Materiais' },
    })) ||
    (await prisma.category.create({
      data: {
        name: 'Materiais',
        companyId: company.id,
      },
    }))

  const warehouse =
    (await prisma.warehouse.findFirst({
      where: { name: 'Armazém Central' },
    })) ||
    (await prisma.warehouse.create({
      data: {
        name: 'Armazém Central',
        companyId: company.id,
        addressTemplate: ['Rua', 'Prédio', 'Nível', 'Vão'],
      },
    }))

  const address =
    (await prisma.address.findFirst({
      where: { fullAddress: 'Rua A / Prédio 1 / Nível 1 / Vão 1' },
    })) ||
    (await prisma.address.create({
      data: {
        warehouseId: warehouse.id,
        fullAddress: 'Rua A / Prédio 1 / Nível 1 / Vão 1',
        addressParts: {
          Rua: 'A',
          Prédio: '1',
          Nível: '1',
          Vão: '1',
        },
        status: 'OCCUPIED',
      },
    }))

  await prisma.product.upsert({
    where: { sku: 'SKU-0001' },
    update: {
      quantity: 10,
      addressId: address.id,
    },
    create: {
      name: 'Parafuso 8mm',
      sku: 'SKU-0001',
      quantity: 10,
      categoryId: category.id,
      addressId: address.id,
      companyId: company.id,
    },
  })

  await prisma.product.upsert({
    where: { sku: 'SKU-0002' },
    update: {
      quantity: 5,
    },
    create: {
      name: 'Porca 10mm',
      sku: 'SKU-0002',
      quantity: 5,
      categoryId: category.id,
      companyId: company.id,
    },
  })

  console.log('Seed concluído com sucesso.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
