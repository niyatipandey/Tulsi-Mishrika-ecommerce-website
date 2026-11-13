
import { useEffect, useState } from 'react'
import { supabase, type Product, normalizeProduct } from '../../lib/supabase'

type ProductForm = {
  name: string
  description: string
  long_description: string
  price: string
  image_url: string
  stock: string
  active: boolean
}

const emptyForm: ProductForm = {
  name: '',
  description: '',
  long_description: '',
  price: '',
  image_url: '',
  stock: '0',
  active: true,
}

const money = (amount: number) =>
  `₹${Number(amount || 0).toLocaleString('en-IN')}`

function makeSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [form, setForm] = useState<ProductForm>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadProducts()
  }, [])

  async function loadProducts() {
    setLoading(true)
    setError('')

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setError(error.message)
    } else {
      setProducts((data ?? []).map(row =>
        normalizeProduct(row as Record<string, unknown>)
      ))
    }

    setLoading(false)
  }

  function updateForm<K extends keyof ProductForm>(
    field: K,
    value: ProductForm[K]
  ) {
    setForm(previous => ({ ...previous, [field]: value }))
  }

  function startEdit(product: Product) {
    setEditingId(product.id)
    setForm({
      name: product.name,
      description: product.description ?? '',
      long_description: product.long_description ?? '',
      price: String(product.price),
      image_url: product.image_url ?? '',
      stock: String(product.stock),
      active: product.active,
    })
    setError('')
    setMessage('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function resetForm() {
    setEditingId(null)
    setForm(emptyForm)
    setError('')
    setMessage('')
  }

  async function saveProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')

    const price = Number(form.price)
    const stock = Number(form.stock)
    const slug = makeSlug(form.name)

    if (!slug) {
      setError('Please enter a valid product name.')
      setSaving(false)
      return
    }

    if (!Number.isFinite(price) || price <= 0) {
      setError('Please enter a valid price greater than zero.')
      setSaving(false)
      return
    }

    if (!Number.isInteger(stock) || stock < 0) {
      setError('Stock must be a whole number and cannot be negative.')
      setSaving(false)
      return
    }

    const productData = {
      name: form.name.trim(),
      slug,
      description: form.description.trim() || null,
      long_description: form.long_description.trim() || null,
      price,
      image_url: form.image_url.trim() || null,
      stock,
      active: form.active,
    }

    const result = editingId
      ? await supabase
          .from('products')
          .update(productData)
          .eq('id', editingId)
      : await supabase
          .from('products')
          .insert(productData)

    if (result.error) {
      setError(result.error.message)
    } else {
      setMessage(editingId ? 'Product updated successfully.' : 'Product added successfully.')
      resetForm()
      await loadProducts()
    }

    setSaving(false)
  }

  async function toggleActive(product: Product) {
    setError('')
    setMessage('')

    const { error } = await supabase
      .from('products')
      .update({ active: !product.active })
      .eq('id', product.id)

    if (error) {
      setError(error.message)
    } else {
      setProducts(previous =>
        previous.map(item =>
          item.id === product.id
            ? { ...item, active: !item.active, is_available: !item.active }
            : item
        )
      )
      setMessage(`${product.name} is now ${product.active ? 'inactive' : 'active'}.`)
    }
  }

  async function deleteProduct(product: Product) {
    const confirmed = window.confirm(
      `Delete "${product.name}" permanently? This may fail if the product is referenced by existing orders or carts.`
    )

    if (!confirmed) return

    setError('')
    setMessage('')

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', product.id)

    if (error) {
      setError(error.message)
    } else {
      setProducts(previous =>
        previous.filter(item => item.id !== product.id)
      )
      setMessage('Product deleted successfully.')
    }
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase()) ||
    product.slug.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#F7F5EF] p-5 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-[#20352B]">Products</h1>
        <p className="mt-2 text-gray-500">
          Add, update and manage your store products.
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

      <section className="mb-8 rounded-xl bg-white p-5 shadow-sm md:p-6">
        <h2 className="mb-5 text-xl font-bold text-[#20352B]">
          {editingId ? 'Edit product' : 'Add a new product'}
        </h2>

        <form onSubmit={saveProduct} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Product name *
            </label>
            <input
              required
              value={form.name}
              onChange={event => updateForm('name', event.target.value)}
              placeholder="e.g. Kunj Mishri"
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#20352B]"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Price (₹) *
              </label>
              <input
                required
                type="number"
                min="0.01"
                step="0.01"
                value={form.price}
                onChange={event => updateForm('price', event.target.value)}
                placeholder="299"
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#20352B]"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Stock quantity *
              </label>
              <input
                required
                type="number"
                min="0"
                step="1"
                value={form.stock}
                onChange={event => updateForm('stock', event.target.value)}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#20352B]"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Short description
            </label>
            <textarea
              rows={2}
              value={form.description}
              onChange={event => updateForm('description', event.target.value)}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#20352B]"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Full description
            </label>
            <textarea
              rows={4}
              value={form.long_description}
              onChange={event => updateForm('long_description', event.target.value)}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#20352B]"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Product image URL
            </label>
            <input
              type="url"
              value={form.image_url}
              onChange={event => updateForm('image_url', event.target.value)}
              placeholder="https://..."
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#20352B]"
            />
            <p className="mt-1 text-xs text-gray-400">
              For now, paste an image URL. We'll add image uploads separately.
            </p>
          </div>

          {form.image_url && (
            <img
              src={form.image_url}
              alt="Product preview"
              className="h-28 w-28 rounded-lg border object-cover"
            />
          )}

          <label className="flex items-center gap-3 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.active}
              onChange={event => updateForm('active', event.target.checked)}
              className="h-4 w-4 accent-[#20352B]"
            />
            Product is active and visible in the store
          </label>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[#20352B] px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              {saving ? 'Saving...' : editingId ? 'Save changes' : 'Add product'}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700"
              >
                Cancel edit
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="rounded-xl bg-white p-5 shadow-sm md:p-6">
        <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-bold text-[#20352B]">
              All products
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {products.length} products in your catalogue
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

        {loading ? (
          <p className="py-10 text-center text-gray-500">Loading products...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="py-10 text-center text-gray-500">No products found.</p>
        ) : (
          <div className="space-y-4">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className="flex flex-col gap-4 rounded-xl border border-gray-100 p-4 sm:flex-row sm:items-center"
              >
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="h-20 w-20 rounded-lg object-cover"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-lg bg-[#F0EEE8]" />
                )}

                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-[#20352B]">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {product.slug}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm">
                    <span className="font-semibold text-[#20352B]">
                      {money(product.price)}
                    </span>
                    <span className="text-gray-500">
                      Stock: {product.stock}
                    </span>
                    <span className={product.active ? 'text-green-700' : 'text-gray-400'}>
                      {product.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(product)}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#20352B]"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleActive(product)}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#20352B]"
                  >
                    {product.active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteProduct(product)}
                    className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
