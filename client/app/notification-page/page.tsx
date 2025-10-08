import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"
import { AdminSidebarProvider } from "@/components/admin-sidebar-context"



export default function page() {
  return (
    <AdminSidebarProvider>
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />

        <div className="ml-0 md:ml-64 flex-1">
          <AdminHeader />

            <main className="p-6">
                <h2>Notification page</h2>
            </main>
        </div>
      </div>
    </AdminSidebarProvider>
  )
}
