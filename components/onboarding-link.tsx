"use client"

import { useState } from "react"
import { Onboarding } from "@/components/onboarding"

export function OnboardingLink() {
  const [showOnboarding, setShowOnboarding] = useState(false)

  const handleShowOnboarding = () => {
    // Mostrar el onboarding
    setShowOnboarding(true)
  }

  return (
    <>
      <p className="text-sm mt-2 flex justify-center">
        <button
          onClick={handleShowOnboarding}
          className="text-[#007aff] underline hover:text-[#0056b3] focus:outline-none flex items-center"
        >
          <span className="mr-1">👉</span> Ver tutorial de uso
        </button>
      </p>
      <Onboarding open={showOnboarding} onOpenChange={setShowOnboarding} />
    </>
  )
}
