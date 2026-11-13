
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

type Order = {
  id: string
  order_number: string
  user_id: string
  total_amount: number
  status: string
  payment_status: string
  payment_method: string | null
  shipping_address: Record<string, unknown> | null
  created_at: string
}

type Customer = {
  id: string
  name: string | null
  full_name: string | null
  email: string | null
}

type OrderItem = {
  product_id: string
  quantity: number
  price: number
  productName: string
}

const orderStatuses = [
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
]

const money = (amount: number) =>
  `₹${Number(amount || 0).toLocaleString('en-IN')}`

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [items, setItems] = useState<Record<string, OrderItem[]>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    loadOrders()
  }, [])

  async function loadOrders() {
    setLoading(true)
    setError('')

    const [ordersResult, customersResult] = await Promise.all([
      supabase
        .from('orders')
        .select(
          'id, order_number, user_id, total_amount, status, payment_status, payment_method, shipping_address, created_at'
        )
        .order('created_at', { ascending: false }),

      supabase.rpc('get_admin_customers'),
    ])

    if (ordersResult.error) {
      setError(ordersResult.error.message)
      setLoading(false)
      return
    }

    if (customersResult.error) {
      setError(customersResult.error.message)
      setLoading(false)
      return
    }

    setOrders((ordersResult.data ?? []) as Order[])
    setCustomers((customersResult.data ?? []) as Customer[])
    setLoading(false)
  }

  async function toggleOrder(order: Order) {
    if (expandedOrder === order.id) {
      setExpandedOrder(null)
      return
    }

    setExpandedOrder(order.id)

    if (items[order.id]) return

    const { data, error } = await supabase
      .from('order_items')
      .select('product_id, quantity, price')
      .eq('order_id', order.id)

    if (error) {
      setError(error.message)
      return
    }

    const orderItems = data ?? []
    const productIds = [...new Set(orderItems.map(item => item.product_id))]

    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name')
      .in('id', productIds)

    if (productsError) {
      setError(productsError.message)
      return
    }

    const productNames = new Map(
      (products ?? []).map(product => [product.id, product.name])
    )

    setItems(previous => ({
      ...previous,
      [order.id]: orderItems.map(item => ({
        ...item,
        productName: productNames.get(item.product_id) ?? 'Product',
      })),
    }))
  }

  async function updateStatus(orderId: string, status: string) {
    setUpdating(orderId)
    setError('')

    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)

    if (error) {
      setError(error.message)
    } else {
      setOrders(previous =>
        previous.map(order =>
          order.id === orderId ? { ...order, status } : order
        )
      )
    }

    setUpdating(null)
  }

  function getCustomer(userId: string) {
    return customers.find(customer => customer.id === userId)
  }

  if (loading) {
    return <div className="p-8 text-brand-dark">Loading orders...</div>
  }

  return (
    <div className="min-h-screen bg-brand-cream p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-brand-dark">
          Orders
        </h1>
        <p className="mt-2 text-gray-500">
          View and manage all customer orders.
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mb-5 rounded-xl bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">Total orders</p>
        <p className="mt-1 text-2xl font-bold text-brand-dark">
          {orders.length}
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-xl bg-white p-8 text-center text-gray-500">
          No orders found.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const customer = getCustomer(order.user_id)
            const address = order.shipping_address ?? {}
            const isExpanded = expandedOrder === order.id

            return (
              <div
                key={order.id}
                className="overflow-hidden rounded-xl bg-white shadow-sm"
              >
                <div className="grid gap-4 p-5 md:grid-cols-5 md:items-center">
                  <div className="md:col-span-2">
                    <p className="font-semibold text-brand-dark">
                      {order.order_number}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {customer?.full_name ||
                        customer?.name ||
                        customer?.email ||
                        'Customer'}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      {new Date(order.created_at).toLocaleString('en-IN')}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Amount</p>
                    <p className="font-semibold text-brand-dark">
                      {money(order.total_amount)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Order status</p>
                    <select
                      value={order.status || 'confirmed'}
                      disabled={updating === order.id}
                      onChange={event =>
                        updateStatus(order.id, event.target.value)
                      }
                      className="mt-1 max-w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm capitalize text-brand-dark disabled:opacity-50"
                    >
                      {orderStatuses.map(status => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleOrder(order)}
                      className="rounded-lg bg-brand-cream px-4 py-2 text-sm font-medium text-brand-dark hover:opacity-80"
                    >
                      {isExpanded ? 'Hide details' : 'View details'}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-gray-100 bg-gray-50 p-5">
                    <h3 className="mb-3 font-semibold text-brand-dark">
                      Delivery details
                    </h3>

                    <div className="mb-5 space-y-1 text-sm text-gray-600">
                      <p>
                        Name: {String(address.full_name ?? 'Not available')}
                      </p>
                      <p>
                        Phone: {String(address.phone ?? 'Not available')}
                      </p>
                      <p>
                        Address: {String(address.address ?? 'Not available')}
                      </p>
                      <p>
                        City: {String(address.city ?? '')},{' '}
                        {String(address.state ?? '')} -{' '}
                        {String(address.pincode ?? '')}
                      </p>
                      <p>
                        Payment method: {order.payment_method || 'Not available'}
                      </p>
                      <p>
                        Payment status: {order.payment_status || 'pending'}
                      </p>
                    </div>

                    <h3 className="mb-3 font-semibold text-brand-dark">
                      Ordered products
                    </h3>

                    {!items[order.id] ? (
                      <p className="text-sm text-gray-500">
                        Loading products...
                      </p>
                    ) : items[order.id].length === 0 ? (
                      <p className="text-sm text-gray-500">
                        No products found for this order.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {items[order.id].map((item, index) => (
                          <div
                            key={`${item.product_id}-${index}`}
                            className="flex justify-between gap-4 text-sm"
                          >
                            <span className="text-gray-700">
                              {item.productName} × {item.quantity}
                            </span>
                            <span className="font-medium text-brand-dark">
                              {money(item.price * item.quantity)}
                            </span>
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
    </div>
  )
}
