"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import axios from "axios"
import Link from "next/link"

interface Order {
  _id: string
  customer: string
  amount: number
  status: string
  date: string
  items: number
}

export function RecentOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        setLoading(true)
        setError(null)
        const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
        const res = await axios.get(`${base}/api/orders/all`, { withCredentials: true })
        const d = res.data
        
        // Support different payload structures
        const list = d?.orders ?? d?.ordersa ?? (Array.isArray(d) ? d : [])
        
        // Normalize and get only 5 most recent orders
        const normalized = (list || [])
          .map((o: any) => {
            const itemCount = (o.products ?? []).reduce(
              (s: number, p: any) => s + (p.quantity || 0), 
              0
            )
            return {
              _id: o._id ?? o.id,
              customer: o.shippingAddress?.fullName ?? "Customer",
              amount: Number(o.totalAmount ?? o.total ?? 0),
              status: (o.orderStatus ?? o.status ?? "unknown").toLowerCase(),
              date: o.createdAt ?? o.date,
              items: itemCount,
            }
          })
          .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5) // Get only 5 most recent
        
        setOrders(normalized)
      } catch (err: any) {
        console.error("Failed to load recent orders:", err)
        setError(err?.response?.data?.message || err.message || "Failed to load orders")
        setOrders([])
      } finally {
        setLoading(false)
      }
    }

    fetchRecentOrders()
  }, [])

  // Format relative time
  const getRelativeTime = (date: string) => {
    const now = new Date()
    const orderDate = new Date(date)
    const diffMs = now.getTime() - orderDate.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60))
      return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
    } else {
      return orderDate.toLocaleDateString()
    }
  }

  // Get badge variant based on status
  const getBadgeVariant = (status: string): "default" | "secondary" | "outline" | "destructive" => {
    switch (status.toLowerCase()) {
      case "completed":
      case "paid":
        return "default"
      case "processing":
      case "pending":
        return "secondary"
      case "cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <Card className="bg-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-foreground">Recent Orders</CardTitle>
        <Link 
          href="/orders" 
          className="text-sm text-primary hover:underline"
        >
          View all
        </Link>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-muted rounded w-1/3"></div>
                    <div className="h-3 bg-muted rounded w-1/4"></div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-6 w-20 bg-muted rounded"></div>
                    <div className="h-4 w-16 bg-muted rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-8 text-center">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-muted-foreground">No recent orders</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order._id}
                href={`/orders/${order._id}`}
                className="block hover:bg-muted/50 -mx-2 px-2 rounded-lg transition-colors"
              >
                <div className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">
                      {order.customer}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground">
                        {order.items} item{order.items !== 1 ? 's' : ''}
                      </p>
                      <span className="text-xs text-muted-foreground">•</span>
                      <p className="text-xs text-muted-foreground">
                        {getRelativeTime(order.date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge
                      variant={getBadgeVariant(order.status)}
                      className="capitalize"
                    >
                      {order.status}
                    </Badge>
                    <p className="text-sm font-medium text-foreground">
                      FRW {order.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}