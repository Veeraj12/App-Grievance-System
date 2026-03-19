import type { Metadata } from "next";
import { Cormorant_Garamond, Lora } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import Providers from "./providers";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smart Grievance System",
  description: "A fast, secure, and modern grievance redressal platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cormorant.variable} ${lora.variable} antialiased`}
      >
        <Providers>
        <AuthProvider>
          {children}
        </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
