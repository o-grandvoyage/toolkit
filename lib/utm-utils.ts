export interface CustomOption {
  value: string
  label: string
  description?: string
}

export interface UTMData {
  baseUrl: string
  params: {
    utm_channel: string
    utm_source: string
    utm_medium: string
    utm_campaign: string
    utm_content?: string
    utm_term?: string
    trackingid?: string
    newsletter_slug?: string
    [key: string]: string
  }
  metadata: {
    category: string
    team: string
    tags: string[]
    country?: string
    language?: string
    notes?: string
    created_at: string
    [key: string]: string | string[]
  }
}

// Definición de los canales disponibles
export const UTM_CHANNELS: CustomOption[] = [
  {
    value: "search",
    label: "Search",
    description: "Tráfico proveniente de motores de búsqueda, tanto orgánico como pagado.",
  },
  {
    value: "social",
    label: "Social",
    description: "Tráfico proveniente de redes sociales, tanto orgánico como pagado.",
  },
  {
    value: "email",
    label: "Email",
    description: "Tráfico proveniente de campañas de email marketing y newsletters.",
  },
  {
    value: "display",
    label: "Display",
    description: "Tráfico proveniente de anuncios gráficos en sitios web.",
  },
  {
    value: "referral",
    label: "Referral",
    description: "Tráfico proveniente de enlaces en otros sitios web.",
  },
  {
    value: "affiliates",
    label: "Affiliates",
    description: "Tráfico proveniente de programas de afiliados.",
  },
  {
    value: "direct",
    label: "Direct",
    description: "Tráfico directo, cuando el usuario escribe la URL directamente.",
  },
  {
    value: "video",
    label: "Video",
    description: "Tráfico proveniente de plataformas de video como YouTube.",
  },
  {
    value: "audio",
    label: "Audio",
    description: "Tráfico proveniente de plataformas de audio como podcasts o Spotify.",
  },
  {
    value: "print",
    label: "Print",
    description: "Tráfico proveniente de medios impresos como revistas o periódicos.",
  },
  {
    value: "offline",
    label: "Offline",
    description: "Tráfico proveniente de medios offline como TV, radio o eventos.",
  },
]

// Definición de las fuentes disponibles
export const UTM_SOURCES: CustomOption[] = [
  {
    value: "google",
    label: "Google",
    description: "Tráfico proveniente de Google (búsqueda, display, YouTube, etc.)",
  },
  {
    value: "facebook",
    label: "Facebook",
    description: "Tráfico proveniente de Facebook",
  },
  {
    value: "instagram",
    label: "Instagram",
    description: "Tráfico proveniente de Instagram",
  },
  {
    value: "tiktok",
    label: "TikTok",
    description: "Tráfico proveniente de TikTok",
  },
  {
    value: "linkedin",
    label: "LinkedIn",
    description: "Tráfico proveniente de LinkedIn",
  },
  {
    value: "twitter",
    label: "Twitter/X",
    description: "Tráfico proveniente de Twitter/X",
  },
  {
    value: "pinterest",
    label: "Pinterest",
    description: "Tráfico proveniente de Pinterest",
  },
  {
    value: "youtube",
    label: "YouTube",
    description: "Tráfico proveniente de YouTube",
  },
  {
    value: "bing",
    label: "Bing",
    description: "Tráfico proveniente de Bing",
  },
  {
    value: "newsletter",
    label: "Newsletter",
    description: "Tráfico proveniente de newsletters",
  },
  {
    value: "blog",
    label: "Blog",
    description: "Tráfico proveniente de blogs",
  },
  {
    value: "partner",
    label: "Partner",
    description: "Tráfico proveniente de socios o partners",
  },
  {
    value: "affiliate",
    label: "Affiliate",
    description: "Tráfico proveniente de afiliados",
  },
  {
    value: "direct",
    label: "Direct",
    description: "Tráfico directo",
  },
  {
    value: "referral",
    label: "Referral",
    description: "Tráfico proveniente de referencias",
  },
  {
    value: "display",
    label: "Display",
    description: "Tráfico proveniente de anuncios display",
  },
  {
    value: "email",
    label: "Email",
    description: "Tráfico proveniente de emails",
  },
  {
    value: "sms",
    label: "SMS",
    description: "Tráfico proveniente de SMS",
  },
  {
    value: "push",
    label: "Push",
    description: "Tráfico proveniente de notificaciones push",
  },
  {
    value: "print",
    label: "Print",
    description: "Tráfico proveniente de medios impresos",
  },
  {
    value: "tv",
    label: "TV",
    description: "Tráfico proveniente de televisión",
  },
  {
    value: "radio",
    label: "Radio",
    description: "Tráfico proveniente de radio",
  },
  {
    value: "event",
    label: "Event",
    description: "Tráfico proveniente de eventos",
  },
  {
    value: "qr",
    label: "QR",
    description: "Tráfico proveniente de códigos QR",
  },
]

