"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-header";
import { AdminSidebarProvider } from "@/components/admin-sidebar-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, AlertTriangle } from "lucide-react";
import { AddProductDialog } from "@/components/add-product-dialog";
import { Product } from "@/lib/types";


// ✅ Unified Product interface (matches AddProductDialog)



// ✅ AddProductDialogProps interface (matching your dialog)
export interface AddProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  onSaved?: (product: Product) => void;
}


export default function StockPage() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // ✅ Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${apiUrl}/products`);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();

        const items = Array.isArray(data)
          ? data
          : Array.isArray(data.products)
            ? data.products
            : [];

        // ✅ Normalize products: ensure each has id and imageUrl
        const normalizedProducts = items.map(
          (p: Product & { _id?: string; imageUrl?: string; images?: string[] }) => ({
            ...p,
            id: p.id ?? p._id, // use _id if id doesn't exist
            imageUrl: p.imageUrl ?? p.image ?? (p.images?.[0] ?? "/placeholder.svg"),
          })
        );

        setProducts(normalizedProducts);
      } catch (err: any) {
        console.error("Error fetching products:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);



  // ✅ Derived counts
  const getStatus = (quantity: number) => {
    if (quantity === 0) return "out-of-stock";
    if (quantity < 5) return "low-stock"; // adjust threshold as needed
    return "in-stock";
  };

  const lowStockCount = products.filter(p => p.quantity > 0 && p.quantity < 5).length;
  const outOfStockCount = products.filter(p => p.quantity === 0).length;
  // ✅ Handle Edit
  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsEditDialogOpen(true);
  };

  // ✅ Add new product
  const handleProductAdded = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  // ✅ Update existing product
  const handleProductUpdated = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-medium">Loading products...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-medium text-red-500">{error}</p>
      </div>
    );

  return (
    <AdminSidebarProvider>
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />

        <div className="ml-0 md:ml-64 flex-1">
          <AdminHeader />

          <main className="p-6">
            {/* ✅ Alerts */}
            {(lowStockCount > 0 || outOfStockCount > 0) && (
              <div className="mb-6 grid gap-4 md:grid-cols-2">
                {lowStockCount > 0 && (
                  <Card className="border-yellow-400 bg-card">
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="rounded-lg bg-yellow-100 p-3">
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Low Stock Alert</p>
                        <p className="text-xs text-muted-foreground">
                          {lowStockCount} products running low
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
                {outOfStockCount > 0 && (
                  <Card className="border-red-500 bg-card">
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="rounded-lg bg-red-100 p-3">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Out of Stock</p>
                        <p className="text-xs text-muted-foreground">
                          {outOfStockCount} products need restocking
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* ✅ Stock Table */}
            <Card className="bg-card">
              <CardHeader>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <CardTitle className="text-foreground">
                    Stock Management
                  </CardTitle>
                  <div className="flex w-full items-center gap-2 md:w-auto">
                    <div className="relative flex-1 md:flex-none">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search products..."
                        className="w-full pl-9"
                      />
                    </div>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Product
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                          Product
                        </th>
                        <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                          Brand
                        </th>
                        <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                          Category
                        </th>
                        <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                          Quantity
                        </th>
                        <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                          Price
                        </th>
                        <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                          Status
                        </th>
                        <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => {
                        const safeId = String(product.id).replace("_", "-");
                        return (
                          <tr key={safeId} className="border-b border-border last:border-0">
                            <td className="py-4">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-muted overflow-hidden">
                                  <Image
                                    src={product.imageUrl}
                                    alt={product.name || "Product Image"}
                                    width={40}
                                    height={40}
                                  />
                                </div>
                                <p className="text-sm font-medium text-foreground">
                                  {product.name || "Unnamed Product"}
                                </p>
                              </div>
                            </td>
                            <td className="py-4 text-sm text-muted-foreground">
                              {product.brand || "N/A"}
                            </td>
                            <td className="py-4 text-sm">{product.category || "N/A"}</td>
                            <td className="py-4 text-sm font-medium">{product.quantity ?? 0}</td>
                            <td className="py-4 text-sm font-medium">
                              {typeof product.price === "number"
                                ? `FRW ${product.price.toFixed(2)}`
                                : product.price}
                            </td>
                            <td className="py-4">
                              <Badge
                                variant={
                                  getStatus(product.quantity) === "in-stock"
                                    ? "default"
                                    : getStatus(product.quantity) === "low-stock"
                                      ? "secondary"
                                      : "destructive"
                                }
                                className="capitalize"
                              >
                                {getStatus(product.quantity).replace("-", " ")}
                              </Badge>

                            </td>
                            <td className="py-4">
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEdit(product)}
                                >
                                  Edit
                                </Button>
                                <Button variant="ghost" size="sm">
                                  Restock
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>

      {/* ✅ Add Product Dialog */}
      <AddProductDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSaved={handleProductAdded}
      />

      {/* ✅ Edit Product Dialog */}
      {selectedProduct && (
        <AddProductDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          product={selectedProduct}
          onSaved={handleProductUpdated}
        />
      )}
    </AdminSidebarProvider>
  );
}
