import ExcelJS from 'exceljs'

export async function generateInventoryExcel(data: any[]) {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Inventário')

  // Definir colunas
  worksheet.columns = [
    { header: 'Produto', key: 'product', width: 30 },
    { header: 'SKU', key: 'sku', width: 15 },
    { header: 'Categoria', key: 'category', width: 20 },
    { header: 'Quantidade', key: 'quantity', width: 15 },
    { header: 'Endereço', key: 'address', width: 30 },
    { header: 'Última Contagem', key: 'lastCount', width: 20 },
  ]

  // Estilizar cabeçalho
  worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } }
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '4F46E5' },
  }

  // Adicionar dados
  data.forEach(item => {
    worksheet.addRow({
      product: item.name,
      sku: item.sku,
      category: item.category?.name || 'Sem categoria',
      quantity: item.quantity,
      address: item.address?.fullAddress || 'Não endereçado',
      lastCount: item.countLogs[0]?.countedAt 
        ? new Date(item.countLogs[0].countedAt).toLocaleDateString() 
        : 'Nunca contado',
    })
  })

  // Adicionar bordas
  worksheet.eachRow((row) => {
    row.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      }
    })
  })

  return workbook.xlsx.writeBuffer()
}
