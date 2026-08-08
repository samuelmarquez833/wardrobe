'use client'

import Image from 'next/image'
import { Clothing } from '@/lib/types'

interface ClothesGalleryProps {
  clothes: Clothing[]
  onSelect?: (id: string) => void
}

export function ClothesGallery({ clothes, onSelect }: ClothesGalleryProps) {
  const typeOrder = ['top', 'bottom', 'shoes']

  const groupedByType = typeOrder.reduce(
    (acc, type) => {
      acc[type] = clothes.filter((c) => c.type === type)
      return acc
    },
    {} as Record<string, Clothing[]>
  )

  const renderSection = (type: string, items: Clothing[]) => {
    if (items.length === 0) return null

    return (
      <div key={type} className="space-y-4">
        <h3 className="text-xl font-bold capitalize">{type}s</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelect?.(item.id)}
              className="group cursor-pointer rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 hover:shadow-lg transition"
            >
              <div className="relative aspect-square">
                {item.image_url.startsWith('data:') ? (
                  <img
                    src={item.image_url}
                    alt={item.type}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                ) : (
                  <Image
                    src={item.image_url}
                    alt={item.type}
                    fill
                    className="object-cover group-hover:scale-105 transition"
                  />
                )}
              </div>
              <div className="p-2 text-sm">
                {item.color && (
                  <p className="text-gray-600 dark:text-gray-400 capitalize">
                    {item.color}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {typeOrder.map((type) => renderSection(type, groupedByType[type]))}
    </div>
  )
}
