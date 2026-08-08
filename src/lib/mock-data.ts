import { Clothing, Outfit } from './types'

export const mockClothes: Clothing[] = [
  {
    id: '1',
    image_url: 'https://images.unsplash.com/photo-1505033575518-a36ea2ef75c2?w=400&q=80',
    type: 'top',
    color: 'black',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    image_url: 'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=400&q=80',
    type: 'top',
    color: 'white',
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    image_url: 'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=400&q=80',
    type: 'bottom',
    color: 'blue',
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    image_url: 'https://images.unsplash.com/photo-1542272624566-c456f21db133?w=400&q=80',
    type: 'bottom',
    color: 'black',
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
    type: 'shoes',
    color: 'white',
    created_at: new Date().toISOString(),
  },
]

export const mockOutfits: Outfit[] = [
  {
    id: 'outfit-1',
    clothes_ids: ['1', '3', '5'],
    name: 'Casual',
    created_at: new Date().toISOString(),
  },
  {
    id: 'outfit-2',
    clothes_ids: ['2', '4', '5'],
    name: 'Street',
    created_at: new Date().toISOString(),
  },
]
