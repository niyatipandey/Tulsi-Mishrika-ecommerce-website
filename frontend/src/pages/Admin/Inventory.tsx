
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabase'

type InventoryProduct = {
  id: string
  name: string
  slug: string
  image_url: string | null
  stock: number
  active: boolean
}

type StockFilter = 'all' | 'low' | 'out' | 'healthy'

const LOW_STOCK_LIMIT = 5

export default function Inventory() {
  const [products, setProducts] = useState<InventoryProduct[]>([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<StockFilter>('all')
  const [stockInputs, setStockInputs] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadInventory()
  }, [])

  async function loadInventory() {
    setLoading(true)
    setError('')

    const { data, error } = await supabase
      .from('products')
      .select('id, name, slug, image_url, stock, active')
      .order('name', { ascending: true })

    if (error) {
      setError(error.message)
    } else {
      const rows = (data ?? []).map(product => ({
        ...product,
        stock: Number(product.stock ?? 0),
      }))

      setProducts(rows)
      setStockInputs(
        Object.fromEntries(rows.map(product => [
          product.id,
          String(product.stock),
        ]))
      )
    }

    setLoading(false)
  }

  const counts = useMemo(() => ({
    total: products.length,
    out: products.filter(product => product.stock === 0).length,
    low: products.filter(
      product => product.stock > 0 && product.stock <= LOW_STOCK_LIMIT
    ).length,
    healthy: products.filter(
      product => product.stock > LOW_STOCK_LIMIT
    ).length,
  }), [products])

  const filteredProducts = products.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.slug.toLowerCase().includes(search.toLowerCase())

    const matchesFilter =
      filter === 'all' ||
      (filter === 'out' && product.stock === 0) ||
      (filter === 'low' &&
        product.stock > 0 &&
        product.stock <= LOW_STOCK_LIMIT) ||
      (filter === 'healthy' && product.stock > LOW_STOCK_LIMIT)

    return matchesSearch && matchesFilter
  })

  async function updateStock(product: InventoryProduct) {
    const newStock = Number(stockInputs[product.id])

    if (!Number.isInteger(newStock) || newStock < 0) {
      setError('Please enter a valid whole number of zero or more.')
      return
    }

    if (newStock === product.stock) {
      setMessage('Stock is already up to date.')
      setError('')
      return
    }

    setSavingId(product.id)
    setError('')
    setMessage('')

    const { error } = await supabase
      .from('products')
      .update({ stock: newStock })
      .eq('id', product.id)

    if (error) {
      setError(error.message)
      setStockInputs(previous => ({
        ...previous,
        [product.id]: String(product.stock),
      }))
    } else {
      setProducts(previous =>
        previous.map(item =>
          item.id === product.id
            ? { ...item, stock: newStock }
            : item
        )
      )
      setMessage(`Stock updated for ${product.name}.`)
    }

    setSavingId(null)
  }

  function stockStatus(stock: number) {
    if (stock === 0) {
      return {
        label: 'Out of stock',
        className: 'bg-red-50 text-red-700',
      }
    }

    if (stock <= LOW_STOCK_LIMIT) {
      return {
        label: 'Low stock',
        className: 'bg-amber-50 text-amber-700',
      }
    }

    return {
      label: 'Healthy',
      className: 'bg-green-50 text-green-700',
    }
  }

  const summaryCards = [
    { label: 'Total products', value: counts.total, style: 'text-[#20352B]' },
    { label: 'Out of stock', value: counts.out, style: 'text-red-700' },
    { label: 'Low stock', value: counts.low, style: 'text-amber-700' },
    { label: 'Healthy stock', value: counts.healthy, style: 'text-green-700' },
  ]

  return (
    <div className="min-h-screen bg-[#F7F5EF] p-5 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-[#20352B]">
          Inventory
        </h1>
        <p className="mt-2 text-gray-500">
          Monitor stock levels and keep your products available.
        </p>
      </header>

      {error && (
        <div className="mb-5 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {message && (
        <div className="mb-5 rounded-lg bg-green-50 p-4 text-sm text-green-800">
          {message}
        </div>
      )}

      <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map(card => (
          <div key={card.label} className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className={`mt-2 text-3xl font-bold ${card.style}`}>
              {loading ? '...' : card.value}
            </p>
          </div>
        ))}
      </section>

      <section className="rounded-xl bg-white p-5 shadow-sm md:p-6">
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#20352B]">
              Stock management
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Change quantities and save them to your product catalogue.
            </p>
          </div>

          <input
            type="search"
            value={search}
            onChange={event => setSearch(event.target.value)}
            placeholder="Search products..."
            className="rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#20352B]"
          />
        </div>

        <div className="mb-5 flex flex-wrap gap-2">
          {([
            ['all', 'All'],
            ['out', 'Out of stock'],
            ['low', 'Low stock'],
            ['healthy', 'Healthy'],
          ] as [StockFilter, string][]).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                filter === value
                  ? 'bg-[#20352B] text-white'
                  : 'bg-[#F0EEE8] text-[#20352B]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="py-10 text-center text-gray-500">
            Loading inventory...
          </p>
        ) : filteredProducts.length === 0 ? (
          <p className="py-10 text-center text-gray-500">
            No matching products found.
          </p>
        ) : (
          <div className="space-y-4">
            {filteredProducts.map(product => {
              const status = stockStatus(product.stock)
              const changed =
                stockInputs[product.id] !== String(product.stock)

              return (
                <div
                  key={product.id}
                  className="flex flex-col gap-4 rounded-xl border border-gray-100 p-4 lg:flex-row lg:items-center"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-4">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-lg bg-[#F0EEE8]" />
                    )}

                    <div className="min-w-0">
                      <h3 className="font-semibold text-[#20352B]">
                        {product.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {product.active ? 'Active product' : 'Inactive product'}
                      </p>
                      <span className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${status.className}`}>
                        {status.label}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-end gap-3">
                    <div>
                      <label className="mb-1 block text-xs text-gray-500">
                        Current stock
                      </label>
                      <p className="px-2 py-2 font-semibold text-[#20352B]">
                        {product.stock}
                      </p>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs text-gray-500">
                        New quantity
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={stockInputs[product.id] ?? ''}
                        onChange={event =>
                          setStockInputs(previous => ({
                            ...previous,
                            [product.id]: event.target.value,
                          }))
                        }
                        className="w-28 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#20352B]"
                      />
                    </div>

                    <button
                      type="button"
                      disabled={!changed || savingId === product.id}
                      onClick={() => updateStock(product)}
                      className="rounded-lg bg-[#20352B] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {savingId === product.id ? 'Saving...' : 'Save stock'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <p className="mt-5 text-xs text-gray-400">
          Low stock means 1–{LOW_STOCK_LIMIT} units. Out of stock means zero units.
        </p>
      </section>
    </div>
  )
}
