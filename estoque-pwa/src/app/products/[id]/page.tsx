'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function ProductDetailPage() {
  const params = useParams() as { id: string }
  const router = useRouter()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`/api/products/${params.id}`)
        const data = await res.json()
        setProduct(data)
      } catch (error) {
        console.error('Erro ao carregar produto:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!product?.id) {
    return (
      <div className="p-4 md:p-8">
        <button onClick={() => router.back()} className="text-indigo-600 hover:text-indigo-800 mb-4 inline-block">
          ← Voltar
        </button>
        <div className="rounded-xl bg-white p-8 shadow border border-gray-200 text-center text-gray-600">
          Produto não encontrado.
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8">
      <button onClick={() => router.back()} className="text-indigo-600 hover:text-indigo-800 mb-6 inline-block">
        ← Voltar para produtos
      </button>
      <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-200">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>
            <p className="text-sm uppercase tracking-[0.2em] text-indigo-600 mb-4">SKU: {product.sku}</p>
            <p className="text-gray-600 mb-4">Categoria: {product.category?.name || 'Sem categoria'}</p>
            <p className="text-gray-600 mb-4">Quantidade: <strong>{product.quantity}</strong></p>
            <p className="text-gray-600 mb-4">Endereço: <strong>{product.address?.fullAddress || 'Não definido'}</strong></p>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl bg-indigo-50 p-5">
              <h2 className="font-semibold text-gray-900 mb-2">Última contagem</h2>
              <p className="text-sm text-gray-600">
                {product.countLogs?.[0]
                  ? new Date(product.countLogs[0].countedAt).toLocaleString()
                  : 'Ainda não houve contagem'}
              </p>
              {product.countLogs?.[0] && (
                <p className="text-sm text-gray-500">Por: {product.countLogs[0].user?.name || 'Usuário'}</p>
              )}
            </div>
            {product.photos?.[0] && (
              <div className="rounded-2xl overflow-hidden border border-gray-200">
                <img src={product.photos[0].url} alt={product.name} className="w-full h-56 object-cover" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
