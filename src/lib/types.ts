export interface Clothing {
  id: string
  image_url: string
  /** Path inside the Supabase storage bucket, needed to delete the file. */
  image_path?: string | null
  color?: string
  type: 'top' | 'bottom' | 'shoes' | 'accessory'
  subcategory_id?: string | null
  created_at: string
  is_dirty?: boolean
}

export interface Subcategory {
  id: string
  type: 'top' | 'bottom' | 'shoes' | 'accessory'
  name: string
  created_at: string
}

export interface Outfit {
  id: string
  clothes_ids: string[]
  name?: string
  created_at: string
}
