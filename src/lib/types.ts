export interface Clothing {
  id: string
  image_url: string
  color?: string
  type: 'top' | 'bottom' | 'shoes' | 'accessory'
  created_at: string
  is_dirty?: boolean
}

export interface Outfit {
  id: string
  clothes_ids: string[]
  name?: string
  created_at: string
}
