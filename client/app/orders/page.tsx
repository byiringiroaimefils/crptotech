"use client"
import React, { useEffect, useMemo, useState } from "react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"
import { AdminSidebarProvider } from "@/components/admin-sidebar-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"
import axios from "axios"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function OrdersPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [minAmount, setMinAmount] = useState<string>("")
  const [maxAmount, setMaxAmount] = useState<string>("")
  const [minItems, setMinItems] = useState<string>("")

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
        const res = await axios.get(`${base}/api/orders/all`, { withCredentials: true })
        const d = res.data
        // support payloads: { orders }, { ordersa }, array
        const list = d?.orders ?? d?.ordersa ?? (Array.isArray(d) ? d : [])
        // normalize items count and display fields
        const normalized = (list || []).map((o: any) => {
          const itemCount = (o.products ?? []).reduce((s: number, p: any) => s + (p.quantity || 0), 0)
          return {
            _id: o._id ?? o.id,
            customer: o.shippingAddress?.fullName ?? "Customer",
            email: o.shippingAddress?.email ?? "",
            amount: Number(o.totalAmount ?? o.total ?? 0),
            status: (o.orderStatus ?? o.status ?? "unknown").toLowerCase(),
            date: o.createdAt ?? o.date,
            items: itemCount,
            raw: o,
          }
        })
        setOrders(normalized)
      } catch (err: any) {
        console.error("Failed to load orders:", err)
        setError(err?.response?.data?.message || err.message || "Failed to load orders")
        toast({ title: "Error", description: String(err?.message || "Failed to load orders") })
        setOrders([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [toast])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const minA = Number(minAmount || 0)
    const maxA = maxAmount ? Number(maxAmount) : Number.POSITIVE_INFINITY
    const minIt = Number(minItems || 0)

    return orders.filter((o) => {
      if (statusFilter !== "all" && o.status !== statusFilter.toLowerCase()) return false
      if (o.amount < minA) return false
      if (o.amount > maxA) return false
      if (o.items < minIt) return false
      if (!q) return true
      return (
        String(o._id).toLowerCase().includes(q) ||
        String(o.customer).toLowerCase().includes(q) ||
        String(o.email).toLowerCase().includes(q)
      )
    })
  }, [orders, query, statusFilter, minAmount, maxAmount, minItems])

  const clearFilters = () => {
    setQuery("")
    setStatusFilter("all")
    setMinAmount("")
    setMaxAmount("")
    setMinItems("")
  }

  return (
    <AdminSidebarProvider>
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />

        <div className="ml-0 md:ml-64 flex-1">
          <AdminHeader />

          <main className="p-6">
            <Card className="bg-card">
              <CardHeader>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <CardTitle className="text-foreground">All Orders</CardTitle>
                  <div className="flex w-full items-center gap-2 md:w-auto">
                    <div className="relative flex-1 md:flex-none">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search orders by id, customer, email..."
                        className="w-full pl-9"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                      />
                    </div>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Filters */}
                <div className="grid gap-3 md:grid-cols-5">
                  <div>
                    <label className="text-xs text-muted-foreground">Status</label>
                    <select
                      className="w-full mt-1 rounded-md border px-3 py-2"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All</option>
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground">Min amount (FRW)</label>
                    <Input type="number" className="mt-1" value={minAmount} onChange={(e) => setMinAmount(e.target.value)} />
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground">Max amount (FRW)</label>
                    <Input type="number" className="mt-1" value={maxAmount} onChange={(e) => setMaxAmount(e.target.value)} />
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground">Min items</label>
                    <Input type="number" className="mt-1" value={minItems} onChange={(e) => setMinItems(e.target.value)} />
                  </div>

                  <div className="flex items-end gap-2">
                    <Button onClick={clearFilters}>Clear</Button>
                    <Button variant="ghost" onClick={() => { navigator.clipboard?.writeText(JSON.stringify(filtered.map(f => f.raw), null, 2)); toast({ title: "Copied", description: "Filtered orders copied to clipboard" }) }}>
                      Export
                    </Button>
                  </div>
                </div>

                {/* Table for md+ */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Order ID</th>
                        <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Customer</th>
                        <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                        <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Items</th>
                        <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Amount</th>
                        <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                        <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr><td colSpan={7} className="py-8 text-center text-sm text-muted-foreground">Loading orders...</td></tr>
                      ) : error ? (
                        <tr><td colSpan={7} className="py-8 text-center text-sm text-destructive">{error}</td></tr>
                      ) : filtered.length === 0 ? (
                        <tr><td colSpan={7} className="py-8 text-center text-sm text-muted-foreground">No orders found.</td></tr>
                      ) : (
                        filtered.map((order) => (
                          <tr key={order._id} className="border-b border-border last:border-0">
                            <td className="py-4 text-sm font-medium text-foreground">{order._id}</td>
                            <td className="py-4">
                              <div>
                                <p className="text-sm font-medium text-foreground">{order.customer}</p>
                                <p className="text-xs text-muted-foreground">{order.email}</p>
                              </div>
                            </td>
                            <td className="py-4 text-sm text-muted-foreground">{new Date(order.date).toLocaleString()}</td>
                            <td className="py-4 text-sm text-foreground">{order.items}</td>
                            <td className="py-4 text-sm font-medium text-foreground">FRW {order.amount.toFixed(2)}</td>
                            <td className="py-4">
                              <Badge className="capitalize">{order.status}</Badge>
                            </td>
                            <td className="py-4">
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm" asChild>
                                  <Link href={`/account/orders/${order._id}`}>View</Link>
                                </Button>
                                <Button variant="outline" size="sm" asChild>
                                  <a href={`mailto:?subject=Order ${order._id}&body=Order ID: ${order._id}`}>Contact</a>
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="space-y-4 md:hidden">
                  {loading ? (
                    <div className="p-4 text-sm text-muted-foreground">Loading orders...</div>
                  ) : error ? (
                    <div className="p-4 text-sm text-destructive">{error}</div>
                  ) : filtered.length === 0 ? (
                    <div className="p-4 text-sm text-muted-foreground">No orders found.</div>
                  ) : (
                    filtered.map((order) => (
                      <div key={order._id} className="rounded-lg border border-border p-4 bg-card">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-semibold text-foreground">{order.customer}</p>
                            <p className="text-xs text-muted-foreground">{order.email}</p>
                            <p className="mt-2 text-sm">{order._id} • {new Date(order.date).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">FRW {order.amount.toFixed(2)}</p>
                            <p className="text-sm text-muted-foreground">{order.items} item(s)</p>
                            <div className="mt-2">
                              <Badge className="capitalize">{order.status}</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <Button variant="ghost" className="flex-1" asChild>
                            <Link href={`/account/orders/${order._id}`}>View</Link>
                          </Button>
                          <Button variant="outline" className="flex-1" asChild>
                            <a href={`mailto:?subject=Order ${order._id}&body=Order ID: ${order._id}`}>Contact</a>
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </AdminSidebarProvider>
  )
}
