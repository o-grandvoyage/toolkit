import { UTMGenerator } from "@/components/utm-generator"
import { OnboardingWrapper } from "@/components/onboarding-wrapper"
import { OnboardingLink } from "@/components/onboarding-link"

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl tracking-tighter sm:text-4xl font-inter">generador estándar de UTMs</h1>
            <p className="text-gray-500 md:text-xl/relaxed max-w-3xl mx-auto">
              Crea UTMs estandarizados para todos los departamentos, eliminando errores y asegurando consistencia en el
              seguimiento.
            </p>
            <OnboardingLink />
          </div>
          <OnboardingWrapper>
            <UTMGenerator />
          </OnboardingWrapper>
        </div>
      </div>
    </main>
  )
}
