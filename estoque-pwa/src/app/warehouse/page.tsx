'use client'

import { useEffect, useState, type FormEvent } from 'react'

export default function WarehousePage() {
  const [warehouses, setWarehouses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')

  async function loadWarehouses() {
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/warehouses')
      const data = await res.json()
      setWarehouses(data)
    } catch (fetchError) {
      console.error('Erro ao carregar armazéns:', fetchError)
      setError('Não foi possível carregar os armazéns.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadWarehouses()
  }, [])

  async function handleCreateWarehouse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Informe o nome do armazém.')
      return
    }

    setCreating(true)

    try {
      const res = await fetch('/api/warehouses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      })

      if (!res.ok) {
        const body = await res.json()
        setError(body?.error || 'Não foi possível criar o armazém.')
      } else {
        setName('')
        await loadWarehouses()
      }
    } catch (submitError) {
      console.error('Erro ao criar armazém:', submitError)
      setError('Erro ao criar armazém. Tente novamente.')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Armazéns</h1>
        <p className="text-gray-500 mb-4">Adicione novos armazéns e veja os endereços associados.</p>
        <form className="grid gap-4 sm:grid-cols-[1fr_auto]" onSubmit={handleCreateWarehouse}>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Nome do novo armazém"
            className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={creating}
            className="rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {creating ? 'Criando...' : 'Criar armazém'}
          </button>
        </form>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {warehouses.map((warehouse) => (
            <div key={warehouse.id} className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">{warehouse.name}</h2>
                  <p className="text-sm text-gray-500 mt-1">Endereços: {warehouse.addresses?.length || 0}</p>
                </div>
                <div className="text-sm text-gray-500">Template: {JSON.stringify(warehouse.addressTemplate)}</div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {warehouse.addresses?.map((address: any) => (
                  <div key={address.id} className="rounded-2xl border border-gray-200 p-4 bg-gray-50">
                    <p className="font-medium text-gray-900">{address.fullAddress}</p>
                    <p className="text-sm text-gray-500">Status: {address.status}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {warehouses.length === 0 && (
            <div className="rounded-xl bg-white border border-dashed border-gray-300 p-8 text-center text-gray-500">
              Nenhum armazém encontrado.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
