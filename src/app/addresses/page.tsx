'use client'

import { useEffect, useState, type FormEvent } from 'react'

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<any[]>([])
  const [warehouses, setWarehouses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [warehouseId, setWarehouseId] = useState('')
  const [fullAddress, setFullAddress] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')

  async function loadData() {
    setLoading(true)
    setError('')

    try {
      const [addressRes, warehouseRes] = await Promise.all([
        fetch('/api/addresses'),
        fetch('/api/warehouses'),
      ])

      const [addressData, warehouseData] = await Promise.all([addressRes.json(), warehouseRes.json()])
      setAddresses(addressData)
      setWarehouses(warehouseData)
    } catch (fetchError) {
      console.error('Erro ao carregar dados:', fetchError)
      setError('Não foi possível carregar os endereços ou armazéns.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  async function handleCreateAddress(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (!warehouseId) {
      setError('Selecione um armazém.')
      return
    }

    if (!fullAddress.trim()) {
      setError('Informe o endereço completo.')
      return
    }

    setCreating(true)

    try {
      const res = await fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ warehouseId, fullAddress: fullAddress.trim() }),
      })

      if (!res.ok) {
        const body = await res.json()
        setError(body?.error || 'Não foi possível criar o endereço.')
      } else {
        setFullAddress('')
        await loadData()
      }
    } catch (submitError) {
      console.error('Erro ao criar endereço:', submitError)
      setError('Erro ao criar endereço. Tente novamente.')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Endereços</h1>
            <p className="text-gray-500">Visualize os endereços dos armazéns e seu status atual.</p>
          </div>
        </div>
        <form className="mt-6 grid gap-4 sm:grid-cols-[1fr_1fr_auto]" onSubmit={handleCreateAddress}>
          <select
            value={warehouseId}
            onChange={(event) => setWarehouseId(event.target.value)}
            className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none"
          >
            <option value="">Selecione o armazém</option>
            {warehouses.map((warehouse) => (
              <option key={warehouse.id} value={warehouse.id}>
                {warehouse.name}
              </option>
            ))}
          </select>
          <input
            value={fullAddress}
            onChange={(event) => setFullAddress(event.target.value)}
            placeholder="Rua 01 - Bloco A - Nível 2"
            className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={creating}
            className="rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {creating ? 'Criando...' : 'Adicionar endereço'}
          </button>
        </form>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="grid gap-4">
          {addresses.map((address) => (
            <div key={address.id} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-xl font-semibold text-gray-900">{address.fullAddress}</h2>
                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700">
                    {address.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500">Armazém: {address.warehouse?.name || 'Não informado'}</p>
              </div>
            </div>
          ))}
          {addresses.length === 0 && (
            <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
              Nenhum endereço encontrado.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
