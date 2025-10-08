import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const products = [
  { name: "Wireless Headphones", sales: 245, percentage: 85 },
  { name: "Smart Watch Pro", sales: 189, percentage: 72 },
  { name: "Laptop Stand", sales: 156, percentage: 65 },
  { name: "USB-C Hub", sales: 134, percentage: 58 },
  { name: "Mechanical Keyboard", sales: 98, percentage: 42 },
]

export function TopProducts() {
  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Top Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {products.map((product) => (
            <div key={product.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">{product.name}</p>
                <p className="text-sm text-muted-foreground">{product.sales} sales</p>
              </div>
              <Progress value={product.percentage} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
