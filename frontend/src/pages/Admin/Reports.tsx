
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabase'

type ReportOrder = {
  id: string
  total_amount: number
  status: string
  payment_status: string
  created_at: string
}

type ReportItem = {
  order_id: string
  product_id: string
  quantity: number
  price: number
}

type ProductName = {
  id: string
  name: string
}

const money = (amount: number) =>
  `₹${Number(amount || 0).toLocaleString('en-IN')}`

const monthLabel = (date: Date) =>
  date.toLocaleDateString('en-IN', { month: 'short' })

export default function Reports() {
  const [orders, setOrders] = useState<ReportOrder[]>([])
  const [items, setItems] = useState<ReportItem[]>([])
  const [products, setProducts] = useState<ProductName[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadReports()
  }, [])

  async function loadReports() {
    setLoading(true)
    setError('')

    const [ordersResult, itemsResult, productsResult] = await Promise.all([
      supabase
        .from('orders')
        .select('id, total_amount, status, payment_status, created_at')
        .order('created_at', { ascending: false }),

      supabase
        .from('order_items')
        .select('order_id, product_id, quantity, price'),

      supabase
        .from('products')
        .select('id, name'),
    ])

    if (ordersResult.error) {
      setError(ordersResult.error.message)
      setLoading(false)
      return
    }

    if (itemsResult.error) {
      setError(itemsResult.error.message)
      setLoading(false)
      return
    }

    if (productsResult.error) {
      setError(productsResult.error.message)
      setLoading(false)
      return
    }

    setOrders((ordersResult.data ?? []) as ReportOrder[])
    setItems((itemsResult.data ?? []) as ReportItem[])
    setProducts((productsResult.data ?? []) as ProductName[])
    setLoading(false)
  }

  const report = useMemo(() => {
    const validOrders = orders.filter(
      order => order.status !== 'cancelled'
    )

    const totalSales = validOrders.reduce(
      (sum, order) => sum + Number(order.total_amount || 0),
      0
    )

    const averageOrderValue =
      validOrders.length > 0 ? totalSales / validOrders.length : 0

    const statusCounts = orders.reduce<Record<string, number>>(
      (result, order) => {
        const status = order.status || 'unknown'
        result[status] = (result[status] || 0) + 1
        return result
      },
      {}
    )

    const productNames = new Map(
      products.map(product => [product.id, product.name])
    )

    const productSales = new Map<
      string,
      { name: string; quantity: number; value: number }
    >()

    items.forEach(item => {
      const existing = productSales.get(item.product_id)
      const name = productNames.get(item.product_id) || 'Product'

      if (existing) {
        existing.quantity += Number(item.quantity || 0)
        existing.value += Number(item.price || 0) * Number(item.quantity || 0)
      } else {
        productSales.set(item.product_id, {
          name,
          quantity: Number(item.quantity || 0),
          value: Number(item.price || 0) * Number(item.quantity || 0),
        })
      }
    })

    const bestSellers = [...productSales.values()]
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5)

    const now = new Date()
    const monthlySales = Array.from({ length: 6 }, (_, index) => {
      const date = new Date(
        now.getFullYear(),
        now.getMonth() - (5 - index),
        1
      )

      const year = date.getFullYear()
      const month = date.getMonth()

      const amount = validOrders
        .filter(order => {
          const orderDate = new Date(order.created_at)
          return (
            orderDate.getFullYear() === year &&
            orderDate.getMonth() === month
          )
        })
        .reduce((sum, order) => sum + Number(order.total_amount || 0), 0)

      return {
        label: monthLabel(date),
        amount,
      }
    })

    const maxMonthlySales = Math.max(
      ...monthlySales.map(month => month.amount),
      1
    )

    const paidOrders = orders.filter(
      order => order.payment_status === 'paid'
    )

    const paidOrderValue = paidOrders.reduce(
      (sum, order) => sum + Number(order.total_amount || 0),
      0
    )

    return {
      totalSales,
      totalOrders: orders.length,
      validOrderCount: validOrders.length,
      averageOrderValue,
      statusCounts,
      bestSellers,
      monthlySales,
      maxMonthlySales,
      paidOrderValue,
      paidOrderCount: paidOrders.length,
    }
  }, [orders, items, products])

  const statusColors: Record<string, string> = {
    confirmed: 'bg-blue-50 text-blue-700',
    processing: 'bg-amber-50 text-amber-700',
    shipped: 'bg-purple-50 text-purple-700',
    delivered: 'bg-green-50 text-green-700',
    cancelled: 'bg-red-50 text-red-700',
    pending: 'bg-gray-100 text-gray-700',
  }

  return (
    <div className="min-h-screen bg-[#F7F5EF] p-5 md:p-8">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#20352B]">
            Reports
          </h1>
          <p className="mt-2 text-gray-500">
            Understand your store's sales and order performance.
          </p>
        </div>

        <button
          type="button"
          onClick={loadReports}
          disabled={loading}
          className="rounded-lg bg-[#20352B] px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Refresh reports'}
        </button>
      </header>

      {error && (
        <div className="mb-5 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-xl bg-white p-10 text-center text-gray-500">
          Loading report data...
        </div>
      ) : (
        <>
          <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: 'Total order value',
                value: money(report.totalSales),
                note: 'Excludes cancelled orders',
              },
              {
                label: 'Total orders',
                value: report.totalOrders,
                note: 'All order statuses',
              },
              {
                label: 'Average order value',
                value: money(report.averageOrderValue),
                note: 'Non-cancelled orders',
              },
              {
                label: 'Paid order value',
                value: money(report.paidOrderValue),
                note: `${report.paidOrderCount} orders marked paid`,
              },
            ].map(card => (
              <div
                key={card.label}
                className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="mt-3 text-2xl font-bold text-[#20352B]">
                  {card.value}
                </p>
                <p className="mt-2 text-xs text-gray-400">{card.note}</p>
              </div>
            ))}
          </section>

          <section className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div className="rounded-xl bg-white p-5 shadow-sm md:p-6">
              <h2 className="text-xl font-bold text-[#20352B]">
                Monthly sales
              </h2>
              <p className="mb-6 mt-1 text-sm text-gray-500">
                Non-cancelled order value over the last six calendar months.
              </p>

              <div className="flex h-56 items-end gap-3 border-b border-gray-100 pb-2">
                {report.monthlySales.map(month => (
                  <div
                    key={month.label}
                    className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"
                  >
                    <span className="text-center text-xs text-gray-500">
                      {money(month.amount)}
                    </span>
                    <div className="flex h-36 w-full items-end">
                      <div
                        className="w-full rounded-t-md bg-[#20352B]"
                        style={{
                          height: `${Math.max(
                            month.amount > 0
                              ? (month.amount / report.maxMonthlySales) * 100
                              : 0,
                            month.amount > 0 ? 3 : 0
                          )}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">
                      {month.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-white p-5 shadow-sm md:p-6">
              <h2 className="text-xl font-bold text-[#20352B]">
                Orders by status
              </h2>
              <p className="mb-6 mt-1 text-sm text-gray-500">
                Current distribution of all orders.
              </p>

              {Object.keys(report.statusCounts).length === 0 ? (
                <p className="py-8 text-sm text-gray-500">No orders yet.</p>
              ) : (
                <div className="space-y-4">
                  {Object.entries(report.statusCounts)
                    .sort((a, b) => b[1] - a[1])
                    .map(([status, count]) => (
                      <div key={status}>
                        <div className="mb-2 flex justify-between text-sm">
                          <span className="capitalize text-gray-700">
                            {status}
                          </span>
                          <span className="font-semibold text-[#20352B]">
                            {count}
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                          <div
                            className="h-full rounded-full bg-[#20352B]"
                            style={{
                              width: `${(count / report.totalOrders) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </section>

          <section className="rounded-xl bg-white p-5 shadow-sm md:p-6">
            <h2 className="text-xl font-bold text-[#20352B]">
              Best-selling products
            </h2>
            <p className="mb-5 mt-1 text-sm text-gray-500">
              Ranked by total quantity ordered across all order records.
            </p>

            {report.bestSellers.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-500">
                No order item data available yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b text-sm text-gray-500">
                      <th className="py-3 pr-4">Product</th>
                      <th className="py-3 pr-4">Quantity sold</th>
                      <th className="py-3 pr-4">Order item value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.bestSellers.map((product, index) => (
                      <tr
                        key={`${product.name}-${index}`}
                        className="border-b last:border-0"
                      >
                        <td className="py-4 pr-4 font-medium text-[#20352B]">
                          {product.name}
                        </td>
                        <td className="py-4 pr-4 text-gray-600">
                          {product.quantity}
                        </td>
                        <td className="py-4 pr-4 text-gray-600">
                          {money(product.value)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <p className="mt-5 text-xs text-gray-400">
            Reports use the order and order-item records currently stored in
            Supabase. Order item values are not adjusted for refunds or
            cancellations. Paid order value includes only orders marked paid.
          </p>
        </>
      )}
    </div>
  )
}
