'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { Clothing, Outfit, Subcategory } from '@/lib/types'

interface SliderOutfitCreatorProps {
  clothes: Clothing[]
  subcategories: Subcategory[]
  onSave?: (outfit: Outfit) => void
}

const SLOT_TYPES = ['top', 'bottom', 'shoes'] as const

export function SliderOutfitCreator({ clothes, subcategories, onSave }: SliderOutfitCreatorProps) {
  const [selectedIndices, setSelectedIndices] = useState([0, 0, 0])
  const [selectedSubcat, setSelectedSubcat] = useState<(string | null)[]>([null, null, null])
  const [outfitName, setOutfitName] = useState('')

  const clothesLists = SLOT_TYPES.map((type, slotIndex) =>
    clothes.filter(
      (c) => c.type === type && (selectedSubcat[slotIndex] ? c.subcategory_id === selectedSubcat[slotIndex] : true)
    )
  )
  const [topClothes, bottomClothes, shoeClothes] = clothesLists

  const currentTop = topClothes[selectedIndices[0] % topClothes.length]
  const currentBottom = bottomClothes[selectedIndices[1] % bottomClothes.length]
  const currentShoe = shoeClothes[selectedIndices[2] % shoeClothes.length]

  const handleSlider = (index: number, direction: 'prev' | 'next') => {
    const newIndices = [...selectedIndices]
    const maxIndex = clothesLists[index].length

    if (direction === 'prev') {
      newIndices[index] = (newIndices[index] - 1 + maxIndex) % maxIndex
    } else {
      newIndices[index] = (newIndices[index] + 1) % maxIndex
    }

    setSelectedIndices(newIndices)
  }

  const handleSubcatChange = (slotIndex: number, subcatId: string) => {
    const newSubcat = [...selectedSubcat]
    newSubcat[slotIndex] = subcatId || null
    setSelectedSubcat(newSubcat)

    const newIndices = [...selectedIndices]
    newIndices[slotIndex] = 0
    setSelectedIndices(newIndices)
  }

  const outfitIds = useMemo(() => {
    const ids = []
    if (currentTop) ids.push(currentTop.id)
    if (currentBottom) ids.push(currentBottom.id)
    if (currentShoe) ids.push(currentShoe.id)
    return ids
  }, [currentTop, currentBottom, currentShoe])

  const handleSave = () => {
    const outfit: Outfit = {
      id: Date.now().toString(),
      clothes_ids: outfitIds,
      name: outfitName || `Outfit ${new Date().toLocaleTimeString()}`,
      created_at: new Date().toISOString(),
    }
    onSave?.(outfit)
    setOutfitName('')
  }

  if (!currentTop || !currentBottom) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-400">
          Necesitas al menos 1 top y 1 bottom para crear un outfit
        </p>
      </div>
    )
  }

  const getClothingForSlot = (slotIndex: number) => {
    const clothesList = clothesLists[slotIndex]
    const currentIdx = selectedIndices[slotIndex] % clothesList.length

    const prevIdx = (currentIdx - 1 + clothesList.length) % clothesList.length
    const nextIdx = (currentIdx + 1) % clothesList.length

    return {
      prev: clothesList[prevIdx],
      current: clothesList[currentIdx],
      next: clothesList[nextIdx],
    }
  }

  const renderClothingCarousel = (
    title: string,
    slotIndex: number
  ) => {
    const { prev, current, next } = getClothingForSlot(slotIndex)
    const type = SLOT_TYPES[slotIndex]
    const typeSubcategories = subcategories.filter((s) => s.type === type)

    const ClothingItem = ({ item, position }: { item: Clothing; position: 'prev' | 'current' | 'next' }) => {
      const isCenter = position === 'current'
      return (
        <div
          className={`flex-1 transition-all ${
            isCenter ? 'scale-100 opacity-100' : 'scale-75 opacity-50'
          }`}
        >
          <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            {item.image_url.startsWith('data:') ? (
              <img
                src={item.image_url}
                alt={title}
                className="w-full h-full object-cover"
              />
            ) : (
              <Image
                src={item.image_url}
                alt={title}
                fill
                className="object-cover"
              />
            )}
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-center gap-2">
          <h3 className="font-semibold text-center">{title}</h3>
          {typeSubcategories.length > 0 && (
            <select
              value={selectedSubcat[slotIndex] || ''}
              onChange={(e) => handleSubcatChange(slotIndex, e.target.value)}
              className="text-sm px-2 py-1 border rounded dark:bg-gray-800 dark:border-gray-700"
            >
              <option value="">Todos</option>
              {typeSubcategories.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="flex gap-2 items-center justify-center">
          <ClothingItem item={prev} position="prev" />
          <ClothingItem item={current} position="current" />
          <ClothingItem item={next} position="next" />
        </div>
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => handleSlider(slotIndex, 'prev')}
            className="px-4 py-2 bg-gray-800 dark:bg-gray-200 text-white dark:text-black rounded hover:opacity-80"
          >
            ←
          </button>
          <button
            onClick={() => handleSlider(slotIndex, 'next')}
            className="px-4 py-2 bg-gray-800 dark:bg-gray-200 text-white dark:text-black rounded hover:opacity-80"
          >
            →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {renderClothingCarousel('Top', 0)}
        {renderClothingCarousel('Bottom', 1)}
        {currentShoe && renderClothingCarousel('Shoes', 2)}
      </div>

      {/* SAVE */}
      <div className="space-y-3 border-t pt-6">
        <input
          type="text"
          placeholder="Nombre outfit (opcional)"
          value={outfitName}
          onChange={(e) => setOutfitName(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
        />
        <button
          onClick={handleSave}
          className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
        >
          Guardar Outfit
        </button>
      </div>
    </div>
  )
}
