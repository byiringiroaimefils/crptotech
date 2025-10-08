import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"
import { AdminSidebarProvider } from "@/components/admin-sidebar-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, AlertTriangle } from "lucide-react"

const products = [
  {
    id: "PRD-001",
    name: "Wireless Headphones",
    sku: "WH-2024-001",
    category: "Electronics",
    stock: 245,
    price: "$89.99",
    status: "in-stock",
  },
  {
    id: "PRD-002",
    name: "Smart Watch Pro",
    sku: "SW-2024-002",
    category: "Electronics",
    stock: 12,
    price: "$299.99",
    status: "low-stock",
  },
  {
    id: "PRD-003",
    name: "Laptop Stand",
    sku: "LS-2024-003",
    category: "Accessories",
    stock: 156,
    price: "$45.99",
    status: "in-stock",
  },
  {
    id: "PRD-004",
    name: "USB-C Hub",
    sku: "UH-2024-004",
    category: "Accessories",
    stock: 0,
    price: "$34.99",
    status: "out-of-stock",
  },
  {
    id: "PRD-005",
    name: "Mechanical Keyboard",
    sku: "MK-2024-005",
    category: "Electronics",
    stock: 98,
    price: "$129.99",
    status: "in-stock",
  },
  {
    id: "PRD-006",
    name: "Wireless Mouse",
    sku: "WM-2024-006",
    category: "Electronics",
    stock: 8,
    price: "$49.99",
    status: "low-stock",
  },
  {
    id: "PRD-007",
    name: "Phone Case",
    sku: "PC-2024-007",
    category: "Accessories",
    stock: 432,
    price: "$19.99",
    status: "in-stock",
  },
  {
    id: "PRD-008",
    name: "Screen Protector",
    sku: "SP-2024-008",
    category: "Accessories",
    stock: 267,
    price: "$12.99",
    status: "in-stock",
  },
]

export default function StockPage() {
  const lowStockCount = products.filter((p) => p.status === "low-stock").length
  const outOfStockCount = products.filter((p) => p.status === "out-of-stock").length

  return (
    <AdminSidebarProvider>
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />

        <div className="ml-0 md:ml-64 flex-1">
          <AdminHeader />

          <main className="p-6">
          {/* Alert Cards */}
          {(lowStockCount > 0 || outOfStockCount > 0) && (
            <div className="mb-6 grid gap-4 md:grid-cols-2">
              {lowStockCount > 0 && (
                <Card className="border-chart-3 bg-card">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="rounded-lg bg-chart-3/10 p-3">
                      <AlertTriangle className="h-5 w-5 text-chart-3" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Low Stock Alert</p>
                      <p className="text-xs text-muted-foreground">{lowStockCount} products running low</p>
                    </div>
                  </CardContent>
                </Card>
              )}
              {outOfStockCount > 0 && (
                <Card className="border-destructive bg-card">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="rounded-lg bg-destructive/10 p-3">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Out of Stock</p>
                      <p className="text-xs text-muted-foreground">{outOfStockCount} products need restocking</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <Card className="bg-card">
            <CardHeader>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <CardTitle className="text-foreground">Stock Management</CardTitle>
                <div className="flex w-full items-center gap-2 md:w-auto">
                  <div className="relative flex-1 md:flex-none">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search products..." className="w-full pl-9" />
                  </div>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
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
                      <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Product</th>
                      <th className="pb-3 text-left text-sm font-medium text-muted-foreground">SKU</th>
                      <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Category</th>
                      <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Stock</th>
                      <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Price</th>
                      <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                      <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b border-border last:border-0">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-muted" />
                            <p className="text-sm font-medium text-foreground">{product.name}</p>
                          </div>
                        </td>
                        <td className="py-4 text-sm text-muted-foreground">{product.sku}</td>
                        <td className="py-4 text-sm text-foreground">{product.category}</td>
                        <td className="py-4 text-sm font-medium text-foreground">{product.stock}</td>
                        <td className="py-4 text-sm font-medium text-foreground">{product.price}</td>
                        <td className="py-4">
                          <Badge
                            variant={
                              product.status === "in-stock"
                                ? "default"
                                : product.status === "low-stock"
                                  ? "secondary"
                                  : "destructive"
                            }
                            className="capitalize"
                          >
                            {product.status.replace("-", " ")}
                          </Badge>
                        </td>
                        <td className="py-4">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm">
                              Restock
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="space-y-4 md:hidden">
                {products.map((product) => (
                  <div key={product.id} className="rounded-lg border border-border p-4 bg-card">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.sku} • {product.category}</p>
                        <p className="mt-2 text-sm">Price: {product.price}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">Stock: {product.stock}</p>
                        <div className="mt-2">
                          <Badge className="capitalize">{product.status.replace("-", " ")}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button variant="ghost" className="flex-1">Edit</Button>
                      <Button variant="outline" className="flex-1">Restock</Button>
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
