import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import { ThemeProvider } from "next-themes";
import { SubjectProvider } from "@/components/hooks/user";
import { headers } from "next/headers";
import type { Subject } from "@badbird5907/auth-commons";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Tournament Manager",
  description: "Tournament Manager",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const head = await headers();
  const h = head.get("__auth");
  const subject = h ? JSON.parse(h) as Subject : null;
  return (
    <html lang="en" className={`${geist.variable}`} suppressHydrationWarning>
      <body>
        <TRPCReactProvider>
          <ThemeProvider forcedTheme="dark" attribute={"class"}>
            <SubjectProvider value={subject}>
              <main className="min-h-screen">
                {children}
                <Toaster />
              </main>
            </SubjectProvider>
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
