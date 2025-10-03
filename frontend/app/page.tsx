import Link from "next/link"
import { ArrowRight, Truck, Shield, Headphones, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { products } from "@/lib/products-data"

export default function HomePage() {
  const featuredProducts = products.filter((p) => p.featured)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
     
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-shadow">
                Latest Electronic Devices at Your Fingertips
              </h1>
              <p className="text-xl mb-8">
                Discover premium smartphones, laptops, headphones, and more. 
                Shop with confidence and enjoy fast, reliable delivery.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                 <Button size="lg" asChild>
                  <Link href="/products">
                    Shop Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1468495244123-6c6c332eeece?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Latest Electronics"
                  className="rounded-xl shadow-2xl w-full max-w-md"
                />
                <div className="absolute -bottom-4 -right-4 bg-[var(--accent-color)] text-white px-6 py-3 rounded-lg font-bold shadow-lg">
                  Free Shipping!
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

        {/* Features */}
        <section className="border-y bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Free Shipping</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">On orders over $100</p>
              </div>
              <div className="flex flex-col items-center text-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Secure Payment</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">100% secure transactions</p>
              </div>
              <div className="flex flex-col items-center text-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Headphones className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">24/7 Support</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Dedicated customer service</p>
              </div>
              <div className="flex flex-col items-center text-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Easy Returns</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">30-day return policy</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Featured Products</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                Check out our handpicked selection of premium electronics
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="mt-12 text-center">
              <Button size="lg" variant="outline" asChild>
                <Link href="/products">
                  View All Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="bg-muted/30 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Shop by Category</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">Find exactly what you're looking for</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Link
                href="/products?category=smartphones"
                className="group relative overflow-hidden rounded-xl bg-card p-8 text-center transition-all hover:shadow-lg"
              >
                <div className="relative z-10">
                  <h3 className="text-xl font-semibold mb-2">Smartphones</h3>
                  <p className="text-sm text-muted-foreground">Latest models from top brands</p>
                </div>
              </Link>
              <Link
                href="/products?category=laptops"
                className="group relative overflow-hidden rounded-xl bg-card p-8 text-center transition-all hover:shadow-lg"
              >
                <div className="relative z-10">
                  <h3 className="text-xl font-semibold mb-2">Laptops</h3>
                  <p className="text-sm text-muted-foreground">Powerful computing solutions</p>
                </div>
              </Link>
              <Link
                href="/products?category=tablets"
                className="group relative overflow-hidden rounded-xl bg-card p-8 text-center transition-all hover:shadow-lg"
              >
                <div className="relative z-10">
                  <h3 className="text-xl font-semibold mb-2">Tablets</h3>
                  <p className="text-sm text-muted-foreground">Portable productivity devices</p>
                </div>
              </Link>
              <Link
                href="/products?category=accessories"
                className="group relative overflow-hidden rounded-xl bg-card p-8 text-center transition-all hover:shadow-lg"
              >
                <div className="relative z-10">
                  <h3 className="text-xl font-semibold mb-2">Accessories</h3>
                  <p className="text-sm text-muted-foreground">Essential tech add-ons</p>
                </div>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
