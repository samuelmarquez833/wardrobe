'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { TypedUploadForm } from '@/components/TypedUploadForm'
import { Clothing } from '@/lib/types'

export default function ClosetPage() {
  const [clothes, setClothes] = useState<Clothing[]>([])
  const [, setLoading] = useState(true)

  useEffect(() => {
    fetchClothes()
  }, [])

  const fetchClothes = async () => {
    try {
      const res = await fetch('/api/clothes')
      const data = await res.json()
      setClothes(data)
    } catch (error) {
      console.error('Error fetching clothes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddClothing = (newClothing: Clothing) => {
    setClothes([newClothing, ...clothes])
  }

  const handleDeleteClothing = async (id: string) => {
    try {
      const res = await fetch(`/api/clothes/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setClothes(clothes.filter((c) => c.id !== id))
      }
    } catch (error) {
      console.error('Delete error:', error)
    }
  }

  const handleToggleDirty = async (id: string) => {
    try {
      const res = await fetch(`/api/clothes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toggle_dirty: true }),
      })
      if (res.ok) {
        setClothes(
          clothes.map((c) =>
            c.id === id ? { ...c, is_dirty: !c.is_dirty } : c
          )
        )
      }
    } catch (error) {
      console.error('Toggle dirty error:', error)
    }
  }

  const typeOrder = ['top', 'bottom', 'shoes'] as const

  const renderSection = (type: typeof typeOrder[number], isDirty: boolean) => {
    const items = clothes.filter(
      (c) => c.type === type && (isDirty ? c.is_dirty : !c.is_dirty)
    )

    return (
      <div key={type} className="space-y-4 pb-8 border-b last:border-b-0">
        <h2 className="text-2xl font-bold capitalize">{type}s</h2>

        {items.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 hover:shadow-lg transition group"
              >
                <div className="relative aspect-square">
                  {item.image_url.startsWith('data:') ? (
                    <img
                      src={item.image_url}
                      alt={item.type}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image
                      src={item.image_url}
                      alt={item.type}
                      fill
                      className="object-cover"
                    />
                  )}
                  <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={() => handleToggleDirty(item.id)}
                      className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-yellow-600"
                      title={item.is_dirty ? 'Limpiar' : 'Marcar como sucia'}
                    >
                      {item.is_dirty ? '✓' : '✗'}
                    </button>
                    <button
                      onClick={() => handleDeleteClothing(item.id)}
                      className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-red-700"
                      title="Borrar"
                    >
                      ×
                    </button>
                  </div>
                </div>
                {item.color && (
                  <div className="p-2 text-sm">
                    <p className="text-gray-600 dark:text-gray-400 capitalize">
                      {item.color}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            No hay {type}s aún
          </p>
        )}

        <TypedUploadForm type={type} onUpload={handleAddClothing} />
      </div>
    )
  }

  const cleanClothes = clothes.filter((c) => !c.is_dirty)
  const dirtyClothes = clothes.filter((c) => c.is_dirty)

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Tu Closet</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        {cleanClothes.length} limpias · {dirtyClothes.length} en cesta
      </p>

      {/* PRENDAS LIMPIAS */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-green-600 dark:text-green-400">
          Prendas Limpias
        </h2>
        <div className="space-y-6">
          {typeOrder.map((type) => renderSection(type, false))}
        </div>
      </div>

      {/* CESTA ROPA SUCIA */}
      {dirtyClothes.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6 text-orange-600 dark:text-orange-400">
            🧺 Cesta de Ropa Sucia
          </h2>
          <div className="space-y-6">
            {typeOrder.map((type) => renderSection(type, true))}
          </div>
        </div>
      )}
    </div>
  )
}
