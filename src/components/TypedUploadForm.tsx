'use client'

import { useState } from 'react'
import { Clothing } from '@/lib/types'

interface TypedUploadFormProps {
  type: 'top' | 'bottom' | 'shoes'
  subcategoryId?: string
  onUpload?: (clothing: Clothing) => void
}

export function TypedUploadForm({ type, subcategoryId, onUpload }: TypedUploadFormProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files[0]) {
      uploadFile(files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      uploadFile(e.target.files[0])
    }
  }

  const uploadFile = async (file: File) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)
      if (subcategoryId) {
        formData.append('subcategory_id', subcategoryId)
      }

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        const newClothing = await res.json()
        onUpload?.(newClothing)
      }
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
    }
  }

  const inputId = `file-upload-${type}-${subcategoryId || 'none'}`

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition text-sm ${
        isDragging
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
      } ${uploading ? 'opacity-60 pointer-events-none' : ''}`}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
        id={inputId}
        disabled={uploading}
      />
      <label htmlFor={inputId} className="cursor-pointer">
        <p className="font-semibold mb-1">
          {uploading ? 'Subiendo...' : `+ Agregar ${type}`}
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Arrastra o click
        </p>
      </label>
    </div>
  )
}
