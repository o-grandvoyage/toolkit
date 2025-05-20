"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription } from "@/components/ui/dialog"
import { Link, BarChart3, Target, CheckCircle2, ChevronLeft, ChevronRight, Rocket } from "lucide-react"
import { Fireworks } from "@/components/fireworks"
import Image from "next/image"

interface OnboardingProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function Onboarding({ open, onOpenChange }: OnboardingProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false)
  const [showFireworks, setShowFireworks] = useState(false)

  useEffect(() => {
    const onboardingSeen = localStorage.getItem("utm_onboarding_seen")
    if (onboardingSeen) {
      setHasSeenOnboarding(true)
    }
  }, [])

  // Reiniciar a la primera pàgina quan es torna a obrir
  useEffect(() => {
    if (open) {
      setCurrentSlide(0)
    }
  }, [open])

  // Mostrar fuegos artificiales cuando se muestra el primer slide
  useEffect(() => {
    if (currentSlide === 0 && open) {
      setShowFireworks(true)
      const timer = setTimeout(() => {
        setShowFireworks(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [currentSlide, open])

  const handleFinish = () => {
    localStorage.setItem("utm_onboarding_seen", "true")
    setHasSeenOnboarding(true)
    onOpenChange(false)
  }

  const slides = [
    {
      title: (
        <>
          Bienvenida a la MKTG TOOLKIT de UTM's Estandarizadas de{" "}
          <div className="flex justify-center mt-2">
            <Image src="/images/logo-black.svg" alt="Logo" width={220} height={66} />
          </div>
          <div className="text-sm text-gray-500 mt-2">MKTG TOOLKIT made with ♥ by</div>
        </>
      ),
      description:
        "Descubre cómo crear y gestionar UTMs de forma profesional para mejorar el seguimiento de tus campañas de marketing.",
      icon: <Rocket className="h-12 w-12 text-[#ffd800] mb-4" />,
      showFireworks: true,
    },
    {
      title: "¿Qué son los UTMs?",
      description:
        "Los UTMs son parámetros que se añaden a las URLs para rastrear el origen del tráfico web y medir la efectividad de tus campañas.",
      icon: <Link className="h-12 w-12 text-[#ffd800] mb-4" />,
    },
    {
      title: "Crea UTMs en segundos",
      description:
        "Completa el formulario con los datos de tu campaña y genera URLs con parámetros UTM estandarizados automáticamente.",
      icon: <Target className="h-12 w-12 text-[#ffd800] mb-4" />,
    },
    {
      title: "Analiza y gestiona tus UTMs",
      description:
        "Accede al historial de UTMs generados, exporta los datos a CSV y comparte fácilmente las URLs con tu equipo.",
      icon: <BarChart3 className="h-12 w-12 text-[#ffd800] mb-4" />,
    },
    {
      title: "¡Listo para empezar!",
      description:
        "Ahora puedes crear UTMs estandarizados para todas tus campañas y mejorar el análisis de tus esfuerzos de marketing.",
      icon: <CheckCircle2 className="h-12 w-12 text-[#ffd800] mb-4" />,
    },
  ]

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    } else {
      handleFinish()
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  // Si ya ha visto el onboarding, no lo mostramos
  if (hasSeenOnboarding && !open) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden font-inter" showCloseButton={true}>
        <DialogDescription className="sr-only">Tutorial de uso del generador de UTMs</DialogDescription>

        <div className="relative h-[450px] overflow-hidden">
          {showFireworks && <Fireworks />}

          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center p-6"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="mb-2"
              >
                {slides[currentSlide].icon}
              </motion.div>

              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="text-2xl font-bold mb-4"
              >
                {slides[currentSlide].title}
              </motion.h2>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="text-gray-600 mb-8 max-w-sm"
              >
                {slides[currentSlide].description}
              </motion.p>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="flex items-center justify-center gap-2 mt-4"
              >
                {Array.from({ length: slides.length }).map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-2 rounded-full transition-all duration-300 ${
                      index === currentSlide ? "bg-[#007aff] w-6" : "bg-gray-300"
                    }`}
                  />
                ))}
              </motion.div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-6 left-0 right-0 flex justify-between px-6">
            <Button
              variant="outline"
              size="sm"
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className={currentSlide === 0 ? "opacity-0" : "opacity-100"}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
            </Button>

            <Button size="sm" onClick={nextSlide}>
              {currentSlide === slides.length - 1 ? (
                "Comenzar"
              ) : (
                <>
                  Siguiente <ChevronRight className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
