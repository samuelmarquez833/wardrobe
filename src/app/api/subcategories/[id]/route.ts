import { NextResponse } from 'next/server'
import { deleteSubcategory, initDb } from '@/lib/db'

initDb()

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    deleteSubcategory(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE subcategory error:', error)
    return NextResponse.json(
      { error: 'Failed to delete subcategory' },
      { status: 500 }
    )
  }
}
