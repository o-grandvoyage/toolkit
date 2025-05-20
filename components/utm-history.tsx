"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { type UTMData, buildUTMUrl } from "@/lib/utm-utils"
import { ArrowUpRight, Copy, Download, Search, Trash2, Check } from "lucide-react"

interface UTMHistoryProps {
  history: UTMData[]
  onSelect: (utmData: UTMData) => void
  onClearHistory: () => void
}

export function UTMHistory({ history, onSelect, onClearHistory }: UTMHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  // Filtrar por búsqueda
  const filteredHistory = history.filter((utm) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      utm.params.utm_campaign.toLowerCase().includes(searchLower) ||
      utm.params.utm_source.toLowerCase().includes(searchLower) ||
      utm.params.utm_medium.toLowerCase().includes(searchLower) ||
      utm.params.utm_channel.toLowerCase().includes(searchLower) ||
      (utm.metadata.country && utm.metadata.country.toLowerCase().includes(searchLower)) ||
      (utm.metadata.language && utm.metadata.language.toLowerCase().includes(searchLower))
    )
  })

  // Filtrar por categoría
  const filteredByCategory =
    activeTab === "all" ? filteredHistory : filteredHistory.filter((utm) => utm.metadata.category === activeTab)

  // Agrupar por fecha (hoy, ayer, esta semana, este mes, anteriores)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const yesterday = today - 86400000
  const thisWeekStart = today - now.getDay() * 86400000
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime()

  const groupedHistory = {
    today: [] as UTMData[],
    yesterday: [] as UTMData[],
    thisWeek: [] as UTMData[],
    thisMonth: [] as UTMData[],
    older: [] as UTMData[],
  }

  filteredByCategory.forEach((utm) => {
    const createdAt = new Date(utm.metadata.created_at).getTime()

    if (createdAt >= today) {
      groupedHistory.today.push(utm)
    } else if (createdAt >= yesterday) {
      groupedHistory.yesterday.push(utm)
    } else if (createdAt >= thisWeekStart) {
      groupedHistory.thisWeek.push(utm)
    } else if (createdAt >= thisMonthStart) {
      groupedHistory.thisMonth.push(utm)
    } else {
      groupedHistory.older.push(utm)
    }
  })

  // Exportar todo el historial a CSV
  const handleExportAll = () => {
    if (history.length === 0) return

    // Crear encabezados para el CSV
    const headers = [
      "URL Base",
      "utm_channel",
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
      "trackingid",
      "newsletter_slug",
      "Categoría",
      "Equipo",
      "Etiquetas",
      "País",
      "Idioma",
      "Fecha de creación",
    ]

    // Crear filas para cada UTM
    const rows = history.map((utm) => {
      return [
        utm.baseUrl,
        utm.params.utm_channel || "",
        utm.params.utm_source || "",
        utm.params.utm_medium || "",
        utm.params.utm_campaign || "",
        utm.params.utm_content || "",
        utm.params.utm_term || "",
        utm.params.trackingid || "",
        utm.params.newsletter_slug || "",
        utm.metadata.category || "",
        utm.metadata.team || "",
        utm.metadata.tags.join(";") || "",
        utm.metadata.country || "",
        utm.metadata.language || "",
        utm.metadata.created_at || "",
      ].join(",")
    })

    // Crear contenido CSV
    const csvContent = [headers.join(","), ...rows].join("\n")

    // Crear y descargar el archivo
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `utm_history_${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (history.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-gray-500">
            <p>No hay UTMs generados en el historial.</p>
            <p className="text-sm mt-2">Los UTMs generados aparecerán aquí para referencia futura.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Historial de UTMs generados</CardTitle>
            <CardDescription>{history.length} UTMs generados en total</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExportAll}>
              <Download className="h-4 w-4 mr-1" />
              Exportar todo
            </Button>
            <Button variant="outline" size="sm" onClick={onClearHistory}>
              <Trash2 className="h-4 w-4 mr-1" />
              Limpiar
            </Button>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Buscar UTMs..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
            <TabsList>
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="paid">Pagados</TabsTrigger>
              <TabsTrigger value="organic">Orgánicos</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {groupedHistory.today.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-3">Hoy</h3>
              <div className="space-y-3">
                {groupedHistory.today.map((utm, index) => (
                  <UTMHistoryItem key={`today-${index}`} utm={utm} onSelect={onSelect} />
                ))}
              </div>
            </div>
          )}

          {groupedHistory.yesterday.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-3">Ayer</h3>
              <div className="space-y-3">
                {groupedHistory.yesterday.map((utm, index) => (
                  <UTMHistoryItem key={`yesterday-${index}`} utm={utm} onSelect={onSelect} />
                ))}
              </div>
            </div>
          )}

          {groupedHistory.thisWeek.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-3">Esta semana</h3>
              <div className="space-y-3">
                {groupedHistory.thisWeek.map((utm, index) => (
                  <UTMHistoryItem key={`thisWeek-${index}`} utm={utm} onSelect={onSelect} />
                ))}
              </div>
            </div>
          )}

          {groupedHistory.thisMonth.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-3">Este mes</h3>
              <div className="space-y-3">
                {groupedHistory.thisMonth.map((utm, index) => (
                  <UTMHistoryItem key={`thisMonth-${index}`} utm={utm} onSelect={onSelect} />
                ))}
              </div>
            </div>
          )}

          {groupedHistory.older.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-3">Anteriores</h3>
              <div className="space-y-3">
                {groupedHistory.older.map((utm, index) => (
                  <UTMHistoryItem key={`older-${index}`} utm={utm} onSelect={onSelect} />
                ))}
              </div>
            </div>
          )}

          {filteredByCategory.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No se encontraron UTMs que coincidan con tu búsqueda.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface UTMHistoryItemProps {
  utm: UTMData
  onSelect: (utmData: UTMData) => void
}

function UTMHistoryItem({ utm, onSelect }: UTMHistoryItemProps) {
  const [copied, setCopied] = useState(false)
  const url = buildUTMUrl(utm)

  const handleCopy = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <div className="font-medium truncate max-w-[70%]">{utm.params.utm_campaign}</div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={handleCopy}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onSelect(utm)}>
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="text-xs text-gray-500 truncate mb-2">{url}</div>
      <div className="flex flex-wrap gap-2 mt-2">
        <Badge variant="outline">{utm.params.utm_channel}</Badge>
        <Badge variant="outline">{utm.params.utm_source}</Badge>
        <Badge variant="outline">{utm.params.utm_medium}</Badge>
        {utm.metadata.category && <Badge variant="secondary">{utm.metadata.category}</Badge>}
        {utm.metadata.country && (
          <Badge variant="secondary" className="bg-blue-100">
            {utm.metadata.country}
          </Badge>
        )}
      </div>
    </div>
  )
}
