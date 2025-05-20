"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

export function UTMGuide() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Guía de UTMs y Mejores Prácticas</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visión General</TabsTrigger>
            <TabsTrigger value="parameters">Parámetros</TabsTrigger>
            <TabsTrigger value="examples">Ejemplos</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold mt-4">¿Qué son los parámetros UTM?</h3>
              <p>
                Los parámetros UTM (Urchin Tracking Module) son etiquetas que se añaden a las URLs para identificar y
                rastrear el origen del tráfico web. Permiten a las herramientas de análisis como Google Analytics
                determinar de dónde provienen los visitantes y qué campañas de marketing están generando más tráfico y
                conversiones.
              </p>

              <h3 className="text-lg font-semibold mt-4">¿Por qué es importante la estandarización?</h3>
              <p>La estandarización de UTMs asegura:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Consistencia en el seguimiento entre departamentos</li>
                <li>Datos limpios y agrupables en herramientas de análisis</li>
                <li>Eliminación de errores humanos y duplicados</li>
                <li>Mejor atribución y análisis de ROI</li>
                <li>Automatización de procesos de marketing</li>
              </ul>

              <Alert className="mt-4">
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>Consejo importante</AlertTitle>
                <AlertDescription>
                  Siempre utiliza snake_case (palabras separadas por guiones bajos) para tus parámetros UTM. Evita
                  espacios, caracteres especiales y mayúsculas para asegurar la consistencia.
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>

          <TabsContent value="parameters" className="space-y-4">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="utm_channel">
                <AccordionTrigger>utm_channel</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <p>
                      <strong>Definición:</strong> Canal macro de marketing que agrupa fuentes similares.
                    </p>
                    <p>
                      <strong>Uso:</strong> Agrupar grandes canales para segmentación y reporting.
                    </p>
                    <p>
                      <strong>Ejemplos válidos:</strong>
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>search</li>
                      <li>social</li>
                      <li>email</li>
                      <li>referral</li>
                      <li>display</li>
                      <li>affiliates</li>
                      <li>direct</li>
                    </ul>
                    <div className="mt-2">
                      <p className="text-green-600">✅ Correcto: utm_channel=social</p>
                      <p className="text-red-600">🚫 Incorrecto: utm_channel=FacebookPaid → Esto va en utm_source.</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="utm_source">
                <AccordionTrigger>utm_source</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <p>
                      <strong>Definición:</strong> Plataforma o medio concreto que originó el tráfico.
                    </p>
                    <p>
                      <strong>Uso:</strong> Identificar la fuente específica del tráfico.
                    </p>
                    <p>
                      <strong>Ejemplos válidos:</strong>
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>google</li>
                      <li>facebook</li>
                      <li>instagram</li>
                      <li>bing</li>
                      <li>tiktok</li>
                      <li>newsletter_summer25</li>
                    </ul>
                    <div className="mt-2">
                      <p className="text-green-600">✅ Correcto: utm_source=facebook</p>
                      <p className="text-red-600">
                        🚫 Incorrecto: utm_source=Facebook Ads → Usar snake_case sin espacios.
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="utm_medium">
                <AccordionTrigger>utm_medium</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <p>
                      <strong>Definición:</strong> Tipo de tráfico dentro del canal.
                    </p>
                    <p>
                      <strong>Uso:</strong> Indica el tipo de acceso o interacción publicitaria.
                    </p>
                    <p>
                      <strong>Ejemplos válidos:</strong>
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>cpc (pago por clic)</li>
                      <li>organic (tráfico orgánico)</li>
                      <li>email (correo electrónico)</li>
                      <li>banner (publicidad gráfica)</li>
                      <li>video (publicidad en video)</li>
                      <li>native (publicidad nativa)</li>
                      <li>influencer (marketing de influencers)</li>
                    </ul>
                    <div className="mt-2">
                      <p className="text-green-600">✅ Correcto: utm_medium=cpc</p>
                      <p className="text-red-600">🚫 Incorrecto: utm_medium=facebook_ads → Eso va en utm_source.</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="utm_campaign">
                <AccordionTrigger>utm_campaign</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <p>
                      <strong>Definición:</strong> Nombre único de la campaña.
                    </p>
                    <p>
                      <strong>Uso:</strong> Identificar la campaña específica siguiendo una estructura clara.
                    </p>
                    <p>
                      <strong>Formato sugerido:</strong> tipo_producto_objetivo_fecha
                    </p>
                    <p>
                      <strong>Ejemplos válidos:</strong>
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>honeymoon_seo_2025</li>
                      <li>maldivas_blackfriday_2024</li>
                      <li>aventura_luna_de_miel_octubre</li>
                    </ul>
                    <div className="mt-2">
                      <p className="text-green-600">✅ Usar siempre snake_case (guiones bajos)</p>
                      <p className="text-green-600">✅ Evitar acentos y espacios</p>
                      <p className="text-red-600">
                        🚫 Incorrecto: utm_campaign=Campaña Verano → Usar snake_case sin espacios ni acentos.
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="utm_content">
                <AccordionTrigger>utm_content</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <p>
                      <strong>Definición:</strong> Versión creativa u oferta específica.
                    </p>
                    <p>
                      <strong>Uso:</strong> Diferenciar variaciones dentro de una campaña.
                    </p>
                    <p>
                      <strong>Ejemplos válidos:</strong>
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>banner_01</li>
                      <li>video_testimonial</li>
                      <li>cta_footer</li>
                      <li>imagen_playa</li>
                    </ul>
                    <div className="mt-2">
                      <p className="text-green-600">✅ Útil para pruebas A/B y comparación de rendimiento.</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="utm_term">
                <AccordionTrigger>utm_term</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <p>
                      <strong>Definición:</strong> Palabra clave que activó el anuncio.
                    </p>
                    <p>
                      <strong>Uso:</strong> Captura de la palabra clave en campañas de búsqueda (PPC).
                    </p>
                    <p>
                      <strong>Ejemplos válidos:</strong>
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>viaje_romantico</li>
                      <li>vacaciones_maldivas</li>
                    </ul>
                    <div className="mt-2">
                      <p className="text-green-600">
                        ✅ Se puede automatizar dinámicamente en Google Ads con {"{keyword}"}.
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="trackingid">
                <AccordionTrigger>trackingid</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <p>
                      <strong>Definición:</strong> ID interno de seguimiento.
                    </p>
                    <p>
                      <strong>Uso:</strong> Vincula UTM con campañas internas, sistemas de BI o automatización.
                    </p>
                    <p>
                      <strong>Formato sugerido:</strong> trackingid=GV2025_CAMPAÑA123
                    </p>
                    <div className="mt-2">
                      <p className="text-green-600">✅ Este campo ayuda a conciliar datos entre marketing y CRM.</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="newsletter_slug">
                <AccordionTrigger>newsletter_slug</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <p>
                      <strong>Definición:</strong> ID único por newsletter.
                    </p>
                    <p>
                      <strong>Uso:</strong> Permite identificar exactamente qué envío generó el tráfico.
                    </p>
                    <p>
                      <strong>Ejemplo de valor:</strong> nl_febrero2025_viaje_romantico
                    </p>
                    <div className="mt-2">
                      <p className="text-green-600">
                        ✅ Útil en herramientas de email marketing (Mailchimp, Brevo, etc.)
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>

          <TabsContent value="examples" className="space-y-4">
            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold">Ejemplos de UTMs bien estructurados</h3>

              <div className="bg-gray-50 p-4 rounded-md border mt-4">
                <h4 className="font-medium">Campaña de Google Ads</h4>
                <code className="block text-sm bg-white p-2 rounded mt-2 overflow-x-auto">
                  https://example.com/destinos/maldivas/?utm_channel=search&utm_source=google&utm_medium=cpc&utm_campaign=maldivas_verano_2025&utm_content=banner_principal&utm_term=viajes_maldivas
                </code>
              </div>

              <div className="bg-gray-50 p-4 rounded-md border mt-4">
                <h4 className="font-medium">Campaña de Email Marketing</h4>
                <code className="block text-sm bg-white p-2 rounded mt-2 overflow-x-auto">
                  https://example.com/ofertas/blackfriday/?utm_channel=email&utm_source=newsletter&utm_medium=email&utm_campaign=blackfriday_2025&utm_content=cta_principal&newsletter_slug=nl_noviembre_bf
                </code>
              </div>

              <div className="bg-gray-50 p-4 rounded-md border mt-4">
                <h4 className="font-medium">Campaña de Redes Sociales</h4>
                <code className="block text-sm bg-white p-2 rounded mt-2 overflow-x-auto">
                  https://example.com/experiencias/aventura/?utm_channel=social&utm_source=instagram&utm_medium=cpc&utm_campaign=aventura_primavera_2025&utm_content=video_testimonial&trackingid=IG2025_AVENTURA
                </code>
              </div>

              <div className="bg-gray-50 p-4 rounded-md border mt-4">
                <h4 className="font-medium">Campaña de Display</h4>
                <code className="block text-sm bg-white p-2 rounded mt-2 overflow-x-auto">
                  https://example.com/paquetes/familia/?utm_channel=display&utm_source=google&utm_medium=banner&utm_campaign=familia_verano_2025&utm_content=banner_300x250
                </code>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="faq" className="space-y-4">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="faq1">
                <AccordionTrigger>¿Por qué usar snake_case en lugar de otros formatos?</AccordionTrigger>
                <AccordionContent>
                  <p>El formato snake_case (palabras separadas por guiones bajos) es preferible porque:</p>
                  <ul className="list-disc pl-6 space-y-1 mt-2">
                    <li>Es más legible en URLs que otros formatos</li>
                    <li>No causa problemas de codificación en navegadores</li>
                    <li>Es fácil de leer tanto para humanos como para máquinas</li>
                    <li>Facilita la consistencia entre diferentes sistemas y herramientas</li>
                    <li>Evita problemas con mayúsculas/minúsculas en el análisis de datos</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq2">
                <AccordionTrigger>¿Cuántos parámetros UTM debo usar?</AccordionTrigger>
                <AccordionContent>
                  <p>No es necesario usar todos los parámetros UTM en cada URL. Los parámetros obligatorios son:</p>
                  <ul className="list-disc pl-6 space-y-1 mt-2">
                    <li>
                      <strong>utm_channel:</strong> Para agrupar por canal macro
                    </li>
                    <li>
                      <strong>utm_source:</strong> Para identificar la fuente específica
                    </li>
                    <li>
                      <strong>utm_medium:</strong> Para identificar el tipo de tráfico
                    </li>
                    <li>
                      <strong>utm_campaign:</strong> Para identificar la campaña específica
                    </li>
                  </ul>
                  <p className="mt-2">
                    Los parámetros opcionales como utm_content, utm_term, trackingid y newsletter_slug deben usarse
                    cuando aporten valor adicional al análisis.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq3">
                <AccordionTrigger>¿Cómo afectan los UTMs al SEO?</AccordionTrigger>
                <AccordionContent>
                  <p>Los parámetros UTM no afectan negativamente al SEO si se implementan correctamente:</p>
                  <ul className="list-disc pl-6 space-y-1 mt-2">
                    <li>Google ignora los parámetros UTM para la indexación</li>
                    <li>No uses UTMs en enlaces internos de tu sitio web</li>
                    <li>Usa etiquetas canónicas si tienes múltiples URLs con diferentes UTMs</li>
                    <li>Los UTMs son para campañas externas, no para navegación interna</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq4">
                <AccordionTrigger>¿Cómo puedo integrar UTMs con mi CRM?</AccordionTrigger>
                <AccordionContent>
                  <p>Para integrar UTMs con tu CRM y mejorar la atribución:</p>
                  <ul className="list-disc pl-6 space-y-1 mt-2">
                    <li>Configura tu formulario para capturar los parámetros UTM</li>
                    <li>Almacena los UTMs en cookies para mantener la atribución en sesiones múltiples</li>
                    <li>Usa el parámetro trackingid para vincular con IDs internos de campaña</li>
                    <li>Configura reglas de atribución en tu CRM basadas en los valores de UTM</li>
                    <li>Considera usar herramientas de atribución multicanal para análisis avanzado</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq5">
                <AccordionTrigger>¿Cómo manejar UTMs en campañas internacionales?</AccordionTrigger>
                <AccordionContent>
                  <p>Para campañas internacionales, es recomendable:</p>
                  <ul className="list-disc pl-6 space-y-1 mt-2">
                    <li>Incluir el código de país en utm_campaign (ej: honeymoon_es_2025)</li>
                    <li>Usar el parámetro de país en los metadatos para segmentación</li>
                    <li>Mantener consistencia en la nomenclatura entre países</li>
                    <li>Crear un documento de referencia para equipos internacionales</li>
                    <li>Considerar el idioma como parte de la estructura de la campaña</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