// Definición de los medios disponibles
export const UTM_MEDIUMS: CustomOption[] = [
  {
    value: "cpc",
    label: "CPC",
    description: "Coste por clic, para campañas de pago por clic",
  },
  {
    value: "ppc",
    label: "PPC",
    description: "Pago por clic, similar a CPC",
  },
  {
    value: "organic",
    label: "Organic",
    description: "Tráfico orgánico, no pagado",
  },
  {
    value: "social",
    label: "Social",
    description: "Tráfico orgánico de redes sociales",
  },
  {
    value: "email",
    label: "Email",
    description: "Tráfico de campañas de email",
  },
  {
    value: "referral",
    label: "Referral",
    description: "Tráfico de referencias o recomendaciones",
  },
  {
    value: "display",
    label: "Display",
    description: "Anuncios gráficos en sitios web",
  },
  {
    value: "banner",
    label: "Banner",
    description: "Anuncios tipo banner",
  },
  {
    value: "retargeting",
    label: "Retargeting",
    description: "Campañas de remarketing o retargeting",
  },
  {
    value: "affiliate",
    label: "Affiliate",
    description: "Tráfico de programas de afiliados",
  },
  {
    value: "video",
    label: "Video",
    description: "Anuncios en formato video",
  },
  {
    value: "native",
    label: "Native",
    description: "Publicidad nativa que se integra con el contenido",
  },
  {
    value: "influencer",
    label: "Influencer",
    description: "Campañas con influencers",
  },
  {
    value: "sms",
    label: "SMS",
    description: "Campañas por SMS",
  },
  {
    value: "push",
    label: "Push",
    description: "Notificaciones push",
  },
  {
    value: "qr",
    label: "QR",
    description: "Códigos QR",
  },
  {
    value: "print",
    label: "Print",
    description: "Medios impresos",
  },
  {
    value: "tv",
    label: "TV",
    description: "Televisión",
  },
  {
    value: "radio",
    label: "Radio",
    description: "Radio",
  },
  {
    value: "direct",
    label: "Direct",
    description: "Tráfico directo",
  },
]

