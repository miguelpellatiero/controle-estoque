export function Stats({ products, categories }: { products: any[], categories: any[] }) {
  const totalProducts = products.length
  const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0)
  const addressedProducts = products.filter(p => p.addressId).length
  const unaddressedProducts = totalProducts - addressedProducts

  const stats = [
    { label: 'Total de Produtos', value: totalProducts, color: 'bg-blue-500' },
    { label: 'Quantidade Total', value: totalQuantity, color: 'bg-green-500' },
    { label: 'Endereçados', value: addressedProducts, color: 'bg-purple-500' },
    { label: 'Sem Endereço', value: unaddressedProducts, color: 'bg-yellow-500' },
    { label: 'Categorias', value: categories.length, color: 'bg-pink-500' },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white rounded-lg shadow p-6">
          <div className={`inline-block p-3 rounded-lg ${stat.color} bg-opacity-10 mb-4`}>
            <div className={`w-8 h-8 rounded-lg ${stat.color}`}></div>
          </div>
          <p className="text-sm text-gray-600">{stat.label}</p>
          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
