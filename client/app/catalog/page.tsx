"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { AddProductDialog } from "@/components/add-product-dialog"
import { fetchProducts } from "@/lib/products-api"
import type { Product } from "@/lib/types"
import { deleteProduct, updateProduct } from "@/lib/products-api"
import { Pencil, Trash2 } from "lucide-react"

export default function CatalogPage() {
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Product | null>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const fetched = await fetchProducts()
      setProducts(fetched)
      setLoading(false)
    }
    load()
  }, [])
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 space-y-4 sm:space-y-0">
            <div className="w-full sm:w-auto text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold">Product Catalog</h1>
              <p className="text-muted-foreground text-sm sm:text-base mt-1">Browse our collection of products</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full sm:w-auto"
              onClick={() => setIsAddProductOpen(true)}
            >
              <span className="hidden sm:inline">Add New Product</span>
              <span className="sm:hidden">Add Product</span>
            </Button>
          </div>

          <AddProductDialog 
            isOpen={isAddProductOpen}
            onClose={() => setIsAddProductOpen(false)}
          />

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {[1,2,3,4,5,6,7,8].map((n) => (
                <div key={n} className="animate-pulse">
                  <div className="bg-gray-200 h-64 rounded-lg"></div>
                  <div className="mt-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {products.map((product) => (
                <div key={product.id}>
                  <ProductCard
                    product={product}
                    footer={
                      <div className="flex gap-2 w-full">
                        <Button className="w-1/2" variant="secondary" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setEditing(product) }}>
                          <Pencil className="h-4 w-4 mr-2" /> Edit
                        </Button>
                        <Button className="w-1/2" variant="destructive" onClick={async (e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (!confirm('Delete this product?')) return
                          const ok = await deleteProduct(product.id)
                          if (ok) setProducts((prev) => prev.filter((p) => p.id !== product.id))
                        }}>
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </Button>
                      </div>
                    }
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Add / Edit Dialog */}
      <AddProductDialog 
        isOpen={isAddProductOpen || !!editing}
        onClose={() => { setIsAddProductOpen(false); setEditing(null) }}
        product={editing}
        onSaved={(saved) => {
          setProducts((prev) => {
            const exists = prev.some((p) => p.id === saved.id)
            return exists ? prev.map((p) => (p.id === saved.id ? saved : p)) : [saved, ...prev]
          })
          setEditing(null)
        }}
      />

      <Footer />
    </div>
  )
}