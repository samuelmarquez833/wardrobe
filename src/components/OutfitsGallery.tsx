'use client'

import Image from 'next/image'
import { Clothing, Outfit } from '@/lib/types'

interface OutfitsGalleryProps {
  outfits: Outfit[]
  clothes: Clothing[]
  onDelete?: (id: string) => void
}

export function OutfitsGallery({ outfits, clothes, onDelete }: OutfitsGalleryProps) {
  const getClothById = (id: string) => clothes.find((c) => c.id === id)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {outfits.map((outfit) => {
        const outfitClothes = outfit.clothes_ids
          .map(getClothById)
          .filter(Boolean) as Clothing[]

        return (
          <div
            key={outfit.id}
            className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden shadow"
          >
            <div className="grid grid-cols-3 gap-2 p-4 bg-gray-100 dark:bg-gray-700">
              {outfitClothes.map((item) => (
                <div key={item.id} className="relative aspect-square">
                  {item.image_url.startsWith('data:') ? (
                    <img
                      src={item.image_url}
                      alt={item.type}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <Image
                      src={item.image_url}
                      alt={item.type}
                      fill
                      className="object-cover rounded"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-2">{outfit.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {outfitClothes.length} prendas
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {new Date(outfit.created_at).toLocaleDateString()}
              </p>
              <button
                onClick={() => onDelete?.(outfit.id)}
                className="mt-3 w-full px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
              >
                Borrar
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
