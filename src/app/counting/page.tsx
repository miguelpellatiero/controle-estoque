'use client'

import { useState, useEffect } from 'react'
import { Counter } from '@/components/ui/Counter'
import { PhotoCapture } from '@/components/ui/PhotoCapture'

export default function CountingPage() {
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [quantity, setQuantity] = useState(0)
  const [showCamera, setShowCamera] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    const res = await fetch('/api/products')
    const data = await res.json()
    setProducts(data)
  }

  const filteredProducts = products.filter((p: any) => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  )

  async function handleConfirmCount() {
    if (!selectedProduct) return

    try {
      const res = await fetch(`/api/products/${selectedProduct.id}/count`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      })

      if (res.ok) {
        alert('Contagem registrada com sucesso!')
        setSelectedProduct(null)
        setQuantity(0)
        fetchProducts()
      }
    } catch (error) {
      console.error('Erro ao registrar contagem:', error)
      alert('Erro ao registrar contagem')
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📱 Modo Contagem</h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="🔍 Buscar por nome ou SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
        />
      </div>

      {!selectedProduct && (
        <div className="space-y-2">
          {filteredProducts.map((product: any) => (
            <button
              key={product.id}
              onClick={() => {
                setSelectedProduct(product)
                setQuantity(product.quantity)
              }}
              className="w-full text-left p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-lg">{product.name}</p>
                  <p className="text-sm text-gray-500">
                    SKU: {product.sku} | 📍 {product.address?.fullAddress || 'Sem endereço'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-indigo-600">{product.quantity}</p>
                  <p className="text-xs text-gray-500">unidades</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {selectedProduct && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <button
            onClick={() => setSelectedProduct(null)}
            className="mb-4 text-indigo-600 hover:text-indigo-800"
          >
            ← Voltar para lista
          </button>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">{selectedProduct.name}</h2>
            <p className="text-gray-500">SKU: {selectedProduct.sku}</p>
            <p className="text-gray-500">
              📍 {selectedProduct.address?.fullAddress || 'Sem endereço'}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Quantidade anterior: {selectedProduct.quantity}
            </p>
          </div>

          <Counter value={quantity} onChange={setQuantity} />

          <div className="mt-6 space-y-3">
            <button
              onClick={() => setShowCamera(true)}
              className="w-full bg-gray-600 text-white py-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              📸 Tirar Foto da Etiqueta
            </button>

            <button
              onClick={handleConfirmCount}
              className="w-full bg-indigo-600 text-white py-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              ✅ Confirmar Contagem: {quantity} unidades
            </button>
          </div>

          {showCamera && (
            <PhotoCapture
              productId={selectedProduct.id}
              onPhotoTaken={(url) => {
                console.log('Foto salva:', url)
                setShowCamera(false)
              }}
              onClose={() => setShowCamera(false)}
            />
          )}
        </div>
      )}
    </div>
  )
}
