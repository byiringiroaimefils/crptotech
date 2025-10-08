"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Settings,Package, User, MapPin, CreditCard, LogOut, Lock, LockIcon } from "lucide-react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function AccountPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true) // prevent flicker before auth check
  const [user, setUser] = useState<any>(null)

  // ✅ Allow only logged-in users
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/dashboard", {
          withCredentials: true,
        })
        // If success, store user data if returned
        setUser(res.data.user || { name: "John Doe", email: "john.doe@example.com" })
      } catch (err) {
        // Not authenticated → redirect to login
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [router])

  const handleLogout = async () => {
    try {
      const API_BASE_URL = "http://localhost:3001/api"
      await axios.get(`${API_BASE_URL}/account/logout`, { withCredentials: true })
      router.push("/login")
    } catch (err) {
      console.error("Logout failed:", err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) return null // prevent rendering if not logged in

  const orders = [
    { id: "ORD-001", date: "2024-01-15", status: "delivered", total: 1299.0, items: 2 },
    { id: "ORD-002", date: "2024-01-10", status: "shipped", total: 249.0, items: 1 },
    { id: "ORD-003", date: "2024-01-05", status: "processing", total: 2499.0, items: 1 },
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
                      {/* <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.username} /> */}
                      <AvatarFallback>
                        {user.username
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold">{user.username}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>

                  <nav className="space-y-1">

                    <Button variant="ghost" className="w-full justify-start bg-transparent">
                      <Package className="mr-2 h-4 w-4" />
                      Orders
                    </Button>
                    <Button variant="ghost" className="w-full justify-start bg-transparent">
                      <User className="mr-2 h-4 w-4" />
                      Personal Information
                    </Button>
                    <Button variant="ghost" className="w-full justify-start bg-transparent">
                      <LockIcon className="mr-2 h-4 w-4" />
                      Security
                    </Button>
                    <Button variant="ghost" className="w-full justify-start bg-transparent" asChild>
                      <Link href="">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </Button>
                    <Button
                      onClick={handleLogout}
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

              </Tabs>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
