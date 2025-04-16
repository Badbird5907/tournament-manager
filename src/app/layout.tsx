import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: "Tournament Manager",
  description: "Tournament Manager",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`} suppressHydrationWarning>
      <body>
        <TRPCReactProvider>
          <ThemeProvider forcedTheme="dark" attribute={"class"}>
            <main className="min-h-screen">
              {children}
            </main>
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
