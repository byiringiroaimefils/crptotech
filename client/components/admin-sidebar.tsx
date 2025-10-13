"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, ShoppingCart, Package, Store } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Orders", href: "/orders", icon: ShoppingCart },
  { name: "Stock", href: "/stock", icon: Package },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { open, toggle, setOpen } = require("./admin-sidebar-context").useAdminSidebar()

  const SidebarContent = (
    <div className="flex h-full flex-col">
      <div className="px-4 h-16 border-b border-sidebar-border">
        <Link href="/" className="flex items-center gap-3 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground">C</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold leading-4">CrptoTech</span>
            <span className="text-xs text-sidebar-foreground/70">Admin panel</span>
          </div>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center justify-between rounded-lg bg-sidebar-accent px-3 py-2">
          <span className="text-xs text-sidebar-foreground">Trial ends in 12 days</span>
          <Link href="#" className="text-xs font-medium text-sidebar-primary hover:underline">
            Upgrade
          </Link>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:fixed md:left-0 md:top-0 md:z-40 md:h-screen md:w-64 md:border-r md:border-sidebar-border md:bg-sidebar md:block">
        {SidebarContent}
      </aside>

      {/* Mobile overlay drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-64 border-r border-sidebar-border bg-sidebar">{SidebarContent}</div>
          <div className="flex-1 bg-black/40" onClick={() => setOpen(false)} />
        </div>
      )}
    </>
  )
}
