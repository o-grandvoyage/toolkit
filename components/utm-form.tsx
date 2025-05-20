"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { AlertCircle, HelpCircle, Plus, AlertTriangle, CheckCircle2 } from "lucide-react"
import {
  toSnakeCase,
  type UTMData,
  validateUTMData,
  UTM_SOURCES,
  UTM_MEDIUMS,
  UTM_CHANNELS,
  UTM_MEDIUMS_BY_SOURCE,
  COUNTRIES,
  LANGUAGES,
  type CustomOption,
} from "@/lib/utm-utils"

const RESPONSIBLES = [
  "Arvin",
  "Carlos",
  "Kenya",
  "Cristian",
  "Oriol",
]

// Esquema de validación
const formSchema = z.object({
  baseUrl: z.string().url({ message: "Debe ser una URL válida" }),
  channel: z.string().min(1, { message: "El canal es obligatorio" }),
  source: z.string().min(1, { message: "La fuente es obligatoria" }),
  medium: z.string().min(1, { message: "El medio es obligatorio" }),
  campaign: z.string().min(1, { message: "El nombre de campaña es obligatorio" }),
  content: z.string().optional(),
  term: z.string().optional(),
  trackingId: z.string().optional(),
  newsletterSlug: z.string().optional(),
  country: z.string().optional(),
  language: z.string().optional(),
  notes: z.string().optional(),
  advanced: z.boolean().default(false),
  responsable: z.string().min(1, { message: "El responsable es obligatorio" }),
})

type FormValues = z.infer<typeof formSchema>

interface UTMFormProps {
  onUTMGenerated: (utmData: UTMData) => void
  customOptions: {
    sources: CustomOption[]
    mediums: CustomOption[]
    channels: CustomOption[]
  }
  onAddCustomOption: (type: "sources" | "mediums" | "channels", option: CustomOption) => void
}

