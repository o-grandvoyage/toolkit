"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Sun, Cloud, Clock, Info } from 'lucide-react'
import Image from 'next/image'

function useBarcelonaTime() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])
  // Hora de Barcelona (Europe/Madrid)
  const barcelonaTime = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Europe/Madrid' })
  return barcelonaTime
}

// Simulació simple de temps i temperatura
function getWeather(hour: number) {
  if (hour >= 7 && hour < 20) return { icon: <Sun className="inline h-5 w-5 text-yellow-400 animate-pulse" />, temp: 23 }
  return { icon: <Cloud className="inline h-5 w-5 text-blue-400 animate-fadeIn" />, temp: 16 }
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [keepLogged, setKeepLogged] = useState(true)
  const router = useRouter()
  const barcelonaTime = useBarcelonaTime()
  const hour = new Date().getHours()
  const { icon: weatherIcon, temp: weatherTemp } = getWeather(hour)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        router.replace('/')
      }
    })
  }, [router])

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      }
    })
    if (error) {
      setMessage('Error: ' + error.message)
    } else {
      setMessage('¡Revisa tu correo para acceder con el magic link!')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl p-8 w-full max-w-md flex flex-col items-center animate-fadeInUp relative">
        <div className="flex justify-center mb-6">
          <Image src="/images/logo-black.svg" alt="Logo GrandVoyage" width={240} height={75} className="mx-auto" />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold mb-2 text-center">TOOLKIT - Inicia sesión</h1>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-gray-700 text-sm">
            Accede con tu correo electrónico. Recibirás un <b>magic link</b> para entrar de forma segura y sin contraseña. ¡Es rápido, seguro y no tienes que recordar nada!
          </p>
        </div>
        <form onSubmit={handleMagicLink} className="w-full flex flex-col gap-4">
          <label className="block text-sm font-medium">Correo electrónico</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#ff5f00] bg-white/80"
            placeholder="tucorreo@email.com"
          />
          <label className="flex items-center gap-2 text-xs text-gray-600">
            <input
              type="checkbox"
              checked={keepLogged}
              onChange={e => setKeepLogged(e.target.checked)}
              className="accent-[#ff5f00]"
            />
            Mantener la sesión iniciada
          </label>
          <button
            type="submit"
            className="w-full bg-[#ff5f00] text-white py-2 rounded font-semibold hover:bg-[#ff7f32] transition-all duration-200 shadow-md hover:scale-105"
            disabled={loading}
          >
            {loading ? 'Enviando...' : 'Enviar magic link'}
          </button>
          {message && <p className="mt-2 text-center text-sm text-gray-700 animate-fadeIn">{message}</p>}
        </form>
        <div className="flex items-center gap-2 mt-4 text-gray-700 text-sm font-mono">
          <Clock className="h-4 w-4 text-gray-500" />
          <span>{barcelonaTime} Barcelona</span>
          {weatherIcon}
          <span>{weatherTemp}ºC</span>
        </div>
      </div>
      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp { animation: fadeInUp 0.5s ease-out both; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out both; }
      `}</style>
    </div>
  )
} 