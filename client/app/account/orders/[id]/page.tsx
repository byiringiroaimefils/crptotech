"use client"

import React, { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import axios from "axios"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"

export default function OrderDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id
  const [loading, setLoading] = useState(true)
  const [order, setOrder] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const [isCancelling, setIsCancelling] = useState(false)

  useEffect(() => {
    if (!id) return
    const load = async () => {
      try {
        setLoading(true)
        const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
        const res = await axios.get(`${base}/api/orders/${id}`, { withCredentials: true })
        setOrder(res.data.order ?? res.data)
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || "Failed to load order")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const formatDate = (iso?: string) => (iso ? new Date(iso).toLocaleString() : "-")
  const formatCurrency = (n?: number) => `FRW ${Number(n || 0).toFixed(2)}`

  const statusColor = (s: string) => {
    switch (s) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "paid":
        return "bg-green-100 text-green-800"
      case "delivered":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "completed":
        return "bg-indigo-100 text-indigo-800"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  const handleCancel = async () => {
    if (!order) return
    if (order.orderStatus !== "pending") {
      toast({ title: "Cannot cancel", description: "Only pending orders can be cancelled." })
      return
    }
    if (!confirm("Cancel this order? This cannot be undone.")) return

    try {
      setIsCancelling(true)
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
      const res = await axios.put(`${base}/api/orders/${id}/cancel`, {}, { withCredentials: true })
      const updated = res.data.order ?? res.data
      setOrder((prev: any) => ({ ...(prev ?? {}), ...(updated || {}) }))
      toast({ title: "Order cancelled", description: "Your order was cancelled." })
    } catch (err: any) {
      toast({ title: "Error", description: err.response?.data?.message || err.message || "Failed to cancel order" })
    } finally {
      setIsCancelling(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-20">
          <p className="text-muted-foreground">Loading order...</p>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Order not found</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-red-600 mb-4">{error || "No order data available."}</p>
              <Button onClick={() => router.push("/account")}>Back to orders</Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold">Order Details</h2>
            <p className="text-sm text-muted-foreground">
              Order ID: <span className="font-mono">{order._id}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Badge className={statusColor(order.orderStatus)}>{order.orderStatus}</Badge>
            <Badge
              className={
                order.paymentStatus === "paid"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }
            >
              {order.paymentStatus}
            </Badge>
            {order.orderStatus === "pending" && (
              <Button variant="destructive" onClick={handleCancel} disabled={isCancelling}>
                {isCancelling ? "Cancelling..." : "Cancel Order"}
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Shipping Info */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="font-medium">{order.shippingAddress?.fullName}</p>
              <p className="text-muted-foreground">{order.shippingAddress?.phone}</p>
              <p>
                {order.shippingAddress?.district}, {order.shippingAddress?.city}
              </p>
              <p className="text-muted-foreground">{order.shippingAddress?.country}</p>
              <Separator className="my-3" />
              <p>
                <strong>Method:</strong> {order.shippingMethod}
              </p>
              <p>
                <strong>Placed:</strong> {formatDate(order.createdAt)}
              </p>
              <p>
                <strong>Updated:</strong> {formatDate(order.updatedAt)}
              </p>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card>
            <CardHeader>
              <CardTitle>Payment & Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <strong>Payment Method:</strong> {order.paymentMethod}
              </p>
              <p>
                <strong>Payment Status:</strong> {order.paymentStatus}
              </p>
              <Separator className="my-3" />
              <p>
                <strong>Account ID:</strong>{" "}
                <span className="font-mono">{order.account}</span>
              </p>
              <p>
                <strong>Items:</strong>{" "}
                {order.products?.reduce(
                  (sum: number, item: any) => sum + (item.quantity || 0),
                  0
                )}{" "}
                total
              </p>
              <p>
                <strong>Order Total:</strong>{" "}
                <span className="font-semibold">{formatCurrency(order.totalAmount)}</span>
              </p>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>
                  {formatCurrency(
                    (order.products || []).reduce(
                      (acc: number, p: any) =>
                        acc + (p.price || 0) * (p.quantity || 1),
                      0
                    )
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {order.shippingMethod === "Pickup"
                    ? "FRW 0.00"
                    : "Calculated at checkout"}
                </span>
              </div>
              <Separator className="my-3" />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>{formatCurrency(order.totalAmount)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Product Items */}
        <section className="mt-10">
          <Card>
            <CardHeader>
              <CardTitle>Ordered Items</CardTitle>
            </CardHeader>
            <CardContent>
              {order.products?.length ? (
                <div className="divide-y">
                  {order.products.map((it: any) => {
                    const prod = it.product || {}
                    return (
                      <div key={it._id} className="flex items-center gap-4 py-4">
                        <div className="relative h-20 w-20 rounded-md bg-gray-100 overflow-hidden">
                          <Image
                            src={(prod.image as string) || "/placeholder.svg"}
                            alt={prod.name || "Product"}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-1">
                          <p className="font-medium">{prod.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Price: {formatCurrency(it.price)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {it.quantity}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="font-semibold">
                            {formatCurrency((it.price || 0) * (it.quantity || 1))}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ID: <span className="font-mono">{prod._id}</span>
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No items found in this order.</p>
              )}
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  )
}
