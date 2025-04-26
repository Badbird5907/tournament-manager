import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import type { Subject } from "@badbird5907/auth-commons";
import Navbar from "@/components/navbar";
import { api, HydrateClient } from "@/trpc/server";
export default async function Layout({ children, params }: { children: React.ReactNode, params: Promise<{ id: string }> }) {
  const head = await headers();
  const h = head.get("__auth");
  const subject = h ? JSON.parse(h) as Subject : null;
  if (!subject) {
    redirect("/login");
  }

  const id = (await params).id;
  await api.tournaments.getById.prefetch({ id });

  return (
    <HydrateClient>
      <SidebarProvider>
        <AppSidebar id={id} />
        <main className="bg-background min-h-screen w-full">
          <Navbar admin={true} />
          <div className="w-full h-full">
            {children}
          </div>
        </main>
      </SidebarProvider>
    </HydrateClient>
  )
}
