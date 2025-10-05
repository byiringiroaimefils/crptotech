import type { Product } from "./types"

export const products: Product[] = []

export const categories = [
  { id: "all", name: "All Products", count: 0 },
  { id: "smartphones", name: "Smartphones", count: 0 },
  { id: "laptops", name: "Laptops", count: 0 },
  { id: "tablets", name: "Tablets", count: 0 },
  { id: "accessories", name: "Accessories", count: 0 },
]

export const brands = ["Apple", "Samsung", "Google", "Dell", "Lenovo", "Sony"]
