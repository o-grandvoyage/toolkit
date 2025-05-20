import type React from "react"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"
import { Inter } from "next/font/google"
import Image from "next/image"
import { Navbar } from "@/components/navbar"

// Configurar Inter para toda la aplicación
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata = {
  title: "Generador de UTMs",
  description: "Crea UTMs estandarizados para todos los departamentos",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={inter.className}>
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </head>
      <body className="font-inter">
        <Navbar />
        <div className="flex flex-col min-h-screen pt-20">
          {/* Ajustamos el padding-top a 20 (h-20) para compensar la altura de la navbar */}
          <div className="flex-grow">{children}</div>
          <footer className="pt-2 pb-4 text-center text-sm text-black">
            MKTG <span className="font-bold">TOOLKIT</span> made with ♥ by: {" "}
            <span className="inline-block align-middle">
              <Image src="/images/logo-black.svg" alt="Logo" width={120} height={36} />
            </span>
          </footer>
        </div>
        <Toaster />
      </body>
    </html>
  )
}
