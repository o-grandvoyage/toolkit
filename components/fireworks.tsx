"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface Firework {
  id: number
  x: number
  y: number
  color: string
  size: number
}

export function Fireworks() {
  const [fireworks, setFireworks] = useState<Firework[]>([])

  useEffect(() => {
    // Crear nuevos fuegos artificiales cada 300ms
    const interval = setInterval(() => {
      const newFirework: Firework = {
        id: Date.now(),
        x: Math.random() * 100,
        y: 40 + Math.random() * 30, // Mantener en la parte superior-media
        color: getRandomColor(),
        size: 5 + Math.random() * 10,
      }

      setFireworks((prev) => [...prev, newFirework])

      // Eliminar fuegos artificiales después de 1.5 segundos
      setTimeout(() => {
        setFireworks((prev) => prev.filter((fw) => fw.id !== newFirework.id))
      }, 1500)
    }, 300)

    // Limpiar intervalo después de 3 segundos
    setTimeout(() => {
      clearInterval(interval)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getRandomColor = () => {
    const colors = ["#FF5252", "#FFD740", "#64FFDA", "#448AFF", "#E040FB", "#FF4081"]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {fireworks.map((firework) => (
        <FireworkParticle key={firework.id} firework={firework} />
      ))}
    </div>
  )
}

function FireworkParticle({ firework }: { firework: Firework }) {
  const particles = Array.from({ length: 12 }, (_, i) => i)

  return (
    <div
      className="absolute"
      style={{
        left: `${firework.x}%`,
        top: `${firework.y}%`,
      }}
    >
      {particles.map((p, i) => {
        const angle = (i / particles.length) * Math.PI * 2
        const distance = 50 + Math.random() * 30

        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              backgroundColor: firework.color,
              width: firework.size,
              height: firework.size,
              left: 0,
              top: 0,
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{
              scale: [0, 1, 0.5],
              opacity: [1, 1, 0],
              x: [0, Math.cos(angle) * distance],
              y: [0, Math.sin(angle) * distance],
            }}
            transition={{
              duration: 1.5,
              ease: "easeOut",
            }}
          />
        )
      })}
    </div>
  )
}
