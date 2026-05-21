import Link from 'next/link'

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg lg:hidden">
      <div className="mx-auto flex max-w-4xl justify-around px-4 py-3 text-sm text-gray-600">
        <Link href="/dashboard" className="text-center hover:text-indigo-700">
          Dashboard
        </Link>
        <Link href="/products" className="text-center hover:text-indigo-700">
          Produtos
        </Link>
        <Link href="/warehouse" className="text-center hover:text-indigo-700">
          Armazéns
        </Link>
        <Link href="/counting" className="text-center hover:text-indigo-700">
          Contagem
        </Link>
      </div>
    </nav>
  )
}
