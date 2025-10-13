"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, Check } from "lucide-react"

import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"
import { AdminSidebarProvider } from "@/components/admin-sidebar-context"
import NotificationCard from "@/components/notification/NotificationCard"
import NotificationFilter from "@/components/notification/NotificationFilter"

type Notification = {
    id: string;
    title: string;
    message: string;
    timestamp: string;
    type: "message" | "deadline" | "achievement";
    isRead: boolean;
};

export default function page() {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [filter, setFilter] = useState<"all" | "unread" | Notification["type"]>("all")
    const [isLoading, setIsLoading] = useState(true)

    // Simulate data fetch
    useEffect(() => {
        const id = setTimeout(() => {
            setNotifications([
                {
                    id: "1",
                    title: "Assignment Graded",
                    message: "Your 'Advanced React' submission scored 95%!",
                    timestamp: "2 hours ago",
                    type: "achievement",
                    isRead: false,
                },
                {
                    id: "2",
                    title: "New Message",
                    message: "Instructor commented on your discussion post",
                    timestamp: "1 day ago",
                    type: "message",
                    isRead: true,
                },
                {
                    id: "3",
                    title: "Deadline Approaching",
                    message: "'Final Project' due in 3 days",
                    timestamp: "2 days ago",
                    type: "deadline",
                    isRead: false,
                },
                {
                    id: "4",
                    title: "Badge Earned",
                    message: "You earned the 'Consistent Learner' badge!",
                    timestamp: "3 days ago",
                    type: "achievement",
                    isRead: false,
                },
            ])
            setIsLoading(false)
        }, 700)

        return () => clearTimeout(id)
    }, [])


    const filteredNotifications = notifications.filter((n) => {
        if (filter === "all") return true
        if (filter === "unread") return !n.isRead
        return n.type === filter
    })

    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    }

    const dismissNotification = (id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id))
    }
  return (
    <AdminSidebarProvider>
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />
        <div className="ml-0 md:ml-64 flex-1">
          <AdminHeader />
                    <main className="min-h-screen p-4 md:p-8">
                        <div className="max-w-4xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"
                            >

                                <div className="flex items-center gap-2">
                                    <NotificationFilter onFilterChange={setFilter} />
                                    {/* <button
                                        onClick={markAllAsRead}
                                        className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm"
                                        aria-label="Mark all as read"
                                    >
                                        <Check /> Mark all as read
                                    </button> */}
                                </div>
                            </motion.div>

                            <AnimatePresence>
                                {isLoading ? (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 text-center">
                                        Loading...
                                    </motion.div>
                                ) : filteredNotifications.length === 0 ? (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-xl p-8 text-center">
                                        <p>No notifications found</p>
                                    </motion.div>
                                ) : (
                                    filteredNotifications.map((notification) => (
                                        <NotificationCard key={notification.id} {...notification} onDismiss={dismissNotification} />
                                    ))
                                )}
                            </AnimatePresence>
                        </div>
                    </main>
        </div>
      </div>
    </AdminSidebarProvider>
  )
}
