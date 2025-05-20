import { supabase } from './supabaseClient'

export interface UTMRecord {
  id?: string
  source: string
  medium: string
  campaign: string
  term?: string
  content?: string
  full_url: string
  name?: string
  description?: string
  is_favorite?: boolean
  created_at?: string
  updated_at?: string
  user_id?: string
}

export const utmService = {
  // Guardar una nova UTM
  async saveUTM(utm: UTMRecord) {
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) throw new Error('No hi ha usuari autenticat')

    // LOG abans del .insert
    console.log('Intentant guardar UTM:', {
      ...utm,
      user_id: user.user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })

    const { data, error } = await supabase
      .from('utm_records')
      .insert([
        {
          ...utm,
          user_id: user.user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single()

    // LOG després del .insert
    if (error) {
      console.error('Error de Supabase:', error)
      throw error
    }
    return data
  },

  // Obtenir totes les UTMs de l'usuari
  async getAllUTMs() {
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) throw new Error('No hi ha usuari autenticat')

    const { data, error } = await supabase
      .from('utm_records')
      .select('*')
      .eq('user_id', user.user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Obtenir les UTMs favorites de l'usuari
  async getFavoriteUTMs() {
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) throw new Error('No hi ha usuari autenticat')

    const { data, error } = await supabase
      .from('utm_records')
      .select('*')
      .eq('user_id', user.user.id)
      .eq('is_favorite', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Actualitzar una UTM
  async updateUTM(id: string, updates: Partial<UTMRecord>) {
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) throw new Error('No hi ha usuari autenticat')

    const { data, error } = await supabase
      .from('utm_records')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', user.user.id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Eliminar una UTM
  async deleteUTM(id: string) {
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) throw new Error('No hi ha usuari autenticat')

    const { error } = await supabase
      .from('utm_records')
      .delete()
      .eq('id', id)
      .eq('user_id', user.user.id)

    if (error) throw error
  },

  // Registrar ús d'una UTM
  async recordUTMUsage(utmId: string) {
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) throw new Error('No hi ha usuari autenticat')

    // Primer comprovem si ja existeix un registre per aquesta UTM
    const { data: existingRecord } = await supabase
      .from('utm_history')
      .select('*')
      .eq('utm_id', utmId)
      .eq('user_id', user.user.id)
      .single()

    if (existingRecord) {
      // Si existeix, incrementem el comptador
      const { data, error } = await supabase
        .from('utm_history')
        .update({
          used_count: existingRecord.used_count + 1,
          used_at: new Date().toISOString()
        })
        .eq('id', existingRecord.id)
        .select()
        .single()

      if (error) throw error
      return data
    } else {
      // Si no existeix, creem un nou registre
      const { data, error } = await supabase
        .from('utm_history')
        .insert([
          {
            utm_id: utmId,
            user_id: user.user.id,
            used_at: new Date().toISOString(),
            used_count: 1
          }
        ])
        .select()
        .single()

      if (error) throw error
      return data
    }
  },

  // Obtenir l'historial d'ús
  async getUTMHistory() {
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) throw new Error('No hi ha usuari autenticat')

    const { data, error } = await supabase
      .from('utm_history')
      .select(`
        *,
        utm_records (*)
      `)
      .eq('user_id', user.user.id)
      .order('used_at', { ascending: false })

    if (error) throw error
    return data
  }
} 