import type { Metadata } from "next";
import { Raleway, Geist_Mono } from "next/font/google";
import { DepthProvider } from "@/lib/depth-context";
import "./globals.css";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Inside Your Dynamic Model | INSIGHT2PROFIT",
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
      className={`${raleway.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <DepthProvider>{children}</DepthProvider>
      </body>
    </html>
  );
}
