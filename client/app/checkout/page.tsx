"use client"

import React, { useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, CreditCard, Truck, Lock } from "lucide-react"

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const router = useRouter()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)

  // Form state
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [zipCode, setZipCode] = useState("")
  const [country, setCountry] = useState("United States")
  const [shippingMethod, setShippingMethod] = useState("standard")
  // keep internal values lowercase for UI; mapping will convert to backend enum
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [phone, setPhone] = useState("")
  const [district, setDistrict] = useState("")

  const shippingCost = total >= 100 ? 0 : shippingMethod === "express" ? 19.99 : 9.99
  const tax = total * 0.08
  const orderTotal = total + shippingCost + tax

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Basic client validation
    if (!firstName || !lastName || !address || !city || !district || !phone) {
      setIsProcessing(false)
      toast({ title: "Missing information", description: "Please complete the shipping address." })
      return
    }

    // Map frontend values to backend enums
    const shippingMethodMapped =
      shippingMethod === "express" ? "Express" : shippingMethod === "standard" ? "Standard" : "Pickup"
    const paymentMethodMapped =
      paymentMethod === "card"
        ? "Card"
        : paymentMethod === "paypal"
        ? "PayPal"
        : paymentMethod === "mobilemoney"
        ? "Mobile Money"
        : "Cash on Delivery"

    // Build products payload
    const productsPayload = items.map((item) => ({
      product: item.product.id ?? item.product._id,
      quantity: item.quantity,
      price: item.product.price,
    }))

    const payload = {
      products: productsPayload,
      totalAmount: Number(orderTotal.toFixed(2)),
      shippingAddress: {
        fullName: `${firstName} ${lastName}`,
        phone,
        country,
        district,
        city,
      },
      shippingMethod: shippingMethodMapped,
      paymentMethod: paymentMethodMapped,
    }

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/orders`,
        payload,
        {
          withCredentials: true,
        }
      )

      clearCart()
      toast({
        title: "Order placed",
        description: "Your order was created and is pending payment.",
      })
      setIsProcessing(false)
      router.push("/account")
    } catch (err: any) {
      setIsProcessing(false)
      const message = err.response?.data?.message || err.message || "Something went wrong"
      toast({ title: "Error", description: message })
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center py-16 px-4">
            <h1 className="text-3xl font-bold mb-3">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">Add some items to your cart before checking out.</p>
            <Button size="lg" asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/cart">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Cart
            </Link>
          </Button>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                      1
                    </div>
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} required />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input id="state" value={state} onChange={(e) => setState(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input id="zipCode" value={zipCode} onChange={(e) => setZipCode(e.target.value)} required />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="district">District</Label>
                      <Input id="district" value={district} onChange={(e) => setDistrict(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" value={country} onChange={(e) => setCountry(e.target.value)} required />
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                      2
                    </div>
                    Shipping Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={shippingMethod} onValueChange={setShippingMethod}>
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="standard" id="standard" />
                        <Label htmlFor="standard" className="cursor-pointer">
                          <div className="font-medium">Standard Shipping</div>
                          <div className="text-sm text-muted-foreground">5-7 business days</div>
                        </Label>
                      </div>
                      <span className="font-semibold">{total >= 100 ? "FREE" : "FRW9.99"}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="express" id="express" />
                        <Label htmlFor="express" className="cursor-pointer">
                          <div className="font-medium">Express Shipping</div>
                          <div className="text-sm text-muted-foreground">2-3 business days</div>
                        </Label>
                      </div>
                      <span className="font-semibold">FRW19.99</span>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Payment Method - only four selectable options, no card inputs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                      3
                    </div>
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center gap-3 rounded-lg border p-4">
                      <RadioGroupItem value="card" id="pm-card" />
                      <Label htmlFor="pm-card" className="flex items-center gap-2 cursor-pointer">
                        <CreditCard className="h-5 w-5" />
                        <span className="font-medium">Card</span>
                      </Label>
                    </div>

                    <div className="flex items-center gap-3 rounded-lg border p-4">
                      <RadioGroupItem value="mobilemoney" id="pm-mobilemoney" />
                      <Label htmlFor="pm-mobilemoney" className="cursor-pointer">
                        <span className="font-medium">Mobile Money</span>
                      </Label>
                    </div>

                    <div className="flex items-center gap-3 rounded-lg border p-4">
                      <RadioGroupItem value="paypal" id="pm-paypal" />
                      <Label htmlFor="pm-paypal" className="cursor-pointer">
                        <span className="font-medium">PayPal</span>
                      </Label>
                    </div>

                    <div className="flex items-center gap-3 rounded-lg border p-4">
                      <RadioGroupItem value="cod" id="pm-cod" />
                      <Label htmlFor="pm-cod" className="cursor-pointer">
                        <span className="font-medium">Cash on Delivery</span>
                      </Label>
                    </div>
                  </RadioGroup>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground pt-4">
                    <Lock className="h-4 w-4" />
                    <span>Your payment choice will be processed on the next step</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.product.id} className="flex gap-3">
                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                          <Image
                            src={item.product.image || "/placeholder.svg"}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm line-clamp-1">{item.product.name}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                          <p className="text-sm font-semibold mt-1">
                            FRW{(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">FRW{total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium">
                        {shippingCost === 0 ? "FREE" : `FRW${shippingCost.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="font-medium">FRW{tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="text-2xl font-bold">FRW{orderTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button size="lg" className="w-full" onClick={handleSubmit} disabled={isProcessing}>
                    {isProcessing ? "Processing..." : "Place Order"}
                  </Button>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
                    <Truck className="h-4 w-4" />
                    <span>Free shipping on orders over FRW100</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
