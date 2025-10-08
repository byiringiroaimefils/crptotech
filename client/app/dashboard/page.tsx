import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"
import { StatCard } from "@/components/stat-card"
import { RevenueChart } from "@/components/revenue-chart"
import { OrdersChart } from "@/components/orders-chart"
import { RecentOrders } from "@/components/recent-orders"
import { TopProducts } from "@/components/top-products"
import { DollarSign, ShoppingCart, Package, TrendingUp } from "lucide-react"

export default function page() {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <div className="ml-64 flex-1">
        <AdminHeader />

        <main className="p-6">
          {/* Stats Grid */}
          <div className="mb-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Revenue"
              value="$88,450"
              change="+12.5% from last month"
              changeType="positive"
              icon={DollarSign}
            />
            <StatCard
              title="Total Orders"
              value="1,245"
              change="+8.2% from last month"
              changeType="positive"
              icon={ShoppingCart}
            />
            <StatCard
              title="Products Sold"
              value="3,842"
              change="+15.3% from last month"
              changeType="positive"
              icon={Package}
            />
            <StatCard
              title="Conversion Rate"
              value="3.24%"
              change="-2.1% from last month"
              changeType="negative"
              icon={TrendingUp}
            />
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
  )
}