// Medios por fuente
export const UTM_MEDIUMS_BY_SOURCE: Record<string, CustomOption[]> = {
  google: [
    { value: "cpc", label: "CPC (Pago por clic)", description: "Anuncios de pago por clic en Google Ads" },
    { value: "organic", label: "Organic (Orgánico)", description: "Resultados orgánicos de búsqueda en Google" },
    { value: "display", label: "Display", description: "Anuncios gráficos en la red de display de Google" },
    { value: "video", label: "Video", description: "Anuncios de video en YouTube" },
    { value: "shopping", label: "Shopping", description: "Anuncios de productos en Google Shopping" },
    { value: "discovery", label: "Discovery", description: "Anuncios en Google Discover" },
  ],
  facebook: [
    { value: "cpc", label: "CPC (Pago por clic)", description: "Anuncios de pago por clic en Facebook Ads" },
    { value: "social", label: "Social (Orgánico)", description: "Publicaciones orgánicas en Facebook" },
    { value: "display", label: "Display", description: "Anuncios gráficos en Facebook" },
    { value: "video", label: "Video", description: "Anuncios de video en Facebook" },
    { value: "carousel", label: "Carousel", description: "Anuncios de carrusel en Facebook" },
    { value: "lead", label: "Lead", description: "Anuncios de generación de leads en Facebook" },
  ],
  instagram: [
    { value: "cpc", label: "CPC (Pago por clic)", description: "Anuncios de pago por clic en Instagram" },
    { value: "social", label: "Social (Orgánico)", description: "Publicaciones orgánicas en Instagram" },
    { value: "display", label: "Display", description: "Anuncios gráficos en Instagram" },
    { value: "video", label: "Video", description: "Anuncios de video en Instagram" },
    { value: "story", label: "Story", description: "Anuncios en Stories de Instagram" },
    { value: "reel", label: "Reel", description: "Anuncios en Reels de Instagram" },
  ],
  tiktok: [
    { value: "cpc", label: "CPC (Pago por clic)", description: "Anuncios de pago por clic en TikTok" },
    { value: "social", label: "Social (Orgánico)", description: "Contenido orgánico en TikTok" },
    { value: "video", label: "Video", description: "Anuncios de video en TikTok" },
    { value: "spark", label: "Spark Ads", description: "Spark Ads en TikTok" },
  ],
  linkedin: [
    { value: "cpc", label: "CPC (Pago por clic)", description: "Anuncios de pago por clic en LinkedIn" },
    { value: "social", label: "Social (Orgánico)", description: "Publicaciones orgánicas en LinkedIn" },
    { value: "inmail", label: "InMail", description: "Mensajes InMail patrocinados en LinkedIn" },
    { value: "lead", label: "Lead Gen", description: "Anuncios de generación de leads en LinkedIn" },
  ],
  twitter: [
    { value: "cpc", label: "CPC (Pago por clic)", description: "Anuncios de pago por clic en Twitter" },
    { value: "social", label: "Social (Orgánico)", description: "Tweets orgánicos" },
    { value: "follower", label: "Follower", description: "Campañas de seguidores en Twitter" },
  ],
  newsletter: [
    { value: "email", label: "Email", description: "Campañas de email marketing" },
    { value: "newsletter", label: "Newsletter", description: "Boletines informativos" },
  ],
  blog: [
    { value: "content", label: "Content", description: "Contenido del blog" },
    { value: "organic", label: "Organic", description: "Tráfico orgánico del blog" },
  ],
  youtube: [
    { value: "video", label: "Video", description: "Videos en YouTube" },
    { value: "organic", label: "Organic", description: "Contenido orgánico en YouTube" },
    { value: "cpc", label: "CPC", description: "Anuncios de pago en YouTube" },
  ],
  direct: [
    { value: "none", label: "None", description: "Sin medio específico" },
    { value: "direct", label: "Direct", description: "Tráfico directo" },
  ],
  referral: [{ value: "referral", label: "Referral", description: "Tráfico de referencia" }],
  partner: [
    { value: "partner", label: "Partner", description: "Tráfico de socios" },
    { value: "affiliate", label: "Affiliate", description: "Tráfico de afiliados" },
  ],
  email: [
    { value: "email", label: "Email", description: "Campañas de email marketing" },
    { value: "newsletter", label: "Newsletter", description: "Boletines informativos" },
    { value: "promotion", label: "Promotion", description: "Emails promocionales" },
    { value: "transactional", label: "Transactional", description: "Emails transaccionales" },
  ],
  sms: [
    { value: "sms", label: "SMS", description: "Mensajes SMS" },
    { value: "promotion", label: "Promotion", description: "SMS promocionales" },
  ],
  print: [
    { value: "print", label: "Print", description: "Medios impresos" },
    { value: "magazine", label: "Magazine", description: "Revistas" },
    { value: "newspaper", label: "Newspaper", description: "Periódicos" },
    { value: "brochure", label: "Brochure", description: "Folletos" },
  ],
  tv: [
    { value: "tv", label: "TV", description: "Televisión" },
    { value: "commercial", label: "Commercial", description: "Anuncios comerciales" },
  ],
  radio: [
    { value: "radio", label: "Radio", description: "Radio" },
    { value: "commercial", label: "Commercial", description: "Anuncios comerciales" },
  ],
  event: [
    { value: "event", label: "Event", description: "Eventos" },
    { value: "conference", label: "Conference", description: "Conferencias" },
    { value: "tradeshow", label: "Tradeshow", description: "Ferias comerciales" },
  ],
  qr: [{ value: "qr", label: "QR", description: "Códigos QR" }],
}

