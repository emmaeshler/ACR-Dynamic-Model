import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { DepthProvider } from "@/lib/depth-context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "How the Model Works",
  description:
    "An interactive walkthrough of INSIGHT2PROFIT's ML pricing model — explore at your own depth.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <DepthProvider>{children}</DepthProvider>
      </body>
    </html>
  );
}
