'use client'

import { useState, useEffect } from 'react'
import { SliderOutfitCreator } from '@/components/SliderOutfitCreator'
import { Clothing, Outfit, Subcategory } from '@/lib/types'

export default function Home() {
  const [clothes, setClothes] = useState<Clothing[]>([])
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchClothes()
    fetchSubcategories()
  }, [])

  const fetchClothes = async () => {
    try {
      const res = await fetch('/api/clothes')
      const data = await res.json()
      if (!Array.isArray(data)) throw new Error(data?.error || 'Bad response')
      setClothes(data.filter((c: Clothing) => !c.is_dirty))
    } catch (error) {
      console.error('Error fetching clothes:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSubcategories = async () => {
    try {
      const res = await fetch('/api/subcategories')
      const data = await res.json()
      if (!Array.isArray(data)) throw new Error(data?.error || 'Bad response')
      setSubcategories(data)
    } catch (error) {
      console.error('Error fetching subcategories:', error)
    }
  }

  const handleSaveOutfit = async (outfit: Outfit) => {
    try {
      const res = await fetch('/api/outfits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(outfit),
      })
      if (res.ok) {
        alert(`Outfit guardado: ${outfit.name}`)
      } else {
        alert('Error al guardar outfit')
      }
    } catch (error) {
      console.error('Save outfit error:', error)
      alert('Error al guardar outfit')
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Crea tu outfit</h1>
      <SliderOutfitCreator clothes={clothes} subcategories={subcategories} onSave={handleSaveOutfit} />
    </div>
  )
}
