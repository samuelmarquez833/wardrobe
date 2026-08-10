import { NextResponse } from 'next/server'
import { deleteClothing, deleteImage, toggleDirty, getClothingById } from '@/lib/db'

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const clothing = await getClothingById(id)

    if (clothing?.image_path) {
      await deleteImage(clothing.image_path)
    }

    await deleteClothing(id)
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
      await toggleDirty(id)
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
