import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import { getSession } from "../lib/auth";
import jwt from "jsonwebtoken";
import { useAuthStore } from "@/lib/store/authStore";
import ClientAuthWrapper from "./components/ClientAuthWrapper";
import Notification from "./components/Notification";
import ClientOnly from "./components/ClientOnly";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Indie Share",
  description: "Get your music heard.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Header />
        <ClientAuthWrapper>{children}</ClientAuthWrapper>
        <ClientOnly>
          <Notification />
        </ClientOnly>
      </body>
    </html>
  );
}
// function cookies() {
//   throw new Error("Function not implemented.");
// }
