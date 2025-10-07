"use client"

import { useEffect, useMemo, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { AddProductDialog } from "@/components/add-product-dialog"
import { fetchProducts } from "@/lib/products-api"
import type { Product } from "@/lib/types"
import { deleteProduct, updateProduct } from "@/lib/products-api"
import { Pencil, Trash2, SlidersHorizontal } from "lucide-react"
import { categories, brands } from "@/lib/products-data"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useRouter } from "next/navigation"
import axios from "axios"

export default function CatalogPage() {
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Product | null>(null)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("featured")
  const router = useRouter()

  // ✅ Allow only logged-in users
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/dashboard", {
          withCredentials: true,
        })
      } catch (err) {
        // Not authenticated → redirect to login
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [router])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const fetched = await fetchProducts()
      setProducts(fetched)
      setLoading(false)
    }
    load()
  }, [])

  const updatedCategories = useMemo(() => {
    return categories.map(category => ({
      ...category,
      count: category.id === 'all'
        ? products.length
        : products.filter(p => p.category === category.id).length
    }))
  }, [products])

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p) => selectedCategories.includes(p.category))
    }
    if (selectedBrands.length > 0) {
      filtered = filtered.filter((p) => selectedBrands.includes(p.brand))
    }

    const sorted = [...filtered]
    switch (sortBy) {
      case "price-low":
        sorted.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        sorted.sort((a, b) => b.price - a.price)
        break
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating)
        break
      case "name":
        sorted.sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    }
    return sorted
  }, [products, selectedCategories, selectedBrands, sortBy])

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) => (prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]))
  }

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3">Categories</h3>
        <div className="space-y-2">
          {updatedCategories
            .filter((cat) => cat.id !== "all")
            .map((category) => (
              <div key={category.id} className="flex items-center gap-2">
                <Checkbox
                  id={`category-${category.id}`}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={() => toggleCategory(category.id)}
                />
                <Label htmlFor={`category-${category.id}`} className="text-sm cursor-pointer">
                  {category.name} ({category.count})
                </Label>
              </div>
            ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Brands</h3>
        <div className="space-y-2">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center gap-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={selectedBrands.includes(brand)}
                onCheckedChange={() => toggleBrand(brand)}
              />
              <Label htmlFor={`brand-${brand}`} className="text-sm cursor-pointer">
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {(selectedCategories.length > 0 || selectedBrands.length > 0) && (
        <Button
          variant="outline"
          className="w-full bg-transparent"
          onClick={() => {
            setSelectedCategories([])
            setSelectedBrands([])
          }}
        >
          Clear All Filters
        </Button>
      )}
    </div>
  )
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 space-y-4 sm:space-y-0">
            <div className="w-full sm:w-auto text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold">Product Store</h1>
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
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
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
            <div className="flex gap-8">
              <aside className="hidden lg:block w-64 flex-shrink-0">
                <div className="sticky top-24">
                  <FilterContent />
                </div>
              </aside>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-6 gap-4">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="lg:hidden bg-transparent">
                        <SlidersHorizontal className="mr-2 h-4 w-4" />
                        Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                      <SheetHeader>
                        <SheetTitle>Filters</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        <FilterContent />
                      </div>
                    </SheetContent>
                  </Sheet>

                  <div className="flex items-center gap-2 ml-auto">
                    <span className="text-sm text-muted-foreground hidden sm:inline">Sort by:</span>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="featured">Featured</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                        <SelectItem value="rating">Highest Rated</SelectItem>
                        <SelectItem value="name">Name: A to Z</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {products.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No products available yet. Add a product to get started.</p>
                    <div className="mt-4">
                      <Button variant="outline" onClick={() => setIsAddProductOpen(true)}>Add New Product</Button>
                    </div>
                  </div>
                ) : filteredAndSortedProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                    {filteredAndSortedProducts.map((product) => (
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
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No products found matching your filters.</p>
                    <Button
                      variant="outline"
                      className="mt-4 bg-transparent"
                      onClick={() => {
                        setSelectedCategories([])
                        setSelectedBrands([])
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
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