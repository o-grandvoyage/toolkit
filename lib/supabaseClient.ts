import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Verificar que les variables d'entorn estan definides
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: Falten les variables d\'entorn de Supabase')
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl)
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Definida' : 'No definida')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 