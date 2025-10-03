"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { products } from "@/lib/products-data"
import { Button } from "@/components/ui/button"
import { AddProductDialog } from "@/components/add-product-dialog"

export default function CatalogPage() {
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}