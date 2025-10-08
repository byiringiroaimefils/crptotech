"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Product, CartItem } from "./types"
import { useToast } from "@/hooks/use-toast"

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  total: number
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { toast } = useToast()
  const API_BASE = "http://localhost:3001/api"

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      setItems(JSON.parse(savedCart))
    }
  }, [])

  // Check authentication once on mount
  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch(`${API_BASE}/dashboard`, { credentials: "include" })
        if (!res.ok) return
        // user is authenticated — merge local cart into server and load server cart
        setIsAuthenticated(true)

        // load local cart
        const localRaw = localStorage.getItem("cart")
        const local = localRaw ? JSON.parse(localRaw) : []

        // fetch server cart
        const cartRes = await fetch(`${API_BASE}/cart`, { credentials: "include" })
        if (!cartRes.ok) return
        const serverCart = await cartRes.json()
        const serverItems: any[] = serverCart.items || []

        // build map of server quantities by productId (string)
        const serverMap: Record<string, number> = {}
        for (const it of serverItems) {
          const prod = it.productId || it.product || {}
          const pid = prod._id || prod.id || String(prod)
          serverMap[pid] = (serverMap[pid] || 0) + (it.quantity || 0)
        }

        // push local items to server if they increase quantity
        for (const localItem of local) {
          const pid = localItem.product.id
          const localQty = localItem.quantity || 0
          const serverQty = serverMap[pid] || 0
          const delta = localQty - serverQty
          if (delta > 0) {
            try {
              await fetch(`${API_BASE}/cart`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId: pid, quantity: delta }),
              })
            } catch (err) {
              console.error("Failed to merge local cart item to server", err)
            }
          }
        }

        // finally fetch authoritative server cart and set local state
        const finalRes = await fetch(`${API_BASE}/cart`, { credentials: "include" })
        if (!finalRes.ok) return
        const finalCart = await finalRes.json()
        const mapped = (finalCart.items || []).map((it: any) => {
          const prod = it.productId || it.product || {}
          return {
            product: {
              id: prod._id || prod.id || String(prod),
              name: prod.name || prod.title || "Unknown product",
              description: prod.description || "",
              price: prod.price || 0,
              originalPrice: prod.originalPrice,
              category: prod.category || "accessories",
              brand: prod.brand || "",
              image: prod.image || (Array.isArray(prod.images) && prod.images[0]) || "",
              images: prod.images || [],
              inStock: prod.inStock ?? true,
              rating: prod.rating || 0,
              reviewCount: prod.reviewCount || 0,
              specs: prod.specs || {},
            },
            quantity: it.quantity || 0,
          }
        })
        setItems(mapped)
      } catch (err) {
        // ignore errors — keep local cart
      }
    })()
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items))
  }, [items])

  const addItem = (product: Product) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.product.id === product.id)
      if (existingItem) {
        toast({
          title: "Updated cart",
          description: `${product.name} quantity increased to ${existingItem.quantity + 1}.`,
          duration: 2000,
        })
        return currentItems.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
        duration: 2000,
      })
      return [...currentItems, { product, quantity: 1 }]
    })

    // If user is signed in, sync to server (fire-and-forget optimistic)
    ;(async () => {
      if (!isAuthenticated) return
      try {
        await fetch(`${API_BASE}/cart`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: product.id, quantity: 1 }),
        })
      } catch (err) {
        console.error("Failed to sync cart to server", err)
      }
    })()
  }

  const removeItem = (productId: string) => {
    const item = items.find((item) => item.product.id === productId)
    if (item) {
      toast({
        title: "Removed from cart",
        description: `${item.product.name} has been removed from your cart.`,
        duration: 2000,
      })
    }
    setItems((currentItems) => currentItems.filter((item) => item.product.id !== productId))

    ;(async () => {
      if (!isAuthenticated) return
      try {
        await fetch(`${API_BASE}/cart/${productId}`, { method: "DELETE", credentials: "include" })
      } catch (err) {
        console.error("Failed to sync removeItem with server", err)
      }
    })()
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }
    const prev = items.find((i) => i.product.id === productId)?.quantity ?? 0
    const delta = quantity - prev

    setItems((currentItems) =>
      currentItems.map((item) => (item.product.id === productId ? { ...item, quantity } : item)),
    )

    ;(async () => {
      if (!isAuthenticated) return
      try {
        if (delta === 0) return
        if (quantity === 0) {
          await fetch(`${API_BASE}/cart/${productId}`, { method: "DELETE", credentials: "include" })
          return
        }
        await fetch(`${API_BASE}/cart`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, quantity: delta }),
        })
      } catch (err) {
        console.error("Failed to sync updateQuantity with server", err)
      }
    })()
  }

  const clearCart = () => {
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
      duration: 2000,
    })
    setItems([])
  }

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
