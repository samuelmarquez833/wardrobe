import { NextResponse } from 'next/server'
import { deleteOutfit } from '@/lib/db'

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await deleteOutfit(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE outfit error:', error)
    return NextResponse.json(
      { error: 'Failed to delete outfit' },
      { status: 500 }
    )
  }
}