export function UTMForm({ onUTMGenerated, customOptions, onAddCustomOption }: UTMFormProps) {
  const [warning, setWarning] = useState<string | null>(null)
  const [availableMediums, setAvailableMediums] = useState<{ value: string; label: string; description?: string }[]>([])
  const [showTerm, setShowTerm] = useState(false)
  const [showNewsletterSlug, setShowNewsletterSlug] = useState(false)
  const [newCustomOption, setNewCustomOption] = useState({ value: "", label: "", description: "" })
  const [customOptionType, setCustomOptionType] = useState<"sources" | "mediums" | "channels">("sources")
  const [isCustomDialogOpen, setIsCustomDialogOpen] = useState(false)
  const [campaignSuggestion, setCampaignSuggestion] = useState("")
  const [formMode, setFormMode] = useState<"basic" | "advanced">("basic")
  const [customResponsible, setCustomResponsible] = useState("")
  const [responsibles, setResponsibles] = useState(RESPONSIBLES)

  const [fieldErrors, setFieldErrors] = useState<Record<string, string | null>>({
    baseUrl: null,
    campaign: null,
    content: null,
    term: null,
    newsletterSlug: null,
    trackingId: null,
  })

  const [fieldValid, setFieldValid] = useState<Record<string, boolean>>({
    baseUrl: false,
    campaign: false,
    content: false,
    term: false,
    newsletterSlug: false,
    trackingId: false,
  })

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      baseUrl: "https://example.com",
      channel: "",
      source: "",
      medium: "",
      campaign: "",
      content: "",
      term: "",
      trackingId: "",
      newsletterSlug: "",
      country: "",
      language: "",
      notes: "",
      advanced: false,
      responsable: "",
    },
  })

  // Actualizar medios disponibles cuando cambia la fuente
  useEffect(() => {
    const source = form.watch("source")
    if (source && UTM_MEDIUMS_BY_SOURCE[source]) {
      setAvailableMediums(UTM_MEDIUMS_BY_SOURCE[source])
      form.setValue("medium", "") // Reset medium when source changes
    } else {
      // Si no hay medios predefinidos para esta fuente, mostrar todos los medios genéricos
      setAvailableMediums([...UTM_MEDIUMS, ...customOptions.mediums])
    }
  }, [form.watch("source"), customOptions.mediums, form])

  // Mostrar/ocultar campos específicos según la selección
  useEffect(() => {
    const medium = form.watch("medium")
    const source = form.watch("source")

    setShowTerm(medium === "cpc" || medium === "ppc")
    setShowNewsletterSlug(source === "newsletter" || source.includes("email"))
  }, [form.watch("medium"), form.watch("source")])

  // Generar sugerencia de nombre de campaña
  useEffect(() => {
    const country = form.watch("country")
    const language = form.watch("language")
    const channel = form.watch("channel")
    const source = form.watch("source")

    if (country && language && channel && source) {
      const countryCode = country.toLowerCase()
      const langCode = language.toLowerCase()
      const channelName = channel.toLowerCase()
      const sourceName = source.toLowerCase()

      const date = new Date()
      const month = date.toLocaleString("default", { month: "short" }).toLowerCase()
      const year = date.getFullYear()

      setCampaignSuggestion(`${channelName}_${sourceName}_${countryCode}_${langCode}_${month}${year}`)
    }
  }, [form.watch("country"), form.watch("language"), form.watch("channel"), form.watch("source")])

  const validateBaseUrl = (value: string) => {
    if (!value) return null
    try {
      new URL(value)
      setFieldValid((prev) => ({ ...prev, baseUrl: true }))
      return null
    } catch (e) {
      setFieldValid((prev) => ({ ...prev, baseUrl: false }))
      return "La URL no es válida. Debe incluir http:// o https://"
    }
  }

  const validateCampaign = (value: string) => {
    if (!value) return null

    if (!/^[a-z0-9_]+$/.test(value)) {
      setFieldValid((prev) => ({ ...prev, campaign: false }))
      return "Usa solo minúsculas, números y guiones bajos (snake_case)"
    }

    if (value.includes("campana") || value.includes("campaign")) {
      setFieldValid((prev) => ({ ...prev, campaign: false }))
      return "Evita nombres genéricos como 'campana' o 'campaign'"
    }

    if (value.length < 5) {
      setFieldValid((prev) => ({ ...prev, campaign: false }))
      return "El nombre es demasiado corto, usa al menos 5 caracteres"
    }

    setFieldValid((prev) => ({ ...prev, campaign: true }))
    return null
  }

  const validateSnakeCase = (value: string, field: string) => {
    if (!value) return null

    if (!/^[a-z0-9_]+$/.test(value)) {
      setFieldValid((prev) => ({ ...prev, [field]: false }))
      return "Usa solo minúsculas, números y guiones bajos (snake_case)"
    }

    setFieldValid((prev) => ({ ...prev, [field]: true }))
    return null
  }

  // Validar y generar UTM
  const onSubmit = (data: FormValues) => {
    // Convertir a snake_case
    const campaign = toSnakeCase(data.campaign)
    const content = data.content ? toSnakeCase(data.content) : undefined
    const term = data.term ? toSnakeCase(data.term) : undefined
    const trackingId = data.trackingId ? data.trackingId : undefined
    const newsletterSlug = data.newsletterSlug ? toSnakeCase(data.newsletterSlug) : undefined

    // Verificar si la campaña es demasiado genérica
    if (campaign.includes("campana") || campaign.includes("campaign")) {
      setWarning("La campaña parece ser demasiado genérica. Considera usar un nombre más específico.")
    } else {
      setWarning(null)
    }

    // Construir objeto UTM
    const utmData: UTMData = {
      baseUrl: data.baseUrl,
      params: {
        utm_channel: data.channel,
        utm_source: data.source,
        utm_medium: data.medium,
        utm_campaign: campaign,
      },
      metadata: {
        category: data.medium === "cpc" || data.medium === "ppc" ? "paid" : "organic",
        team: data.source === "newsletter" ? "CRM" : "Marketing",
        tags: [data.source, data.medium, data.channel],
        created_at: new Date().toISOString(),
      },
    }

    // Añadir parámetros opcionales si existen
    if (content) utmData.params.utm_content = content
    if (term) utmData.params.utm_term = term
    if (trackingId) utmData.params.trackingid = trackingId
    if (newsletterSlug) utmData.params.newsletter_slug = newsletterSlug
    if (data.country) utmData.metadata.country = data.country
    if (data.language) utmData.metadata.language = data.language
    if (data.notes) utmData.metadata.notes = data.notes

    // Validar datos UTM
    const validationResult = validateUTMData(utmData)
    if (validationResult.valid) {
      onUTMGenerated(utmData)
    } else {
      setWarning(validationResult.message)
    }
  }

  const handleAddCustomOption = () => {
    if (!newCustomOption.value || !newCustomOption.label) {
      alert("El valor y la etiqueta son obligatorios")
      return
    }

    // Convertir a snake_case y validar
    const value = toSnakeCase(newCustomOption.value)

    // Verificar si ya existe
    const existsInDefault =
      (customOptionType === "sources" && UTM_SOURCES.some((s) => s.value === value)) ||
      (customOptionType === "mediums" && UTM_MEDIUMS.some((m) => m.value === value)) ||
      (customOptionType === "channels" && UTM_CHANNELS.some((c) => c.value === value))

    const existsInCustom = customOptions[customOptionType].some((o) => o.value === value)

    if (existsInDefault || existsInCustom) {
      alert(
        `Este valor ya existe en las opciones ${
          customOptionType === "sources" ? "de fuentes" : customOptionType === "mediums" ? "de medios" : "de canales"
        }`,
      )
      return
    }

    // Añadir la nueva opción
    onAddCustomOption(customOptionType, {
      value,
      label: newCustomOption.label,
      description: newCustomOption.description || "",
    })

    // Limpiar el formulario
    setNewCustomOption({ value: "", label: "", description: "" })
    setIsCustomDialogOpen(false)
  }

  const useCampaignSuggestion = () => {
    form.setValue("campaign", campaignSuggestion)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Configuración de UTM</h2>
            <div className="flex items-center space-x-2">
              <span className={`text-sm ${formMode === "basic" ? "font-medium" : "text-gray-500"}`}>Básico</span>
              <button
                type="button"
                onClick={() => setFormMode(formMode === "basic" ? "advanced" : "basic")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                  formMode === "advanced" ? "bg-primary" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 rounded-full bg-white shadow-lg transform transition-transform ${
                    formMode === "advanced" ? "translate-x-6" : "translate-x-1"
                  }`}
                />
                <span className="sr-only">
                  {formMode === "basic" ? "Activar modo avanzado" : "Activar modo básico"}
                </span>
              </button>
              <span className={`text-sm ${formMode === "advanced" ? "font-medium" : "text-gray-500"}`}>Avanzado</span>
            </div>
          </div>

          <FormField
            control={form.control}
            name="responsable"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Creador/Responsable <span className="text-red-500">*</span></FormLabel>
                <div className="flex gap-2">
                  <Select
                    value={field.value || ""}
                    onValueChange={(value) => {
                      field.onChange(value)
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un responsable" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {responsibles.map((name) => (
                        <SelectItem key={name} value={name}>{name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newName = prompt("Introduce un nuevo nombre de responsable:")?.trim()
                      if (newName && !responsibles.includes(newName)) {
                        setResponsibles([...responsibles, newName])
                        form.setValue("responsable", newName, { shouldValidate: true })
                      }
                    }}
                  >
                    Añadir
                  </Button>
                </div>
                <FormDescription>Selecciona o crea un responsable.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="baseUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  URL Base <span className="text-red-500">*</span>
                </FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      placeholder="https://example.com"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        const error = validateBaseUrl(e.target.value)
                        setFieldErrors((prev) => ({ ...prev, baseUrl: error }))
                      }}
                    />
                  </FormControl>
                  {fieldValid.baseUrl && (
                    <div className="absolute right-10 top-1/2 -translate-y-1/2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    </div>
                  )}
                  {fieldErrors.baseUrl && (
                    <div className="absolute right-10 top-1/2 -translate-y-1/2">
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                    </div>
                  )}
                </div>
                <FormDescription>
                  La URL de destino sin parámetros UTM (ej: https://tuempresa.com/landing-page)
                </FormDescription>
                {fieldErrors.baseUrl && (
                  <div className="text-amber-600 text-sm mt-1 bg-amber-50 p-2 rounded border border-amber-200">
                    {fieldErrors.baseUrl}
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="channel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Canal (utm_channel) <span className="text-red-500">*</span>
                  </FormLabel>
                  <div className="flex">
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecciona un canal" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <div className="flex justify-between items-center px-3 py-2">
                          <span className="text-sm font-medium">Canales</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              setCustomOptionType("channels")
                              setIsCustomDialogOpen(true)
                            }}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Nuevo
                          </Button>
                        </div>
                        <Separator className="my-1" />
                        {UTM_CHANNELS.map((channel) => (
                          <SelectItem key={channel.value} value={channel.value}>
                            {channel.label}
                            {channel.description && (
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button variant="ghost" size="sm" className="ml-1 h-4 w-4 p-0">
                                    <HelpCircle className="h-3 w-3" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent side="right" className="w-80">
                                  <p className="text-sm">{channel.description}</p>
                                </PopoverContent>
                              </Popover>
                            )}
                          </SelectItem>
                        ))}
                        {customOptions.channels.length > 0 && (
                          <>
                            <Separator className="my-1" />
                            <div className="px-3 py-2 text-xs text-gray-500">Canales personalizados</div>
                            {customOptions.channels.map((channel) => (
                              <SelectItem key={channel.value} value={channel.value}>
                                {channel.label}
                                {channel.description && (
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button variant="ghost" size="sm" className="ml-1 h-4 w-4 p-0">
                                        <HelpCircle className="h-3 w-3" />
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent side="right" className="w-80">
                                      <p className="text-sm">{channel.description}</p>
                                    </PopoverContent>
                                  </Popover>
                                )}
                              </SelectItem>
                            ))}
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <FormDescription>Canal macro de marketing (ej: search, social, email)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Fuente (utm_source) <span className="text-red-500">*</span>
                  </FormLabel>
                  <div className="flex">
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecciona una fuente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <div className="flex justify-between items-center px-3 py-2">
                          <span className="text-sm font-medium">Fuentes</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              setCustomOptionType("sources")
                              setIsCustomDialogOpen(true)
                            }}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Nueva
                          </Button>
                        </div>
                        <Separator className="my-1" />
                        {UTM_SOURCES.map((source) => (
                          <SelectItem key={source.value} value={source.value}>
                            {source.label}
                            {source.description && (
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button variant="ghost" size="sm" className="ml-1 h-4 w-4 p-0">
                                    <HelpCircle className="h-3 w-3" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent side="right" className="w-80">
                                  <p className="text-sm">{source.description}</p>
                                </PopoverContent>
                              </Popover>
                            )}
                          </SelectItem>
                        ))}
                        {customOptions.sources.length > 0 && (
                          <>
                            <Separator className="my-1" />
                            <div className="px-3 py-2 text-xs text-gray-500">Fuentes personalizadas</div>
                            {customOptions.sources.map((source) => (
                              <SelectItem key={source.value} value={source.value}>
                                {source.label}
                                {source.description && (
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button variant="ghost" size="sm" className="ml-1 h-4 w-4 p-0">
                                        <HelpCircle className="h-3 w-3" />
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent side="right" className="w-80">
                                      <p className="text-sm">{source.description}</p>
                                    </PopoverContent>
                                  </Popover>
                                )}
                              </SelectItem>
                            ))}
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <FormDescription>Plataforma específica que origina el tráfico (ej: google, facebook)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="medium"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Medio (utm_medium) <span className="text-red-500">*</span>
                  </FormLabel>
                  <div className="flex">
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={availableMediums.length === 0}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecciona un medio" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <div className="flex justify-between items-center px-3 py-2">
                          <span className="text-sm font-medium">Medios</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              setCustomOptionType("mediums")
                              setIsCustomDialogOpen(true)
                            }}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Nuevo
                          </Button>
                        </div>
                        <Separator className="my-1" />
                        {availableMediums.map((medium) => (
                          <SelectItem key={medium.value} value={medium.value}>
                            {medium.label}
                            {medium.description && (
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button variant="ghost" size="sm" className="ml-1 h-4 w-4 p-0">
                                    <HelpCircle className="h-3 w-3" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent side="right" className="w-80">
                                  <p className="text-sm">{medium.description}</p>
                                </PopoverContent>
                              </Popover>
                            )}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <FormDescription>Tipo de tráfico dentro del canal (ej: cpc, organic, email)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="campaign"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Nombre de Campaña (utm_campaign) <span className="text-red-500">*</span>
                </FormLabel>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <FormControl>
                      <Input
                        placeholder="verano_2025"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value.toLowerCase().replace(/\s+/g, "_")
                          field.onChange(value)
                          form.setValue("campaign", value)
                          const error = validateCampaign(value)
                          setFieldErrors((prev) => ({ ...prev, campaign: error }))
                        }}
                      />
                    </FormControl>
                    {fieldValid.campaign && (
                      <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      </div>
                    )}
                    {fieldErrors.campaign && (
                      <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                      </div>
                    )}
                  </div>
                  {campaignSuggestion && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={useCampaignSuggestion}
                      className="whitespace-nowrap"
                    >
                      Usar sugerencia
                    </Button>
                  )}
                </div>
                <FormDescription>
                  {campaignSuggestion ? (
                    <>
                      Sugerencia: <code className="bg-gray-100 px-1 py-0.5 rounded">{campaignSuggestion}</code>
                    </>
                  ) : (
                    "Formato recomendado: tipo_producto_objetivo_fecha (ej: honeymoon_seo_2025)"
                  )}
                </FormDescription>
                {fieldErrors.campaign && (
                  <div className="text-amber-600 text-sm mt-1 bg-amber-50 p-2 rounded border border-amber-200">
                    {fieldErrors.campaign}
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contenido (utm_content)</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      placeholder="banner_lateral"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value.toLowerCase().replace(/\s+/g, "_")
                        field.onChange(value)
                        form.setValue("content", value)
                        const error = validateSnakeCase(value, "content")
                        setFieldErrors((prev) => ({ ...prev, content: error }))
                      }}
                    />
                  </FormControl>
                  {fieldErrors.content && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                    </div>
                  )}
                  {field.value && fieldValid.content && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    </div>
                  )}
                </div>
                <FormDescription>
                  Identifica qué elemento específico fue clicado (ej: banner_01, video_testimonial)
                </FormDescription>
                {fieldErrors.content && (
                  <div className="text-amber-600 text-sm mt-1 bg-amber-50 p-2 rounded border border-amber-200">
                    {fieldErrors.content}
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          {showTerm && (
            <FormField
              control={form.control}
              name="term"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Palabra Clave (utm_term)</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        placeholder="viaje_a_japon"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value.toLowerCase().replace(/\s+/g, "_")
                          field.onChange(value)
                          form.setValue("term", value)
                          const error = validateSnakeCase(value, "term")
                          setFieldErrors((prev) => ({ ...prev, term: error }))
                        }}
                      />
                    </FormControl>
                    {fieldErrors.term && (
                      <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                      </div>
                    )}
                    {field.value && fieldValid.term && (
                      <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      </div>
                    )}
                  </div>
                  <FormDescription>
                    Palabra clave utilizada en campañas SEM. En Google Ads puedes usar {"{keyword}"} para inserción
                    dinámica.
                  </FormDescription>
                  {fieldErrors.term && (
                    <div className="text-amber-600 text-sm mt-1 bg-amber-50 p-2 rounded border border-amber-200">
                      {fieldErrors.term}
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {showNewsletterSlug && (
            <FormField
              control={form.control}
              name="newsletterSlug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug de Newsletter (newsletter_slug)</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        placeholder="newsletter_mayo_2025"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value.toLowerCase().replace(/\s+/g, "_")
                          field.onChange(value)
                          form.setValue("newsletterSlug", value)
                          const error = validateSnakeCase(value, "newsletterSlug")
                          setFieldErrors((prev) => ({ ...prev, newsletterSlug: error }))
                        }}
                      />
                    </FormControl>
                    {fieldErrors.newsletterSlug && (
                      <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                      </div>
                    )}
                    {field.value && fieldValid.newsletterSlug && (
                      <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      </div>
                    )}
                  </div>
                  <FormDescription>
                    Identificador único para newsletters (ej: nl_febrero2025_viaje_romantico)
                  </FormDescription>
                  {fieldErrors.newsletterSlug && (
                    <div className="text-amber-600 text-sm mt-1 bg-amber-50 p-2 rounded border border-amber-200">
                      {fieldErrors.newsletterSlug}
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {formMode === "advanced" && (
            <>
              <Separator className="my-4" />
              <h2 className="text-lg font-semibold mb-4">Parámetros avanzados</h2>

              <FormField
                control={form.control}
                name="trackingId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID de seguimiento (trackingid)</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          placeholder="GV2025_CAMPAÑA123"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e)
                            setFieldValid((prev) => ({ ...prev, trackingId: e.target.value.length > 0 }))
                          }}
                        />
                      </FormControl>
                      {field.value && fieldValid.trackingId && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        </div>
                      )}
                      {fieldErrors.trackingId && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                          <AlertTriangle className="h-5 w-5 text-amber-500" />
                        </div>
                      )}
                    </div>
                    <FormDescription>
                      ID interno para vincular con campañas en sistemas de BI o automatización
                    </FormDescription>
                    {fieldErrors.trackingId && (
                      <div className="text-amber-600 text-sm mt-1 bg-amber-50 p-2 rounded border border-amber-200">
                        {fieldErrors.trackingId}
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>País</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un país" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-[300px]">
                          {COUNTRIES.map((country) => (
                            <SelectItem key={country.value} value={country.value}>
                              {country.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>País objetivo de la campaña</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Idioma</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un idioma" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {LANGUAGES.map((language) => (
                            <SelectItem key={language.value} value={language.value}>
                              {language.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>Idioma de la campaña</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notas internas</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Notas sobre esta campaña (solo para uso interno)" {...field} />
                    </FormControl>
                    <FormDescription>
                      Estas notas se guardarán con el UTM pero no se incluirán en la URL
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {warning && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{warning}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full">
            Generar UTM
          </Button>
        </div>

        {/* Diálogos para añadir opciones personalizadas */}
        <Dialog
          open={isCustomDialogOpen && customOptionType === "channels"}
          onOpenChange={(open) => setIsCustomDialogOpen(open)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Añadir nuevo canal</DialogTitle>
              <DialogDescription>Crea un nuevo canal personalizado para tus UTMs.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="custom-value">Valor (snake_case)</Label>
                <Input
                  id="custom-value"
                  value={newCustomOption.value}
                  onChange={(e) => setNewCustomOption({ ...newCustomOption, value: e.target.value })}
                  placeholder="mi_nuevo_canal"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="custom-label">Etiqueta (nombre visible)</Label>
                <Input
                  id="custom-label"
                  value={newCustomOption.label}
                  onChange={(e) => setNewCustomOption({ ...newCustomOption, label: e.target.value })}
                  placeholder="Mi Nuevo Canal"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="custom-description">Descripción (opcional)</Label>
                <Textarea
                  id="custom-description"
                  value={newCustomOption.description}
                  onChange={(e) => setNewCustomOption({ ...newCustomOption, description: e.target.value })}
                  placeholder="Descripción de este canal"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCustomDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddCustomOption}>Añadir canal</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={isCustomDialogOpen && customOptionType === "sources"}
          onOpenChange={(open) => setIsCustomDialogOpen(open)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Añadir nueva fuente</DialogTitle>
              <DialogDescription>Crea una nueva fuente personalizada para tus UTMs.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="custom-value">Valor (snake_case)</Label>
                <Input
                  id="custom-value"
                  value={newCustomOption.value}
                  onChange={(e) => setNewCustomOption({ ...newCustomOption, value: e.target.value })}
                  placeholder="mi_nueva_fuente"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="custom-label">Etiqueta (nombre visible)</Label>
                <Input
                  id="custom-label"
                  value={newCustomOption.label}
                  onChange={(e) => setNewCustomOption({ ...newCustomOption, label: e.target.value })}
                  placeholder="Mi Nueva Fuente"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="custom-description">Descripción (opcional)</Label>
                <Textarea
                  id="custom-description"
                  value={newCustomOption.description}
                  onChange={(e) => setNewCustomOption({ ...newCustomOption, description: e.target.value })}
                  placeholder="Descripción de esta fuente"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCustomDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddCustomOption}>Añadir fuente</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={isCustomDialogOpen && customOptionType === "mediums"}
          onOpenChange={(open) => setIsCustomDialogOpen(open)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Añadir nuevo medio</DialogTitle>
              <DialogDescription>Crea un nuevo medio personalizado para tus UTMs.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="custom-value">Valor (snake_case)</Label>
                <Input
                  id="custom-value"
                  value={newCustomOption.value}
                  onChange={(e) => setNewCustomOption({ ...newCustomOption, value: e.target.value })}
                  placeholder="mi_nuevo_medio"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="custom-label">Etiqueta (nombre visible)</Label>
                <Input
                  id="custom-label"
                  value={newCustomOption.label}
                  onChange={(e) => setNewCustomOption({ ...newCustomOption, label: e.target.value })}
                  placeholder="Mi Nuevo Medio"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="custom-description">Descripción (opcional)</Label>
                <Textarea
                  id="custom-description"
                  value={newCustomOption.description}
                  onChange={(e) => setNewCustomOption({ ...newCustomOption, description: e.target.value })}
                  placeholder="Descripción de este medio"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCustomDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddCustomOption}>Añadir medio</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </form>
    </Form>
  )
}
