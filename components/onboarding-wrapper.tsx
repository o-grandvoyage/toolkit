"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Onboarding } from "@/components/onboarding"

interface OnboardingWrapperProps {
  children: React.ReactNode
}

export function OnboardingWrapper({ children }: OnboardingWrapperProps) {
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    // Verificar si es la primera visita
    const hasSeenOnboarding = localStorage.getItem("utm_onboarding_seen")

    if (!hasSeenOnboarding) {
      // Pequeño retraso para mostrar el onboarding
      const timer = setTimeout(() => {
        setShowOnboarding(true)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [])

  return (
    <>
      {children}
      <Onboarding open={showOnboarding} onOpenChange={setShowOnboarding} />
    </>
  )
}
