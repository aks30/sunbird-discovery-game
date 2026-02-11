import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sunbird: Unlock Your Potential",
  description: "A gamified experience to learn about Sunbird's building blocks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} antialiased font-sans bg-sunbird-beige text-sunbird-brown`}
      >
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
