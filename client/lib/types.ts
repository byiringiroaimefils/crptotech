export interface Product {
  id: string
  _id: string
  name: string
  description: string
  quantity: number
  price: number
  originalPrice?: number
  category: "smartphones" | "laptops" | "tablets" | "accessories"
  brand: string
  image: string
  imageUrl: string
  images: string[]
  specs: Record<string, string>
  featured?: boolean
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered"
  createdAt: Date
  shippingAddress: Address
}

export interface Address {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}
