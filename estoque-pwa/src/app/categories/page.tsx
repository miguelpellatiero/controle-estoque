'use client'

import { useEffect, useState, type FormEvent } from 'react'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')

  async function loadCategories() {
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      setCategories(data)
    } catch (fetchError) {
      console.error('Erro ao carregar categorias:', fetchError)
      setError('Não foi possível carregar as categorias.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  async function handleCreateCategory(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Informe o nome da categoria.')
      return
    }

    setCreating(true)

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      })

      if (!res.ok) {
        const body = await res.json()
        setError(body?.error || 'Não foi possível criar a categoria.')
      } else {
        setName('')
        await loadCategories()
      }
    } catch (submitError) {
      console.error('Erro ao criar categoria:', submitError)
      setError('Erro ao criar categoria. Tente novamente.')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categorias</h1>
          <p className="text-gray-500">Gerencie categorias e veja o número de produtos por grupo.</p>
        </div>
      </div>

      <div className="mb-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Adicionar nova categoria</h2>
        <form className="grid gap-4 sm:grid-cols-[1fr_auto]" onSubmit={handleCreateCategory}>
          <label className="block w-full">
            <span className="sr-only">Nome da categoria</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ex: Elétricos"
              className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none"
            />
          </label>
          <button
            type="submit"
            disabled={creating}
            className="rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {creating ? 'Criando...' : 'Criar categoria'}
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
          {categories.length > 0 ? (
            categories.map((category) => (
              <div key={category.id} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{category.name}</h2>
                    <p className="text-sm text-gray-500 mt-1">ID: {category.id}</p>
                  </div>
                  <div className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700">
                    {category._count?.products ?? 0} produto(s)
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
              Nenhuma categoria encontrada.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
