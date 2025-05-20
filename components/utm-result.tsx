"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Check, Copy, Download, Share2, ExternalLink } from "lucide-react"
import { type UTMData, buildUTMUrl } from "@/lib/utm-utils"
import { toast } from "@/components/ui/use-toast"

interface UTMResultProps {
  utmData: UTMData
}

export function UTMResult({ utmData }: UTMResultProps) {
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("url")
  const utmUrl = buildUTMUrl(utmData)

  const handleCopy = () => {
    navigator.clipboard.writeText(utmUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    // Crear encabezados para el CSV
    const headers = [
      "URL Base",
      ...Object.keys(utmData.params).map((k) => k),
      "Categoría",
      "Equipo",
      "Etiquetas",
      "País",
      "Idioma",
      "Fecha de creación",
    ]

    // Crear valores
    const values = [
      utmData.baseUrl,
      ...Object.values(utmData.params).map((v) => v),
      utmData.metadata.category,
      utmData.metadata.team,
      utmData.metadata.tags.join(";"),
      utmData.metadata.country || "",
      utmData.metadata.language || "",
      new Date(utmData.metadata.created_at).toLocaleString(),
    ]

    // Crear contenido CSV
    const csvContent = [headers.join(","), values.join(",")].join("\n")

    // Crear y descargar el archivo
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `utm_${utmData.params.utm_campaign}_${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleShare = async () => {
    // Verificar si la API de compartir está disponible y si estamos en un contexto seguro
    if (navigator.share && window.isSecureContext) {
      try {
        await navigator.share({
          title: `UTM para ${utmData.params.utm_campaign}`,
          text: `URL con parámetros UTM para la campaña ${utmData.params.utm_campaign}`,
          url: utmUrl,
        })
      } catch (error) {
        // Si el usuario cancela la acción o hay otro error, usar el fallback
        if (error instanceof Error && error.name !== "AbortError") {
          console.log("Usando método alternativo para compartir")
          handleCopy()
          toast({
            title: "URL copiada al portapapeles",
            description: "La URL ha sido copiada. Puedes pegarla donde necesites.",
          })
        }
      }
    } else {
      // Fallback si Web Share API no está disponible
      handleCopy()
      toast({
        title: "URL copiada al portapapeles",
        description: "La URL ha sido copiada. Puedes pegarla donde necesites.",
      })
    }
  }

  const handleOpenUrl = () => {
    window.open(utmUrl, "_blank")
  }

  return (
    <Card className="border-green-200 bg-green-50">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span>URL con UTM generada</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
              {copied ? "Copiado" : "Copiar"}
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-1" />
              Compartir
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-1" />
              CSV
            </Button>
            <Button variant="outline" size="sm" onClick={handleOpenUrl}>
              <ExternalLink className="h-4 w-4 mr-1" />
              Abrir
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="url">URL</TabsTrigger>
            <TabsTrigger value="params">Parámetros</TabsTrigger>
            <TabsTrigger value="metadata">Metadatos</TabsTrigger>
          </TabsList>
          <TabsContent value="url" className="space-y-4">
            <div className="p-3 bg-white rounded-md overflow-x-auto border">
              <code className="text-sm whitespace-pre-wrap break-all">{utmUrl}</code>
            </div>
            <div className="text-sm text-gray-500">
              <p>Esta URL incluye todos los parámetros UTM necesarios para el seguimiento correcto de la campaña.</p>
              <p>Copia esta URL y úsala en tus campañas de marketing.</p>
            </div>
          </TabsContent>
          <TabsContent value="params" className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {Object.entries(utmData.params).map(([key, value]) => (
                <div key={key} className="flex flex-col p-3 bg-white rounded-md border">
                  <span className="text-xs text-gray-500 font-medium">{key}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="metadata" className="space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-white rounded-md border">
                  <h3 className="text-sm font-medium mb-2">Categoría</h3>
                  <Badge variant="outline">{utmData.metadata.category}</Badge>
                </div>
                <div className="p-3 bg-white rounded-md border">
                  <h3 className="text-sm font-medium mb-2">Equipo Responsable</h3>
                  <Badge variant="outline">{utmData.metadata.team}</Badge>
                </div>
              </div>

              <div className="p-3 bg-white rounded-md border">
                <h3 className="text-sm font-medium mb-2">Etiquetas</h3>
                <div className="flex flex-wrap gap-2">
                  {utmData.metadata.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {utmData.metadata.country && (
                  <div className="p-3 bg-white rounded-md border">
                    <h3 className="text-sm font-medium mb-2">País</h3>
                    <Badge variant="outline">{utmData.metadata.country}</Badge>
                  </div>
                )}
                {utmData.metadata.language && (
                  <div className="p-3 bg-white rounded-md border">
                    <h3 className="text-sm font-medium mb-2">Idioma</h3>
                    <Badge variant="outline">{utmData.metadata.language}</Badge>
                  </div>
                )}
              </div>

              <div className="p-3 bg-white rounded-md border">
                <h3 className="text-sm font-medium mb-2">Fecha de creación</h3>
                <span className="text-sm">{new Date(utmData.metadata.created_at).toLocaleString()}</span>
              </div>

              {utmData.metadata.notes && (
                <div className="p-3 bg-white rounded-md border">
                  <h3 className="text-sm font-medium mb-2">Notas</h3>
                  <p className="text-sm whitespace-pre-wrap">{utmData.metadata.notes}</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
