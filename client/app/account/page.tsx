"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Package,
  User,
  LogOut,
  LockIcon,
  PenIcon,
} from "lucide-react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Order } from "@/lib/types"

export default function AccountPage() {

  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    phoneNumber: "",
  })
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

  // ✅ Check if user is logged in and load their orders
  useEffect(() => {
    const checkAuthAndLoad = async () => {
      try {
        const res = await axios.get(`${apiUrl}/dashboard`, {
          withCredentials: true,
        })
        setUser(res.data.user)
        setFormData({
          username: res.data.user.username || "",
          email: res.data.user.email || "",
          phoneNumber: res.data.user.phoneNumber || "",
        })

        // Fetch user's orders (server should return only orders for authenticated user)
        try {
          const ordersRes = await axios.get(`${apiUrl}/orders`, {
            withCredentials: true,
          })
          setOrders(ordersRes.data.orders || [])
        } catch (ordErr) {
          console.warn("Failed to load orders:", ordErr)
          setOrders([])
        }
      } catch (err) {
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }
    checkAuthAndLoad()
  }, [router])

  const handleLogout = async () => {
    try {
      await axios.get(`${apiUrl}/account/logout`, {
        withCredentials: true,
      })
      router.push("/login")
    } catch (err) {
      console.error("Logout failed:", err)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // ✅ Handle profile update with message display
  const handleUpdate = async () => {
    try {
      setMessage(null)
      setError(null)

      const res = await axios.put(
        `${apiUrl}/account/update`,
        formData,
        { withCredentials: true }
      )

      setUser(res.data.user)
      setMessage(res.data.message)
      setIsDialogOpen(false)
    } catch (err: any) {
      console.error("Update failed:", err)
      const errorMsg =
        err.response?.data?.message ||
        "Failed to update profile. Please try again."
      setError(errorMsg)
    }
  }

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    )

  if (!user) return null

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
          <h1 className="text-3xl font-bold mb-2">My Account</h1>
          <p className="text-muted-foreground mb-8">
            Manage your account and view your orders
          </p>

          {/* ✅ Show messages from backend */}
          {message && (
            <div className="mb-4 p-3 rounded-md bg-green-100 text-green-800 border border-green-300">
              {message}
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 rounded-md bg-red-100 text-red-800 border border-red-300">
              {error}
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-4">
            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center mb-6">
                    <Avatar className="h-20 w-20 mb-3">
                      <AvatarFallback>
                        {user.username
                          ?.split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold">{user.username}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>

                  <nav className="space-y-1">
                    <Button
                      variant="ghost"
                      className="w-full justify-start bg-transparent"
                    >
                      <Package className="mr-2 h-4 w-4" />
                      Orders
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start bg-transparent"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Personal Information
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start bg-transparent"
                    >
                      <LockIcon className="mr-2 h-4 w-4" />
                      Security
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
                        {orders.length === 0 ? (
                          <p className="text-sm text-muted-foreground">No orders yet.</p>
                        ) : (
                          orders.map((order: any) => (
                            <div
                              key={order._id || order.id}
                              className="flex items-center justify-between border-b pb-4 last:border-0"
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                  <p className="font-semibold">{order.products[0].product.name} +</p>
                                  <Badge className={getStatusColor(order.status || "")}>
                                    {order.orderStatus || "unknown"}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(order.createdAt || order.date || Date.now()).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </p>
                               <p className="text-sm text-muted-foreground">
  {order.products?.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0)} item(s)
</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-lg">
                                  ${order.totalAmount|| 0}
                                </p>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="mt-2 bg-transparent"
                                  onClick={() => router.push(`/orders/${order._id || order.id}`)}
                                >
                                  View Details
                                </Button>
                              </div>
                            </div>
                          ))
                        )}
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
                      <p className="text-muted-foreground">
                        Username: {user.username}
                      </p>
                      <p className="text-muted-foreground">
                        Email: {user.email}
                      </p>
                      {user.phoneNumber ? (
                        <p className="text-muted-foreground">
                          Phone: {user.phoneNumber}
                        </p>
                      ) : (
                        <p className="text-muted-foreground">
                          No Phone Number added
                        </p>
                      )}
                      <Button
                        className="mt-5"
                        onClick={() => setIsDialogOpen(true)}
                      >
                        <PenIcon className="mr-2 h-4 w-4" /> Update Profile
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* ✅ Popup Modal for Editing Profile */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label>Email</Label>
              <Input
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Username</Label>
              <Input
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Phone Number</Label>
              <Input
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button onClick={() => setIsDialogOpen(false)} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
