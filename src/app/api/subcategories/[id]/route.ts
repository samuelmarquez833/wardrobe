import { NextResponse } from 'next/server'
import { deleteSubcategory } from '@/lib/db'

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await deleteSubcategory(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE subcategory error:', error)
    return NextResponse.json(
      { error: 'Failed to delete subcategory' },
      { status: 500 }
    )
  }
}
