import Link from 'next/link'

export function Sidebar() {
  return (
    <aside className="hidden lg:block w-64 bg-white border-r border-gray-200">
      <div className="px-6 py-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Menu</h2>
        <nav className="space-y-3 text-sm text-gray-600">
          <Link href="/dashboard" className="block rounded-xl px-4 py-3 hover:bg-indigo-50 hover:text-indigo-700">
            Dashboard
          </Link>
          <Link href="/products" className="block rounded-xl px-4 py-3 hover:bg-indigo-50 hover:text-indigo-700">
            Produtos
          </Link>
          <Link href="/warehouse" className="block rounded-xl px-4 py-3 hover:bg-indigo-50 hover:text-indigo-700">
            Armazéns
          </Link>
          <Link href="/counting" className="block rounded-xl px-4 py-3 hover:bg-indigo-50 hover:text-indigo-700">
            Contagem
          </Link>
        </nav>
      </div>
    </aside>
  )
}
