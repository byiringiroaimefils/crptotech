"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type SidebarContextType = {
  open: boolean
  setOpen: (v: boolean) => void
  toggle: () => void
}

const AdminSidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function AdminSidebarProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const toggle = () => setOpen((v) => !v)
  return (
    <AdminSidebarContext.Provider value={{ open, setOpen, toggle }}>
      {children}
    </AdminSidebarContext.Provider>
  )
}

export function useAdminSidebar() {
  const ctx = useContext(AdminSidebarContext)
  if (!ctx) throw new Error("useAdminSidebar must be used within AdminSidebarProvider")
  return ctx
}
