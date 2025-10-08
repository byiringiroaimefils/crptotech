import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const orders = [
  {
    id: "#ORD-2024-001",
    customer: "John Doe",
    amount: "$245.00",
    status: "completed",
    date: "2 hours ago",
  },
  {
    id: "#ORD-2024-002",
    customer: "Jane Smith",
    amount: "$189.50",
    status: "processing",
    date: "4 hours ago",
  },
  {
    id: "#ORD-2024-003",
    customer: "Mike Johnson",
    amount: "$432.00",
    status: "completed",
    date: "6 hours ago",
  },
  {
    id: "#ORD-2024-004",
    customer: "Sarah Williams",
    amount: "$156.75",
    status: "pending",
    date: "8 hours ago",
  },
  {
    id: "#ORD-2024-005",
    customer: "Tom Brown",
    amount: "$298.00",
    status: "completed",
    date: "10 hours ago",
  },
]

export function RecentOrders() {
  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">{order.customer}</p>
                <p className="text-xs text-muted-foreground">{order.id}</p>
              </div>
              <div className="flex items-center gap-4">
                <Badge
                  variant={
                    order.status === "completed" ? "default" : order.status === "processing" ? "secondary" : "outline"
                  }
                  className="capitalize"
                >
                  {order.status}
                </Badge>
                <p className="text-sm font-medium text-foreground">{order.amount}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
