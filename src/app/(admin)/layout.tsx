import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/header"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="bg-background min-h-screen w-full">
        <SiteHeader admin={true} />
        <div className="p-4">
          {children}
        </div>
      </main>
    </SidebarProvider>
  )
}
