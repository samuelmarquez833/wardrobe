import { supabase, BUCKET } from './supabase'
import { Clothing, Outfit, Subcategory } from './types'

const USER_ID = 'default'

function unwrap<T>(data: T | null, error: { message: string } | null, what: string): T {
  if (error) throw new Error(`${what}: ${error.message}`)
  return data as T
}

export async function addClothing(clothing: Clothing): Promise<Clothing> {
  const { data, error } = await supabase
    .from('clothes')
    .insert({
      id: clothing.id,
      image_url: clothing.image_url,
      image_path: clothing.image_path ?? null,
      color: clothing.color ?? null,
      type: clothing.type,
      subcategory_id: clothing.subcategory_id || null,
      is_dirty: clothing.is_dirty ?? false,
      created_at: clothing.created_at,
      user_id: USER_ID,
    })
    .select()
    .single()

  return unwrap(data, error, 'addClothing')
}

export async function getClothes(): Promise<Clothing[]> {
  const { data, error } = await supabase
    .from('clothes')
    .select('*')
    .eq('user_id', USER_ID)
    .order('created_at', { ascending: false })

  return unwrap(data, error, 'getClothes')
}

export async function getClothingById(id: string): Promise<Clothing | undefined> {
  const { data, error } = await supabase
    .from('clothes')
    .select('*')
    .eq('id', id)
    .eq('user_id', USER_ID)
    .maybeSingle()

  if (error) throw new Error(`getClothingById: ${error.message}`)
  return data ?? undefined
}

export async function deleteClothing(id: string): Promise<void> {
  const { error } = await supabase
    .from('clothes')
    .delete()
    .eq('id', id)
    .eq('user_id', USER_ID)

  if (error) throw new Error(`deleteClothing: ${error.message}`)
}

export async function deleteImage(imagePath: string): Promise<void> {
  const { error } = await supabase.storage.from(BUCKET).remove([imagePath])
  if (error) throw new Error(`deleteImage: ${error.message}`)
}

export async function toggleDirty(id: string): Promise<void> {
  const current = await getClothingById(id)
  if (!current) return

  const { error } = await supabase
    .from('clothes')
    .update({ is_dirty: !current.is_dirty })
    .eq('id', id)
    .eq('user_id', USER_ID)

  if (error) throw new Error(`toggleDirty: ${error.message}`)
}

export async function addOutfit(outfit: Outfit): Promise<Outfit> {
  const { data, error } = await supabase
    .from('outfits')
    .insert({
      id: outfit.id,
      clothes_ids: outfit.clothes_ids,
      name: outfit.name ?? null,
      created_at: outfit.created_at,
      user_id: USER_ID,
    })
    .select()
    .single()

  return unwrap(data, error, 'addOutfit')
}

export async function getOutfits(): Promise<Outfit[]> {
  const { data, error } = await supabase
    .from('outfits')
    .select('*')
    .eq('user_id', USER_ID)
    .order('created_at', { ascending: false })

  return unwrap(data, error, 'getOutfits')
}

export async function deleteOutfit(id: string): Promise<void> {
  const { error } = await supabase
    .from('outfits')
    .delete()
    .eq('id', id)
    .eq('user_id', USER_ID)

  if (error) throw new Error(`deleteOutfit: ${error.message}`)
}

export async function addSubcategory(subcategory: Subcategory): Promise<Subcategory> {
  const { data, error } = await supabase
    .from('subcategories')
    .insert({
      id: subcategory.id,
      type: subcategory.type,
      name: subcategory.name,
      created_at: subcategory.created_at,
      user_id: USER_ID,
    })
    .select()
    .single()

  return unwrap(data, error, 'addSubcategory')
}

export async function getSubcategories(): Promise<Subcategory[]> {
  const { data, error } = await supabase
    .from('subcategories')
    .select('*')
    .eq('user_id', USER_ID)
    .order('created_at', { ascending: true })

  return unwrap(data, error, 'getSubcategories')
}

export async function deleteSubcategory(id: string): Promise<void> {
  const { error } = await supabase
    .from('subcategories')
    .delete()
    .eq('id', id)
    .eq('user_id', USER_ID)

  if (error) throw new Error(`deleteSubcategory: ${error.message}`)

  const { error: clearError } = await supabase
    .from('clothes')
    .update({ subcategory_id: null })
    .eq('subcategory_id', id)
    .eq('user_id', USER_ID)

  if (clearError) throw new Error(`deleteSubcategory clear: ${clearError.message}`)
}
