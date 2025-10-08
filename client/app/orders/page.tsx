import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"
import { AdminSidebarProvider } from "@/components/admin-sidebar-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"

const orders = [
  {
    id: "#ORD-2024-001",
    customer: "John Doe",
    email: "john@example.com",
    amount: "$245.00",
    status: "completed",
    date: "Dec 10, 2024",
    items: 3,
  },
  {
    id: "#ORD-2024-002",
    customer: "Jane Smith",
    email: "jane@example.com",
    amount: "$189.50",
    status: "processing",
    date: "Dec 10, 2024",
    items: 2,
  },
  {
    id: "#ORD-2024-003",
    customer: "Mike Johnson",
    email: "mike@example.com",
    amount: "$432.00",
    status: "completed",
    date: "Dec 9, 2024",
    items: 5,
  },
  {
    id: "#ORD-2024-004",
    customer: "Sarah Williams",
    email: "sarah@example.com",
    amount: "$156.75",
    status: "pending",
    date: "Dec 9, 2024",
    items: 1,
  },
  {
    id: "#ORD-2024-005",
    customer: "Tom Brown",
    email: "tom@example.com",
    amount: "$298.00",
    status: "completed",
    date: "Dec 8, 2024",
    items: 4,
  },
  {
    id: "#ORD-2024-006",
    customer: "Emily Davis",
    email: "emily@example.com",
    amount: "$567.25",
    status: "processing",
    date: "Dec 8, 2024",
    items: 6,
  },
  {
    id: "#ORD-2024-007",
    customer: "David Wilson",
    email: "david@example.com",
    amount: "$123.50",
    status: "cancelled",
    date: "Dec 7, 2024",
    items: 2,
  },
  {
    id: "#ORD-2024-008",
    customer: "Lisa Anderson",
    email: "lisa@example.com",
    amount: "$389.00",
    status: "completed",
    date: "Dec 7, 2024",
    items: 3,
  },
]

export default function OrdersPage() {
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
                      <Input placeholder="Search orders..." className="w-full pl-9" />
                    </div>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
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
                      {orders.map((order) => (
                        <tr key={order.id} className="border-b border-border last:border-0">
                          <td className="py-4 text-sm font-medium text-foreground">{order.id}</td>
                          <td className="py-4">
                            <div>
                              <p className="text-sm font-medium text-foreground">{order.customer}</p>
                              <p className="text-xs text-muted-foreground">{order.email}</p>
                            </div>
                          </td>
                          <td className="py-4 text-sm text-muted-foreground">{order.date}</td>
                          <td className="py-4 text-sm text-foreground">{order.items}</td>
                          <td className="py-4 text-sm font-medium text-foreground">{order.amount}</td>
                          <td className="py-4">
                            <Badge
                              variant={
                                order.status === "completed"
                                  ? "default"
                                  : order.status === "processing"
                                    ? "secondary"
                                    : order.status === "cancelled"
                                      ? "destructive"
                                      : "outline"
                              }
                              className="capitalize"
                            >
                              {order.status}
                            </Badge>
                          </td>
                          <td className="py-4">
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="space-y-4 md:hidden">
                  {orders.map((order) => (
                    <div key={order.id} className="rounded-lg border border-border p-4 bg-card">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-semibold text-foreground">{order.customer}</p>
                          <p className="text-xs text-muted-foreground">{order.email}</p>
                          <p className="mt-2 text-sm">{order.id} • {order.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{order.amount}</p>
                          <p className="text-sm text-muted-foreground">{order.items} item(s)</p>
                          <div className="mt-2">
                            <Badge className="capitalize">{order.status}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button variant="ghost" className="flex-1">View</Button>
                        <Button variant="outline" className="flex-1">Contact</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </AdminSidebarProvider>
  )
}
