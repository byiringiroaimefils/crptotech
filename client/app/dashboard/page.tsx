"use client"

import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"
import { AdminSidebarProvider } from "@/components/admin-sidebar-context"
import { StatCard } from "@/components/stat-card"
import { RevenueChart } from "@/components/revenue-chart"
import { OrdersChart } from "@/components/orders-chart"
import { RecentOrders } from "@/components/recent-orders"
import { TopProducts } from "@/components/top-products"
import { DollarSign, ShoppingCart, Package, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"
import axios from "axios"

interface OrderStats {
  totalRevenue: number
  totalOrders: number
  productsSold: number
  conversionRate: number
  revenueChange: number
  ordersChange: number
  productsSoldChange: number
  conversionRateChange: number
}

export default function Page() {
  const [stats, setStats] = useState<OrderStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
        const res = await axios.get(`${base}/api/orders/all`, { withCredentials: true })
        const d = res.data
        
        // Support different payload structures
        const list = d?.orders ?? d?.ordersa ?? (Array.isArray(d) ? d : [])
        
        // Get current date and calculate date ranges
        const now = new Date()
        const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59)
        
        // Filter orders for current month
        const currentMonthOrders = list.filter((o: any) => {
          const orderDate = new Date(o.createdAt ?? o.date)
          return orderDate >= firstDayThisMonth
        })
        
        // Filter orders for last month
        const lastMonthOrders = list.filter((o: any) => {
          const orderDate = new Date(o.createdAt ?? o.date)
          return orderDate >= firstDayLastMonth && orderDate <= lastDayLastMonth
        })
        
        // Calculate total revenue (current month) - only paid orders
        const totalRevenue = currentMonthOrders.reduce((sum: number, order: any) => {
          const status = (order.orderStatus ?? order.status ?? "").toLowerCase()
          const isPaid = status === "paid" || status === "completed" || order.paymentStatus === "paid"
          return sum + (isPaid ? Number(order.totalAmount ?? order.total ?? 0) : 0)
        }, 0)
        
        // Calculate last month revenue
        const lastMonthRevenue = lastMonthOrders.reduce((sum: number, order: any) => {
          const status = (order.orderStatus ?? order.status ?? "").toLowerCase()
          const isPaid = status === "paid" || status === "completed" || order.paymentStatus === "paid"
          return sum + (isPaid ? Number(order.totalAmount ?? order.total ?? 0) : 0)
        }, 0)
        
        // Calculate revenue change percentage
        const revenueChange = lastMonthRevenue > 0 
          ? Number((((totalRevenue - lastMonthRevenue) / lastMonthRevenue) * 100).toFixed(1))
          : 0
        
        // Calculate total orders (current month)
        const totalOrders = currentMonthOrders.length
        const lastMonthOrdersCount = lastMonthOrders.length
        
        // Calculate orders change percentage
        const ordersChange = lastMonthOrdersCount > 0
          ? Number((((totalOrders - lastMonthOrdersCount) / lastMonthOrdersCount) * 100).toFixed(1))
          : 0
        
        // Calculate products sold (current month)
        const productsSold = currentMonthOrders.reduce((sum: number, order: any) => {
          return sum + (order.products ?? []).reduce((pSum: number, p: any) => 
            pSum + (p.quantity || 0), 0
          )
        }, 0)
        
        // Calculate last month products sold
        const lastMonthProductsSold = lastMonthOrders.reduce((sum: number, order: any) => {
          return sum + (order.products ?? []).reduce((pSum: number, p: any) => 
            pSum + (p.quantity || 0), 0
          )
        }, 0)
        
        // Calculate products sold change percentage
        const productsSoldChange = lastMonthProductsSold > 0
          ? Number((((productsSold - lastMonthProductsSold) / lastMonthProductsSold) * 100).toFixed(1))
          : 0
        
        // Calculate conversion rate (paid/completed orders / total orders)
        const paidOrders = currentMonthOrders.filter((o: any) => {
          const status = (o.orderStatus ?? o.status ?? "").toLowerCase()
          return status === "paid" || status === "completed" || o.paymentStatus === "paid"
        }).length
        
        const conversionRate = totalOrders > 0 
          ? Number(((paidOrders / totalOrders) * 100).toFixed(2))
          : 0
        
        // Calculate last month conversion rate
        const lastMonthPaidOrders = lastMonthOrders.filter((o: any) => {
          const status = (o.orderStatus ?? o.status ?? "").toLowerCase()
          return status === "paid" || status === "completed" || o.paymentStatus === "paid"
        }).length
        
        const lastMonthConversionRate = lastMonthOrdersCount > 0
          ? Number(((lastMonthPaidOrders / lastMonthOrdersCount) * 100).toFixed(2))
          : 0
        
        // Calculate conversion rate change (absolute difference)
        const conversionRateChange = Number((conversionRate - lastMonthConversionRate).toFixed(2))
        
        setStats({
          totalRevenue,
          totalOrders,
          productsSold,
          conversionRate,
          revenueChange,
          ordersChange,
          productsSoldChange,
          conversionRateChange
        })
      } catch (err: any) {
        console.error("Failed to load stats:", err)
        // Set default values on error
        setStats({
          totalRevenue: 0,
          totalOrders: 0,
          productsSold: 0,
          conversionRate: 0,
          revenueChange: 0,
          ordersChange: 0,
          productsSoldChange: 0,
          conversionRateChange: 0
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  // Helper functions
  const formatCurrency = (value: number) => {
    return `FRW ${value.toLocaleString()}`
  }

  const formatChange = (change: number, isPercentage: boolean = true) => {
    const prefix = change > 0 ? "+" : ""
    const suffix = isPercentage ? "%" : ""
    return `${prefix}${change}${suffix} from last month`
  }

  const getChangeType = (change: number): "positive" | "negative" | "neutral" => {
    if (change > 0) return "positive"
    if (change < 0) return "negative"
    return "neutral"
  }

  return (
    <AdminSidebarProvider>
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />

        <div className="ml-0 md:ml-64 flex-1">
          <AdminHeader />

          <main className="p-6">
            {/* Stats Grid */}
            <div className="mb-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {loading ? (
                // Loading skeletons
                <>
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
                  ))}
                </>
              ) : stats ? (
                // Actual stats
                <>
                  <StatCard
                    title="Total Revenue"
                    value={formatCurrency(stats.totalRevenue)}
                    change={formatChange(stats.revenueChange)}
                    changeType={getChangeType(stats.revenueChange)}
                    icon={DollarSign}
                  />
                  <StatCard
                    title="Total Orders"
                    value={stats.totalOrders.toLocaleString()}
                    change={formatChange(stats.ordersChange)}
                    changeType={getChangeType(stats.ordersChange)}
                    icon={ShoppingCart}
                  />
                  <StatCard
                    title="Products Sold"
                    value={stats.productsSold.toLocaleString()}
                    change={formatChange(stats.productsSoldChange)}
                    changeType={getChangeType(stats.productsSoldChange)}
                    icon={Package}
                  />
                  <StatCard
                    title="Conversion Rate"
                    value={`${stats.conversionRate}%`}
                    change={formatChange(stats.conversionRateChange, false)}
                    changeType={getChangeType(stats.conversionRateChange)}
                    icon={TrendingUp}
                  />
                </>
              ) : null}
            </div>

            {/* Charts Grid */}
            <div className="mb-6 grid gap-6 lg:grid-cols-2">
              <RevenueChart />
              <OrdersChart />
            </div>

            {/* Bottom Grid */}
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <RecentOrders />
              </div>
              <div>
                <TopProducts />
              </div>
            </div>
          </main>
        </div>
      </div>
    </AdminSidebarProvider>
  )
}