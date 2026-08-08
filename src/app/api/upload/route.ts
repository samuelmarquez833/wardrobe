import { NextRequest, NextResponse } from 'next/server'
import { writeFileSync, mkdirSync } from 'fs'
import path from 'path'
import { addClothing, initDb } from '@/lib/db'
import { Clothing } from '@/lib/types'

initDb()

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string
    const subcategoryId = formData.get('subcategory_id') as string | null

    if (!file || !type) {
      return NextResponse.json(
        { error: 'File and type are required' },
        { status: 400 }
      )
    }

    const uploadsDir = path.join(process.cwd(), 'uploads')
    mkdirSync(uploadsDir, { recursive: true })

    const buffer = await file.arrayBuffer()
    const ext = file.name.split('.').pop()
    const filename = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${ext}`
    const filepath = path.join(uploadsDir, filename)

    writeFileSync(filepath, Buffer.from(buffer))

    const clothing: Clothing = {
      id: Date.now().toString(),
      image_url: `/api/images/${filename}`,
      type: type as any,
      subcategory_id: subcategoryId || null,
      created_at: new Date().toISOString(),
      is_dirty: false,
    }

    const result = addClothing(clothing)
    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    )
  }
}
