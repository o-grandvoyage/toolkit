"use client"

import { useState, useEffect } from "react"
import { UTMForm } from "@/components/utm-form"
import { UTMResult } from "@/components/utm-result"
import { UTMHistory } from "@/components/utm-history"
import { UTMGuide } from "@/components/utm-guide"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"
import type { UTMData, CustomOption } from "@/lib/utm-utils"

export function UTMGenerator() {
  const [generatedUTM, setGeneratedUTM] = useState<UTMData | null>(null)
  const [history, setHistory] = useState<UTMData[]>([])
  const [customOptions, setCustomOptions] = useState<{
    sources: CustomOption[]
    mediums: CustomOption[]
    channels: CustomOption[]
  }>({
    sources: [],
    mediums: [],
    channels: [],
  })

  // Cargar historial y opciones personalizadas del localStorage al iniciar
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem("utm_history")
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory))
      }

      const savedCustomOptions = localStorage.getItem("utm_custom_options")
      if (savedCustomOptions) {
        setCustomOptions(JSON.parse(savedCustomOptions))
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error)
    }
  }, [])

  // Guardar historial en localStorage cuando cambie
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem("utm_history", JSON.stringify(history))
    }
  }, [history])

  // Guardar opciones personalizadas en localStorage cuando cambien
  useEffect(() => {
    if (customOptions.sources.length > 0 || customOptions.mediums.length > 0 || customOptions.channels.length > 0) {
      localStorage.setItem("utm_custom_options", JSON.stringify(customOptions))
    }
  }, [customOptions])

  const handleUTMGenerated = (utmData: UTMData) => {
    setGeneratedUTM(utmData)
    setHistory((prev) => [utmData, ...prev.slice(0, 49)]) // Mantener los últimos 50 items
  }

  const handleAddCustomOption = (type: "sources" | "mediums" | "channels", option: CustomOption) => {
    setCustomOptions((prev) => ({
      ...prev,
      [type]: [...prev[type], option],
    }))
  }

  const clearHistory = () => {
    if (confirm("¿Estás seguro de que deseas borrar todo el historial de UTMs?")) {
      setHistory([])
      localStorage.removeItem("utm_history")
    }
  }

  return (
    <div className="space-y-6">
      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Estandarización de UTMs</AlertTitle>
        <AlertDescription>
          Este generador sigue las mejores prácticas para crear UTMs consistentes y agrupables. Todos los parámetros se
          convierten automáticamente a snake_case y se validan para evitar errores.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="generator" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generator">Generador</TabsTrigger>
          <TabsTrigger value="history">Historial ({history.length})</TabsTrigger>
          <TabsTrigger value="guide">Guía de UTMs</TabsTrigger>
        </TabsList>
        <TabsContent value="generator" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <UTMForm
                onUTMGenerated={handleUTMGenerated}
                customOptions={customOptions}
                onAddCustomOption={handleAddCustomOption}
              />
            </CardContent>
          </Card>
          {generatedUTM && <UTMResult utmData={generatedUTM} />}
        </TabsContent>
        <TabsContent value="history">
          <UTMHistory history={history} onSelect={setGeneratedUTM} onClearHistory={clearHistory} />
        </TabsContent>
        <TabsContent value="guide">
          <UTMGuide />
        </TabsContent>
      </Tabs>
    </div>
  )
}
