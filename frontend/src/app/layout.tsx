// @/app/layout.tsx
import { Providers } from "./providers";
import { Geist, Geist_Mono, Roboto_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Metadata } from "next";
import { ToastHandler } from "@/components/common/ToastHandler";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
});

const entoto = localFont({
  src: "../../public/fonts/entoto.ttf",
  variable: "--font-entoto",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bms.jirehgrp.com"),
  title: "JirehDashboard",
  description:
    "A comprehensive and intuitive dashboard designed to manage your business operations. JirehDashboard empowers owners, employees, and managers to oversee, track orders, manage expenses, and optimize inventory across multiple branches. With role-based access and real-time analytics, it offers a seamless user experience for efficient decision-making and growth.",
  openGraph: {
    title: "JirehDashboard",
    description:
      "A modern dashboard to manage your business operations with efficiency. Track subscriptions, orders, inventory, and expenses.",
    url: "/",
    siteName: "JirehDashboard",
    images: [
      {
        url: "/images/previewImage.png",
        width: 1200,
        height: 630,
        alt: "JirehDashboard Preview Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JirehDashboard",
    description:
      "A modern dashboard for your business operations, with features for tracking and managing your subscriptions, orders, and expenses.",
    images: ["/images/previewImage.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('jireh-theme') === 'dark' || 
                    (!localStorage.getItem('jireh-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${robotoMono.variable} ${entoto.variable} font-mono antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          <div className="min-h-screen bg-background transition-colors duration-300">
            {children}
            <ToastHandler />
          </div>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}