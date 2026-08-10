'use client'

import { useState, useEffect } from 'react'
import { OutfitsGallery } from '@/components/OutfitsGallery'
import { Outfit, Clothing } from '@/lib/types'

export default function OutfitsPage() {
  const [outfits, setOutfits] = useState<Outfit[]>([])
  const [clothes, setClothes] = useState<Clothing[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [outfitsRes, clothesRes] = await Promise.all([
        fetch('/api/outfits'),
        fetch('/api/clothes'),
      ])
      const outfitsData = await outfitsRes.json()
      const clothesData = await clothesRes.json()
      if (!Array.isArray(outfitsData) || !Array.isArray(clothesData)) {
        throw new Error(outfitsData?.error || clothesData?.error || 'Bad response')
      }
      setOutfits(outfitsData)
      setClothes(clothesData)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const handleDeleteOutfit = async (id: string) => {
    try {
      const res = await fetch(`/api/outfits/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setOutfits(outfits.filter((o) => o.id !== id))
      }
    } catch (error) {
      console.error('Delete outfit error:', error)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Tus Outfits</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        {outfits.length} outfits guardados
      </p>
      {outfits.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">
          No hay outfits guardados. Ve a home y crea uno!
        </p>
      ) : (
        <OutfitsGallery outfits={outfits} clothes={clothes} onDelete={handleDeleteOutfit} />
      )}
    </div>
  )
}
