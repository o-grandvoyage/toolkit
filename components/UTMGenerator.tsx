'use client'

import { useState, useEffect } from 'react'
import { utmService, UTMRecord } from '@/lib/utmService'
import { useToast } from '@/components/ui/use-toast'

interface CampaignNameFields {
  product: string
  objective: string
  region?: string
  season?: string
  campaignReason?: string
  language?: string
}

const removeAccents = (str: string): string => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

export default function UTMGenerator() {
  const [utmParams, setUtmParams] = useState({
    source: '',
    medium: '',
    campaign: '',
    term: '',
    content: ''
  })
  const [campaignFields, setCampaignFields] = useState<CampaignNameFields>({
    product: '',
    objective: '',
    region: '',
    season: '',
    campaignReason: '',
    language: ''
  })
  const [isEditingName, setIsEditingName] = useState(false)
  const [baseUrl, setBaseUrl] = useState('')
  const [generatedUrl, setGeneratedUrl] = useState('')
  const [savedUTMs, setSavedUTMs] = useState<UTMRecord[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadSavedUTMs()
  }, [])

  const generateCampaignName = () => {
    if (!campaignFields.campaignReason) {
      toast({
        title: "Error",
        description: "Has d'introduir el motiu de la campanya",
        variant: "destructive"
      })
      return
    }

    const parts = []
    // Afegim el motiu de la campanya com a base
    parts.push(removeAccents(campaignFields.campaignReason.toLowerCase()))
    
    // Afegim els altres paràmetres si existeixen
    if (utmParams.source) parts.push(removeAccents(utmParams.source.toLowerCase()))
    if (utmParams.medium) parts.push(removeAccents(utmParams.medium.toLowerCase()))
    if (utmParams.content) parts.push(removeAccents(utmParams.content.toLowerCase()))
    if (campaignFields.region) parts.push(removeAccents(campaignFields.region.toLowerCase()))
    if (campaignFields.language) parts.push(removeAccents(campaignFields.language.toLowerCase()))

    const date = new Date()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    parts.push(`${month}${year}`)

    const campaignName = parts.join('_')
    setUtmParams(prev => ({ ...prev, campaign: campaignName }))
  }

  const loadSavedUTMs = async () => {
    try {
      const utms = await utmService.getAllUTMs()
      setSavedUTMs(utms)
    } catch (error) {
      console.error('Error carregant UTMs:', error)
      toast({
        title: "Error",
        description: "No s'han pogut carregar les UTMs guardades",
        variant: "destructive"
      })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name.startsWith('campaign_')) {
      const field = name.replace('campaign_', '')
      setCampaignFields(prev => ({
        ...prev,
        [field]: value
      }))
    } else {
      setUtmParams(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const generateUTM = () => {
    const params = new URLSearchParams()
    Object.entries(utmParams).forEach(([key, value]) => {
      if (value) params.append(`utm_${key}`, value)
    })
    
    const fullUrl = `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}${params.toString()}`
    setGeneratedUrl(fullUrl)
  }

  const saveUTM = async () => {
    if (!generatedUrl) {
      toast({
        title: "Error",
        description: "Primer has de generar una UTM",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    try {
      const newUTM = await utmService.saveUTM({
        ...utmParams,
        full_url: generatedUrl
      })
      setSavedUTMs(prev => [newUTM, ...prev])
      toast({
        title: "Èxit",
        description: "UTM guardada correctament"
      })
    } catch (error) {
      console.error('Error guardant UTM:', error)
      toast({
        title: "Error",
        description: "No s'ha pogut guardar la UTM",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedUrl)
      toast({
        title: "Copiat",
        description: "URL copiada al porta-retalls"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No s'ha pogut copiar l'URL",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">URL Base</label>
          <input
            type="url"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#ff5f00]"
            placeholder="https://grandvoyage.com"
          />
        </div>

        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <h3 className="font-medium text-blue-900 mb-2">Generador de Nom de Campanya</h3>
          <p className="text-sm text-blue-700 mb-4">
            El nom de la campanya es genera automàticament seguint aquest format:<br/>
            motivo+source+referral+medium+content+pais+idioma
          </p>
          <div className="grid gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Motiu de la Campanya *</label>
              <input
                type="text"
                name="campaignReason"
                value={campaignFields.campaignReason}
                onChange={handleInputChange}
                placeholder="Ex: promocio_estiu_2024"
                className="w-full px-3 py-2 border rounded"
              />
              <p className="text-sm text-gray-500 mt-1">
                Format recomanat: producte_objectiu (ex: promocio_estiu, black_friday, etc.)
              </p>
            </div>
            <input
              type="text"
              name="campaign_product"
              value={campaignFields.product}
              onChange={handleInputChange}
              placeholder="Producte / Tipus de campanya"
              className="w-full px-3 py-2 border rounded"
            />
            <input
              type="text"
              name="campaign_objective"
              value={campaignFields.objective}
              onChange={handleInputChange}
              placeholder="Objectiu / Segment"
              className="w-full px-3 py-2 border rounded"
            />
            <input
              type="text"
              name="campaign_season"
              value={campaignFields.season}
              onChange={handleInputChange}
              placeholder="Temporada (opcional)"
              className="w-full px-3 py-2 border rounded"
            />
            <input
              type="text"
              name="campaign_region"
              value={campaignFields.region}
              onChange={handleInputChange}
              placeholder="Regió o idioma (opcional)"
              className="w-full px-3 py-2 border rounded"
            />
            <input
              type="text"
              name="campaign_language"
              value={campaignFields.language}
              onChange={handleInputChange}
              placeholder="Idioma (opcional)"
              className="w-full px-3 py-2 border rounded"
            />
            <button
              onClick={generateCampaignName}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Generar Nom de Campanya
            </button>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium">Nom de Campanya</label>
            <button
              onClick={() => setIsEditingName(!isEditingName)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {isEditingName ? 'Utilitzar generador' : 'Editar manualment'}
            </button>
          </div>
          {isEditingName ? (
            <div>
              <input
                type="text"
                name="campaign"
                value={utmParams.campaign}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#ff5f00]"
                placeholder="nom_campanya_font_mitja_MMAAAA"
              />
              <p className="text-sm text-gray-500 mt-1">
                Format recomanat: nom_campanya_font_mitja_MMAAAA
              </p>
            </div>
          ) : (
            <input
              type="text"
              value={utmParams.campaign}
              readOnly
              className="w-full px-3 py-2 border rounded bg-gray-50"
              placeholder="El nom es generarà automàticament"
            />
          )}
        </div>
        
        {Object.entries(utmParams).map(([key, value]) => {
          if (key !== 'campaign') {
            return (
              <div key={key}>
                <label className="block text-sm font-medium mb-1">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
                <input
                  type="text"
                  name={key}
                  value={value}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#ff5f00]"
                  placeholder={`utm_${key}`}
                />
              </div>
            )
          }
          return null
        })}
      </div>

      <div className="flex gap-4">
        <button
          onClick={generateUTM}
          className="px-4 py-2 bg-[#ff5f00] text-white rounded hover:bg-[#ff7f32] transition-colors"
        >
          Generar UTM
        </button>
        <button
          onClick={saveUTM}
          disabled={isLoading || !generatedUrl}
          className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Guardant...' : 'Guardar UTM'}
        </button>
      </div>

      {generatedUrl && (
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded">
            <p className="text-sm text-gray-600 mb-2">URL Generada:</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={generatedUrl}
                readOnly
                className="flex-1 px-3 py-2 border rounded bg-white"
              />
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
              >
                Copiar
              </button>
            </div>
          </div>
        </div>
      )}

      {savedUTMs.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">UTMs Guardades</h3>
          <div className="space-y-4">
            {savedUTMs.map((utm) => (
              <div key={utm.id} className="p-4 bg-gray-50 rounded">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{utm.campaign}</p>
                    <p className="text-sm text-gray-600">{utm.full_url}</p>
                  </div>
                  <button
                    onClick={() => {
                      setGeneratedUrl(utm.full_url)
                      setUtmParams({
                        source: utm.source,
                        medium: utm.medium,
                        campaign: utm.campaign,
                        term: utm.term || '',
                        content: utm.content || ''
                      })
                    }}
                    className="text-[#ff5f00] hover:text-[#ff7f32]"
                  >
                    Reutilitzar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 