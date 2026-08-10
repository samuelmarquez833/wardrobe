import { NextRequest, NextResponse } from 'next/server'
import { addClothing } from '@/lib/db'
import { supabase, BUCKET } from '@/lib/supabase'
import { Clothing } from '@/lib/types'

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

    const ext = file.name.split('.').pop()
    const imagePath = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(imagePath, file, {
        contentType: file.type || 'application/octet-stream',
        upsert: false,
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }

    const { data: publicUrl } = supabase.storage.from(BUCKET).getPublicUrl(imagePath)

    const clothing: Clothing = {
      id: Date.now().toString(),
      image_url: publicUrl.publicUrl,
      image_path: imagePath,
      type: type as any,
      subcategory_id: subcategoryId || null,
      created_at: new Date().toISOString(),
      is_dirty: false,
    }

    const result = await addClothing(clothing)
    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    )
  }
}
