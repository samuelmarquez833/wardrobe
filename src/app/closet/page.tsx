'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { TypedUploadForm } from '@/components/TypedUploadForm'
import { Clothing, Subcategory } from '@/lib/types'

export default function ClosetPage() {
  const [clothes, setClothes] = useState<Clothing[]>([])
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [, setLoading] = useState(true)
  const [newCategoryName, setNewCategoryName] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchClothes()
    fetchSubcategories()
  }, [])

  const fetchClothes = async () => {
    try {
      const res = await fetch('/api/clothes')
      const data = await res.json()
      if (!Array.isArray(data)) throw new Error(data?.error || 'Bad response')
      setClothes(data)
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

  const handleAddCategory = async (type: typeof typeOrder[number]) => {
    const name = (newCategoryName[type] || '').trim()
    if (!name) return

    try {
      const res = await fetch('/api/subcategories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, name }),
      })
      if (res.ok) {
        const result = await res.json()
        setSubcategories([...subcategories, result])
        setNewCategoryName({ ...newCategoryName, [type]: '' })
      }
    } catch (error) {
      console.error('Add category error:', error)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Borrar categoría? Las prendas quedarán sin categoría.')) return
    try {
      const res = await fetch(`/api/subcategories/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setSubcategories(subcategories.filter((s) => s.id !== id))
        setClothes(
          clothes.map((c) =>
            c.subcategory_id === id ? { ...c, subcategory_id: null } : c
          )
        )
      }
    } catch (error) {
      console.error('Delete category error:', error)
    }
  }

  const typeOrder = ['top', 'bottom', 'shoes'] as const

  const renderItemsGrid = (items: Clothing[]) => {
    if (items.length === 0) {
      return (
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          No hay prendas aquí
        </p>
      )
    }

    return (
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
    )
  }

  const renderSection = (type: typeof typeOrder[number], isDirty: boolean) => {
    const typeSubcategories = subcategories.filter((s) => s.type === type)
    const typeItems = clothes.filter(
      (c) => c.type === type && (isDirty ? c.is_dirty : !c.is_dirty)
    )
    return (
      <div key={type} className="space-y-6 pb-8 border-b last:border-b-0">
        <h2 className="text-2xl font-bold capitalize">{type}s</h2>

        {typeSubcategories.length === 0 && (
          <p className="ml-4 text-gray-600 dark:text-gray-400 text-sm">
            Crea una categoría para empezar a agregar {type}s
          </p>
        )}

        {typeSubcategories.map((sub) => {
          const items = typeItems.filter((c) => c.subcategory_id === sub.id)
          return (
            <div key={sub.id} className="ml-4 space-y-3 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{sub.name}</h3>
                {!isDirty && (
                  <button
                    onClick={() => handleDeleteCategory(sub.id)}
                    className="text-xs text-red-600 hover:text-red-800"
                  >
                    Borrar categoría
                  </button>
                )}
              </div>
              {renderItemsGrid(items)}
              {!isDirty && (
                <TypedUploadForm type={type} subcategoryId={sub.id} onUpload={handleAddClothing} />
              )}
            </div>
          )
        })}

        {!isDirty && (
          <div className="ml-4 flex gap-2">
            <input
              type="text"
              placeholder={`Nueva categoría de ${type}s (ej. Jeans)`}
              value={newCategoryName[type] || ''}
              onChange={(e) =>
                setNewCategoryName({ ...newCategoryName, [type]: e.target.value })
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddCategory(type)
              }}
              className="flex-1 px-3 py-2 text-sm border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            />
            <button
              onClick={() => handleAddCategory(type)}
              className="px-4 py-2 text-sm bg-gray-800 dark:bg-gray-200 text-white dark:text-black rounded-lg hover:opacity-80"
            >
              + Agregar categoría
            </button>
          </div>
        )}
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
