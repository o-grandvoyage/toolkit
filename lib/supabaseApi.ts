import { supabase } from './supabaseClient'

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password })
  return { data, error }
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { data, error }
}

export async function signOut() {
  await supabase.auth.signOut()
}

export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser()
  return data.user
}

export async function saveUTM(utmData: any) {
  const { data, error } = await supabase.from('utm_records').insert([utmData])
  return { data, error }
}

export async function getAllUTMs() {
  const { data, error } = await supabase.from('utm_records').select('*').order('created_at', { ascending: false })
  return { data, error }
} 