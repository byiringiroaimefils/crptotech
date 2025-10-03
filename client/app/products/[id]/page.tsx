"use client"

import { use } from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import { useState } from "react"
import { Star, ShoppingCart, Truck, Shield, ArrowLeft, Check } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { products } from "@/lib/products-data"
import { useCart } from "@/lib/cart-context"
import Link from "next/link"

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const product = products.find((p) => p.id === id)
  const { addItem } = useCart()
  const [selectedImage, setSelectedImage] = useState(0)
  const [isAdding, setIsAdding] = useState(false)

  if (!product) {
    notFound()
  }

  const handleAddToCart = () => {
    setIsAdding(true)
    addItem(product)
    setTimeout(() => setIsAdding(false), 1500)
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Link>
          </Button>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Images */}
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                <Image
                  src={product.images[selectedImage] || product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
                {discount > 0 && (
                  <Badge className="absolute top-4 right-4 bg-destructive text-destructive-foreground">
                    -{discount}%
                  </Badge>
                )}
              </div>
              <div className="grid grid-cols-4 gap-4">
                <button
                  onClick={() => setSelectedImage(0)}
                  className={`relative aspect-square overflow-hidden rounded-lg bg-muted FRW{
                    selectedImage === 0 ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                </button>
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx + 1)}
                    className={`relative aspect-square overflow-hidden rounded-lg bg-muted FRW{
                      selectedImage === idx + 1 ? "ring-2 ring-primary" : ""
                    }`}
                  >
                    <Image
                      src={img || "/placeholder.svg"}
                      alt={`FRW{product.name} view FRW{idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">{product.brand}</p>
                <h1 className="text-3xl font-bold mb-4 text-balance">{product.name}</h1>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 FRW{
                          i < Math.floor(product.rating) ? "fill-primary text-primary" : "fill-muted text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>

                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-4xl font-bold">FRW{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-xl text-muted-foreground line-through">FRW{product.originalPrice}</span>
                  )}
                </div>

                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </div>

              {/* Add to Cart */}
              <div className="space-y-4">
                <Button
                  size="lg"
                  className="w-full transition-all"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                >
                  {isAdding ? (
                    <>
                      <Check className="mr-2 h-5 w-5 animate-in zoom-in" />
                      Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      {product.inStock ? "Add to Cart" : "Out of Stock"}
                    </>
                  )}
                </Button>

                {product.inStock && (
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Truck className="h-4 w-4" />
                      <span>Free shipping on orders over FRW100</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="border-t pt-6 space-y-3">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="text-sm">1 year warranty included</span>
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-primary" />
                  <span className="text-sm">Fast & secure delivery</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-16">
            <Tabs defaultValue="specs" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="specs">Specifications</TabsTrigger>
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              <TabsContent value="specs" className="mt-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between border-b pb-3">
                      <span className="font-medium">{key}</span>
                      <span className="text-muted-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="description" className="mt-6">
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </TabsContent>
              <TabsContent value="reviews" className="mt-6">
                <p className="text-muted-foreground">Customer reviews coming soon.</p>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
