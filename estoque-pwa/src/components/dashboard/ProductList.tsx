'use client'

import Link from 'next/link'
import { ProductWithRelations } from '@/types'

export function ProductList({ products }: { products: ProductWithRelations[] }) {
  // Agrupar por categoria
  const grouped = products.reduce((acc, product) => {
    const categoryName = product.category?.name || 'Sem Categoria'
    if (!acc[categoryName]) {
      acc[categoryName] = []
    }
    acc[categoryName].push(product)
    return acc
  }, {} as Record<string, ProductWithRelations[]>)

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} className="bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              📦 {category} ({items.length})
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {items.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-500">
                    SKU: {product.sku} | Endereço: {product.address?.fullAddress || 'Não definido'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-indigo-600">{product.quantity}</p>
                  <p className="text-xs text-gray-500">unidades</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
