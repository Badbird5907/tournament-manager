import { redirect } from "next/navigation";
import { headers } from "next/headers";
import type { Subject } from "@badbird5907/auth-commons";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const head = await headers();
  const h = head.get("__auth");
  const subject = h ? JSON.parse(h) as Subject : null;
  if (!subject) {
    redirect("/login");
  }

  return (
    <>{ children }</>
  )
}
