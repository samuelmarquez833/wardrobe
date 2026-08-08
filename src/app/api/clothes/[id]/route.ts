import { NextResponse } from 'next/server'
import { deleteClothing, toggleDirty, getClothingById, initDb } from '@/lib/db'
import { unlinkSync, existsSync } from 'fs'
import path from 'path'

initDb()

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const clothing = getClothingById(id)

    if (clothing?.image_url.startsWith('/uploads/')) {
      const filepath = path.join(process.cwd(), 'public', clothing.image_url)
      if (existsSync(filepath)) {
        unlinkSync(filepath)
      }
    }

    deleteClothing(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE error:', error)
    return NextResponse.json(
      { error: 'Failed to delete clothing' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    if (body.toggle_dirty) {
      toggleDirty(id)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('PATCH error:', error)
    return NextResponse.json(
      { error: 'Failed to update clothing' },
      { status: 500 }
    )
  }
}
