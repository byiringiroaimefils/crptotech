"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Package, User, MapPin, CreditCard, LogOut } from "lucide-react"

export default function AccountPage() {
  // Mock user data
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "/placeholder.svg?height=100&width=100",
  }

  const orders = [
    {
      id: "ORD-001",
      date: "2024-01-15",
      status: "delivered",
      total: 1299.0,
      items: 2,
    },
    {
      id: "ORD-002",
      date: "2024-01-10",
      status: "shipped",
      total: 249.0,
      items: 1,
    },
    {
      id: "ORD-003",
      date: "2024-01-05",
      status: "processing",
      total: 2499.0,
      items: 1,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
      case "shipped":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
      case "processing":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Account</h1>
            <p className="text-muted-foreground">Manage your account and view your orders</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-4">
            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center mb-6">
                    <Avatar className="h-20 w-20 mb-3">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>

                  <nav className="space-y-1">
                    <Button variant="ghost" className="w-full justify-start bg-transparent" asChild>
                      <Link href="/catalog">
                        <Package className="mr-2 h-4 w-4" />
                        Product Catalog
                      </Link>
                    </Button>

                    <Button variant="ghost" className="w-full justify-start bg-transparent">
                      <Package className="mr-2 h-4 w-4" />
                      Orders
                    </Button>
                    <Button variant="ghost" className="w-full justify-start bg-transparent">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Button>
                    <Button variant="ghost" className="w-full justify-start bg-transparent">
                      <MapPin className="mr-2 h-4 w-4" />
                      Addresses
                    </Button>
                    <Button variant="ghost" className="w-full justify-start bg-transparent">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Payment Methods
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-destructive hover:text-destructive bg-transparent"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </nav>
                </CardContent>
              </Card>
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <Tabs defaultValue="orders" className="w-full">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="orders">Orders</TabsTrigger>
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="addresses">Addresses</TabsTrigger>
                </TabsList>

                <TabsContent value="orders" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Order History</CardTitle>
                      <CardDescription>View and track your orders</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                            <div className="space-y-1">
                              <div className="flex items-center gap-3">
                                <p className="font-semibold">{order.id}</p>
                                <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {new Date(order.date).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </p>
                              <p className="text-sm text-muted-foreground">{order.items} item(s)</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg">${order.total.toFixed(2)}</p>
                              <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                                View Details
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="profile" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Information</CardTitle>
                      <CardDescription>Update your personal information</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">Profile settings coming soon...</p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="addresses" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Saved Addresses</CardTitle>
                      <CardDescription>Manage your shipping addresses</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">No saved addresses yet.</p>
                      <Button className="mt-4">Add New Address</Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
