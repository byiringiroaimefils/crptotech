import type { Product } from './types'

export async function fetchProducts(): Promise<Product[]> {
    try {
        const response = await fetch('http://localhost:3001/api/products')
        const data = await response.json()

        if (!data.success) {
            console.error('Error fetching products:', data.message)
            return []
        }

        console.log('Raw products from API:', data.products)

        // Map the MongoDB _id to id for frontend compatibility
        const mappedProducts = data.products.map((product: any) => ({
            ...product,
            id: product._id,
            // Map imageUrl to image for frontend compatibility
            image: product.imageUrl,
            // Ensure all numbers are the correct type
            price: Number(product.price),
            originalPrice: product.originalPrice ? Number(product.originalPrice) : undefined,
            rating: product.rating ? Number(product.rating) : 0,
            reviewCount: product.reviewCount ? Number(product.reviewCount) : 0
        }))

        console.log('Mapped products:', mappedProducts)
        return mappedProducts
    } catch (error) {
        console.error('Error fetching products:', error)
        return []
    }
}

export async function updateProduct(id: string, update: Partial<Product>): Promise<Product | null> {
    try {
        const response = await fetch(`http://localhost:3001/api/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(update)
        })
        const data = await response.json()
        if (!response.ok || !data.success) {
            console.error('Error updating product:', data.message)
            return null
        }
        const p = data.product
        return {
            ...p,
            id: p._id,
            image: p.imageUrl,
            price: Number(p.price),
            originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined,
            rating: p.rating ? Number(p.rating) : 0,
            reviewCount: p.reviewCount ? Number(p.reviewCount) : 0
        }
    } catch (e) {
        console.error('Error updating product:', e)
        return null
    }
}

export async function deleteProduct(id: string): Promise<boolean> {
    try {
        const response = await fetch(`http://localhost:3001/api/products/${id}`, { method: 'DELETE' })
        const data = await response.json()
        if (!response.ok || !data.success) {
            console.error('Error deleting product:', data.message)
            return false
        }
        return true
    } catch (e) {
        console.error('Error deleting product:', e)
        return false
    }
}