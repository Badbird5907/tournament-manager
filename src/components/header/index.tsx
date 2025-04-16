import { MainNav } from "@/components/header/main";
import { MobileNav } from "@/components/header/mobile";
import { Home } from "lucide-react";

type AppNav = {
  title: string;
  link: string;
  checkExact?: boolean;
  className?: string | ((isActive?: boolean) => string);
  icon?: React.ElementType;
}[];
export const nav: AppNav = [
  {
    title: "Home",
    link: "/",
    checkExact: true,
    icon: Home,
  }
];
export async function SiteHeader({ admin }: { admin?: boolean; }) {
  return (
    <header className="px-4 sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-[100vw] items-center">
        <MainNav admin={admin} />
        <MobileNav admin={admin} />
      </div>
    </header>
  );
}