
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

type Customer = {
  id: string
  email: string | null
  name: string | null
  full_name: string | null
  phone: string | null
  created_at: string
}

type CartProduct = {
  id: string
  name: string
  price: number
  image_url: string | null
  quantity: number
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [search, setSearch] = useState('')
  const [expandedCustomer, setExpandedCustomer] = useState<string | null>(null)
  const [cartProducts, setCartProducts] = useState<Record<string, CartProduct[]>>({})
  const [loading, setLoading] = useState(true)
  const [cartLoading, setCartLoading] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    loadCustomers()
  }, [])

  async function loadCustomers() {
    setLoading(true)
    setError('')

    const { data, error } = await supabase.rpc('get_admin_customers')

    if (error) {
      setError(error.message)
    } else {
      setCustomers((data ?? []) as Customer[])
    }

    setLoading(false)
  }

  async function toggleCart(customer: Customer) {
    if (expandedCustomer === customer.id) {
      setExpandedCustomer(null)
      return
    }

    setExpandedCustomer(customer.id)

    if (cartProducts[customer.id]) return

    setCartLoading(customer.id)
    setError('')

    const { data: carts, error: cartsError } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', customer.id)

    if (cartsError) {
      setError(cartsError.message)
      setCartLoading(null)
      return
    }

    const cartIds = (carts ?? []).map(cart => cart.id)

    if (cartIds.length === 0) {
      setCartProducts(previous => ({
        ...previous,
        [customer.id]: [],
      }))
      setCartLoading(null)
      return
    }

    const { data: cartItems, error: itemsError } = await supabase
      .from('cart_items')
      .select('product_id, quantity')
      .in('cart_id', cartIds)

    if (itemsError) {
      setError(itemsError.message)
      setCartLoading(null)
      return
    }

    const productIds = [
      ...new Set((cartItems ?? []).map(item => item.product_id)),
    ]

    if (productIds.length === 0) {
      setCartProducts(previous => ({
        ...previous,
        [customer.id]: [],
      }))
      setCartLoading(null)
      return
    }

    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, price, image_url')
      .in('id', productIds)

    if (productsError) {
      setError(productsError.message)
      setCartLoading(null)
      return
    }

    const productMap = new Map(
      (products ?? []).map(product => [product.id, product])
    )

    const result: CartProduct[] = (cartItems ?? []).flatMap(item => {
      const product = productMap.get(item.product_id)
      if (!product) return []

      return [{
        id: product.id,
        name: product.name,
        price: Number(product.price),
        image_url: product.image_url,
        quantity: item.quantity,
      }]
    })

    setCartProducts(previous => ({
      ...previous,
      [customer.id]: result,
    }))

    setCartLoading(null)
  }

  const filteredCustomers = customers.filter(customer => {
    const term = search.toLowerCase()

    return [
      customer.full_name,
      customer.name,
      customer.email,
      customer.phone,
    ].some(value => value?.toLowerCase().includes(term))
  })

  const money = (amount: number) =>
    `₹${amount.toLocaleString('en-IN')}`

  return (
    <div className="min-h-screen bg-[#F7F5EF] p-5 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-[#20352B]">
          Customers
        </h1>
        <p className="mt-2 text-gray-500">
          View registered customers and their saved shopping carts.
        </p>
      </header>

      {error && (
        <div className="mb-5 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Registered customers</p>
          <p className="mt-2 text-3xl font-bold text-[#20352B]">
            {loading ? '...' : customers.length}
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Matching search results</p>
          <p className="mt-2 text-3xl font-bold text-[#20352B]">
            {loading ? '...' : filteredCustomers.length}
          </p>
        </div>
      </section>

      <section className="rounded-xl bg-white p-5 shadow-sm md:p-6">
        <div className="mb-5">
          <input
            type="search"
            value={search}
            onChange={event => setSearch(event.target.value)}
            placeholder="Search by name, email or phone..."
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#20352B]"
          />
        </div>

        {loading ? (
          <p className="py-10 text-center text-gray-500">
            Loading customers...
          </p>
        ) : filteredCustomers.length === 0 ? (
          <p className="py-10 text-center text-gray-500">
            No customers found.
          </p>
        ) : (
          <div className="space-y-4">
            {filteredCustomers.map(customer => {
              const isExpanded = expandedCustomer === customer.id

              return (
                <div
                  key={customer.id}
                  className="overflow-hidden rounded-xl border border-gray-100"
                >
                  <div className="grid gap-4 p-5 md:grid-cols-3 md:items-center">
                    <div>
                      <p className="font-semibold text-[#20352B]">
                        {customer.full_name || customer.name || 'Customer'}
                      </p>
                      <p className="mt-1 break-all text-sm text-gray-500">
                        {customer.email || 'No email available'}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Phone
                      </p>
                      <p className="mt-1 text-sm text-gray-700">
                        {customer.phone || 'Not provided'}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm text-gray-500">
                          Joined
                        </p>
                        <p className="mt-1 text-sm text-gray-700">
                          {new Date(customer.created_at).toLocaleDateString('en-IN')}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleCart(customer)}
                        className="rounded-lg bg-[#20352B] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                      >
                        {isExpanded ? 'Hide cart' : 'View cart'}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-gray-100 bg-[#FAF9F5] p-5">
                      <h3 className="mb-4 font-semibold text-[#20352B]">
                        Saved cart
                      </h3>

                      {cartLoading === customer.id ? (
                        <p className="text-sm text-gray-500">
                          Loading saved cart...
                        </p>
                      ) : !cartProducts[customer.id]?.length ? (
                        <p className="text-sm text-gray-500">
                          This customer has no products in their saved cart.
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {cartProducts[customer.id].map(product => (
                            <div
                              key={product.id}
                              className="flex items-center justify-between gap-4 text-sm"
                            >
                              <div className="flex items-center gap-3">
                                {product.image_url ? (
                                  <img
                                    src={product.image_url}
                                    alt={product.name}
                                    className="h-12 w-12 rounded-lg object-cover"
                                  />
                                ) : (
                                  <div className="h-12 w-12 rounded-lg bg-gray-200" />
                                )}
                                <div>
                                  <p className="font-medium text-[#20352B]">
                                    {product.name}
                                  </p>
                                  <p className="text-gray-500">
                                    Quantity: {product.quantity}
                                  </p>
                                </div>
                              </div>

                              <p className="font-medium text-[#20352B]">
                                {money(product.price * product.quantity)}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </section>

      <p className="mt-5 text-xs text-gray-400">
        Customer details and saved carts are view-only. No customer account
        information can be edited or deleted here.
      </p>
    </div>
  )
}
