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