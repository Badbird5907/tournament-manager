"use client";

import { login, logout } from "@/app/auth/actions";
import { useSession } from "@/components/hooks/user";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import Link from "next/link";
import { useMemo } from "react";


export default function Navbar({ admin }: { admin?: boolean }) {
  const session = useSession();
  const items = useMemo(() => {
    const items = [
      {
        label: "Home",
        href: "/",
      },
    ]
    if (session) {
      items.push({
        label: "My Tournaments",
        href: "/tournaments",
      })
    }
    return items;
  }, [session])
  return (
    <nav className="border-b-2 border-gray-200 dark:border-gray-800 border-dashed sticky top-0 z-50 backdrop-blur-md bg-background/80">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link href="/">
              <p className="text-2xl font-bold">Tournament Manager</p>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-md font-medium"
              >
                {item.label}
              </Link>
            ))}
            {session ? (
              <Button onClick={logout}>
                Sign Out
              </Button>
            ) : (
              <Button onClick={login}>
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile menu */}
          <div className="flex items-center space-x-4 sm:hidden">
            <Drawer>
              <DrawerTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                >
                  <span className="sr-only">Open main menu</span>
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Tournament Manager</DrawerTitle>
                </DrawerHeader>
                <div className="flex flex-col space-y-4 p-4">
                  {items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-lg font-medium hover:text-indigo-600"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>
    </nav>
  );
}