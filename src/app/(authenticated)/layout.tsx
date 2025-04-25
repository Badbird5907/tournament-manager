import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import type { Subject } from "@badbird5907/auth-commons";
import Navbar from "@/components/navbar";
import { ContentSizeProvider } from "@/components/hooks/content-size";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const head = await headers();
  const h = head.get("__auth");
  const subject = h ? JSON.parse(h) as Subject : null;
  if (!subject) {
    redirect("/login");
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="bg-background min-h-screen w-full">
        <Navbar admin={true} />
        <div className="w-full h-full">
          {children}
        </div>
      </main>
    </SidebarProvider>
  )
}
