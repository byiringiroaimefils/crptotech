"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { Star, ShoppingCart, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/types"
import { useCart } from "@/lib/cart-context"
import { useState } from "react"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsAdding(true)
    addItem(product)
    setTimeout(() => setIsAdding(false), 1000)
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <Link href={`/products/${product.id}`}>
      <Card className="group h-full overflow-hidden transition-all hover:shadow-lg">
        <CardContent className="p-4">
          <div className="relative aspect-square mb-4 overflow-hidden rounded-lg bg-muted">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
            {discount > 0 && (
              <Badge className="absolute top-2 right-2 bg-destructive text-destructive-foreground">-{discount}%</Badge>
            )}
            {!product.inStock && (
              <Badge className="absolute top-2 left-2 bg-muted text-muted-foreground">Out of Stock</Badge>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">{product.brand}</p>
            <h3 className="font-semibold leading-tight line-clamp-2 text-balance">{product.name}</h3>

            <div className="flex items-center gap-1">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 FRW{
                      i < Math.floor(product.rating) ? "fill-primary text-primary" : "fill-muted text-muted"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                {product.rating} ({product.reviewCount})
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">FRW{product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">FRW{product.originalPrice}</span>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button
            className="w-full transition-all"
            onClick={handleAddToCart}
            disabled={!product.inStock}
            variant={isAdding ? "default" : "default"}
          >
            {isAdding ? (
              <>
                <Check className="mr-2 h-4 w-4 animate-in zoom-in" />
                Added!
              </>
            ) : (
              <>
                <ShoppingCart className="mr-2 h-4 w-4" />
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}
