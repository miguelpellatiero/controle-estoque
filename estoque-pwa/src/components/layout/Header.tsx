import Link from 'next/link'

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <Link href="/dashboard" className="text-xl font-bold text-indigo-600">
          EstoquePro
        </Link>
        <nav className="hidden md:flex items-center gap-4 text-sm text-gray-600">
          <Link href="/dashboard" className="hover:text-gray-900">Dashboard</Link>
          <Link href="/products" className="hover:text-gray-900">Produtos</Link>
          <Link href="/categories" className="hover:text-gray-900">Categorias</Link>
          <Link href="/addresses" className="hover:text-gray-900">Endereços</Link>
          <Link href="/warehouse" className="hover:text-gray-900">Armazéns</Link>
          <Link href="/counting" className="hover:text-gray-900">Contagem</Link>
        </nav>
      </div>
    </header>
  )
}