// Lista de países
export const COUNTRIES = [
  { value: "es", label: "España" },
  { value: "mx", label: "México" },
  { value: "co", label: "Colombia" },
  { value: "ar", label: "Argentina" },
  { value: "cl", label: "Chile" },
  { value: "pe", label: "Perú" },
  { value: "us", label: "Estados Unidos" },
  { value: "ca", label: "Canadá" },
  { value: "br", label: "Brasil" },
  { value: "pt", label: "Portugal" },
  { value: "fr", label: "Francia" },
  { value: "it", label: "Italia" },
  { value: "de", label: "Alemania" },
  { value: "uk", label: "Reino Unido" },
  { value: "jp", label: "Japón" },
  { value: "cn", label: "China" },
  { value: "au", label: "Australia" },
  { value: "nz", label: "Nueva Zelanda" },
  { value: "za", label: "Sudáfrica" },
  { value: "in", label: "India" },
  { value: "ru", label: "Rusia" },
  { value: "ae", label: "Emiratos Árabes Unidos" },
  { value: "sa", label: "Arabia Saudita" },
  { value: "eg", label: "Egipto" },
  { value: "ng", label: "Nigeria" },
  { value: "ke", label: "Kenia" },
  { value: "ma", label: "Marruecos" },
  { value: "th", label: "Tailandia" },
  { value: "sg", label: "Singapur" },
  { value: "my", label: "Malasia" },
  { value: "id", label: "Indonesia" },
  { value: "ph", label: "Filipinas" },
  { value: "vn", label: "Vietnam" },
  { value: "kr", label: "Corea del Sur" },
  { value: "tr", label: "Turquía" },
  { value: "il", label: "Israel" },
  { value: "se", label: "Suecia" },
  { value: "no", label: "Noruega" },
  { value: "dk", label: "Dinamarca" },
  { value: "fi", label: "Finlandia" },
  { value: "nl", label: "Países Bajos" },
  { value: "be", label: "Bélgica" },
  { value: "ch", label: "Suiza" },
  { value: "at", label: "Austria" },
  { value: "gr", label: "Grecia" },
  { value: "pl", label: "Polonia" },
  { value: "cz", label: "República Checa" },
  { value: "hu", label: "Hungría" },
  { value: "ro", label: "Rumanía" },
  { value: "bg", label: "Bulgaria" },
]

// Lista de idiomas
export const LANGUAGES = [
  { value: "es", label: "Español" },
  { value: "en", label: "Inglés" },
  { value: "fr", label: "Francés" },
  { value: "de", label: "Alemán" },
  { value: "it", label: "Italiano" },
  { value: "pt", label: "Portugués" },
  { value: "ru", label: "Ruso" },
  { value: "zh", label: "Chino" },
  { value: "ja", label: "Japonés" },
  { value: "ko", label: "Coreano" },
  { value: "ar", label: "Árabe" },
  { value: "hi", label: "Hindi" },
  { value: "bn", label: "Bengalí" },
  { value: "nl", label: "Neerlandés" },
  { value: "sv", label: "Sueco" },
  { value: "no", label: "Noruego" },
  { value: "da", label: "Danés" },
  { value: "fi", label: "Finés" },
  { value: "pl", label: "Polaco" },
  { value: "tr", label: "Turco" },
  { value: "he", label: "Hebreo" },
  { value: "th", label: "Tailandés" },
  { value: "vi", label: "Vietnamita" },
  { value: "id", label: "Indonesio" },
  { value: "ms", label: "Malayo" },
  { value: "tl", label: "Tagalo" },
]

/**
 * Convierte un texto a formato snake_case
 */
export function toSnakeCase(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD") // Normaliza caracteres acentuados
    .replace(/[\u0300-\u036f]/g, "") // Elimina diacríticos
    .replace(/[^\w\s-]/g, "") // Elimina caracteres especiales
    .replace(/\s+/g, "_") // Reemplaza espacios con guiones bajos
    .replace(/-+/g, "_") // Reemplaza guiones con guiones bajos
}

/**
 * Construye una URL con parámetros UTM
 */
export function buildUTMUrl(utmData: UTMData): string {
  const url = new URL(utmData.baseUrl)

  // Añadir parámetros UTM
  Object.entries(utmData.params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.append(key, value)
    }
  })

  return url.toString()
}

/**
 * Valida los datos UTM
 */
export function validateUTMData(utmData: UTMData): { valid: boolean; message?: string } {
  // Verificar URL base
  try {
    new URL(utmData.baseUrl)
  } catch (e) {
    return { valid: false, message: "La URL base no es válida" }
  }

  // Verificar parámetros obligatorios
  if (!utmData.params.utm_channel) {
    return { valid: false, message: "utm_channel es obligatorio" }
  }

  if (!utmData.params.utm_source) {
    return { valid: false, message: "utm_source es obligatorio" }
  }

  if (!utmData.params.utm_medium) {
    return { valid: false, message: "utm_medium es obligatorio" }
  }

  if (!utmData.params.utm_campaign) {
    return { valid: false, message: "utm_campaign es obligatorio" }
  }

  // Verificar que source y medium no sean iguales
  if (utmData.params.utm_source === utmData.params.utm_medium) {
    return { valid: false, message: "utm_source y utm_medium no pueden ser iguales" }
  }

  // Verificar que la campaña no sea demasiado genérica
  if (utmData.params.utm_campaign.length < 5) {
    return { valid: false, message: "El nombre de la campaña es demasiado corto" }
  }

  return { valid: true }
}
