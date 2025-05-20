"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  // Detectar scroll para añadir sombra a la navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 bg-black z-50 transition-all duration-300 ${scrolled ? "shadow-md" : ""}`}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-center md:justify-start">
        <Link href="/" className="flex items-center">
          <img
            src="/images/logo-white.svg"
            alt="GrandVoyage Logo"
            className="h-8 md:h-10 w-auto"
            style={{ filter: "brightness(0) invert(1)" }} // Asegura que el SVG sea blanco
          />
        </Link>
      </div>
    </header>
  )
}
