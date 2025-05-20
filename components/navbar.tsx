"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Menu, X } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"

const formSchema = z.object({
  name: z.string().min(2, { message: "El nombre es obligatorio" }),
  department: z.string().min(2, { message: "El departamento es obligatorio" }),
  idea: z
    .string()
    .max(150, { message: "La idea no puede superar los 150 caracteres" })
    .min(10, { message: "La idea debe tener al menos 10 caracteres" }),
})

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  // Detectar scroll para añadir sombra a la navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setUserEmail(data.user.email)
    })
    // Escolta canvis d'autenticació
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null)
    })
    return () => { listener?.subscription.unsubscribe() }
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      department: "",
      idea: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const subject = encodeURIComponent("Nueva idea de herramienta")
    const body = encodeURIComponent(
      `Nombre: ${values.name}\nDepartamento: ${values.department}\n\nIdea:\n${values.idea}`,
    )
    window.location.href = `mailto:oriol@grandvoyage.com?subject=${subject}&body=${body}`
    setIsDialogOpen(false)
    form.reset()
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUserEmail(null)
    window.location.reload()
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 bg-black z-50 transition-all duration-300 ${
          scrolled ? "shadow-md" : ""
        }`}
      >
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img
              src="/images/logo-white.svg"
              alt="GrandVoyage Logo"
              className="h-10 w-auto"
              style={{ filter: "brightness(0) invert(1)" }}
            />
            <span className="ml-2 bg-[#ff5f00] text-white px-2 py-1 rounded-md text-xs">TOOLKIT</span>
          </Link>

          {/* Navegación Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-white hover:text-gray-300 transition-colors text-base font-medium">
              Crear UTM's
            </Link>
            <div className="relative flex items-center">
              <span className="text-gray-400 text-base font-medium cursor-not-allowed">Crear ID Camping's</span>
              <span className="ml-2 bg-white text-black text-xs px-2 py-0.5 rounded-full">Soon</span>
            </div>
          </nav>

          {/* Botón de ideas (Desktop) */}
          <div className="hidden md:block">
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="rounded-full px-6 py-2 text-sm font-medium text-black"
              style={{ backgroundColor: "#ffd800", borderColor: "#ffd800" }}
            >
              ¿Tienes ideas de +Tools?
            </Button>
          </div>

          {/* Botón de menú hamburguesa (Móvil) */}
          <button onClick={toggleMobileMenu} className="md:hidden text-white p-2 focus:outline-none" aria-label="Menú">
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Botó de logout i email si està loguejat */}
          {userEmail ? (
            <div className="flex items-center gap-2 ml-4">
              <span className="text-white text-xs bg-black/40 px-2 py-1 rounded">{userEmail.split("@")[0]}@</span>
              <button
                onClick={handleLogout}
                className="text-xs text-white bg-black/20 hover:bg-black/40 rounded px-2 py-1 transition border border-transparent hover:border-white"
                title="Logout"
              >
                Logout
              </button>
            </div>
          ) : (
            <a
              href="/login"
              className="ml-4 text-xs text-white underline hover:text-[#ff5f00] transition"
            >
              Login
            </a>
          )}
        </div>
      </header>

      {/* Menú móvil */}
      <div
        className={`md:hidden fixed top-20 left-0 right-0 bg-black z-40 border-t border-gray-800 shadow-lg transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "transform translate-y-0" : "transform -translate-y-full"
        }`}
      >
        <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
          <Link
            href="/"
            className="text-white hover:text-gray-300 transition-colors text-base font-medium py-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            Crear UTM's
          </Link>
          <div className="relative flex items-center py-2">
            <span className="text-gray-400 text-base font-medium cursor-not-allowed">Crear ID Camping's</span>
            <span className="ml-2 bg-white text-black text-xs px-2 py-0.5 rounded-full">Soon</span>
          </div>
          <Button
            onClick={() => {
              setMobileMenuOpen(false)
              setIsDialogOpen(true)
            }}
            className="rounded-full px-6 py-2 text-sm font-medium text-black w-full"
            style={{ backgroundColor: "#ffd800", borderColor: "#ffd800" }}
          >
            ¿Tienes ideas de +Tools?
          </Button>
        </div>
      </div>

      {/* Formulario de ideas */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enviar idea de herramienta</DialogTitle>
            <DialogDescription>
              Comparte tu idea para una nueva herramienta que te gustaría ver en nuestra plataforma.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Tu nombre" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Departamento</FormLabel>
                    <FormControl>
                      <Input placeholder="Tu departamento" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="idea"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tu idea (máx. 150 caracteres)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe brevemente tu idea para una nueva herramienta"
                        {...field}
                        className="resize-none"
                        maxLength={150}
                      />
                    </FormControl>
                    <div className="text-xs text-right text-gray-500">{field.value.length}/150 caracteres</div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit" style={{ backgroundColor: "#ffd800", color: "black", borderColor: "#ffd800" }}>
                  Enviar idea
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}
