import type { Metadata } from "next";
import Link from "next/link";

import { Geist, Geist_Mono } from "next/font/google";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

import "./globals.css";

/* ----------  Fonts  ---------- */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/* ----------  <head> metadata  ---------- */
export const metadata: Metadata = {
  title: "Music-Chat Playground",
  description: "Create melodies with AI and synth-them instantly.",
};

/* ----------  Root layout shell  ---------- */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {/* --- Global nav bar --- */}
        <nav className="border-b">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/dashboard/history">History</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        {/* --- Page content --- */}
        {children}
      </body>
    </html>
  );
}
