import { NextRequest, NextResponse } from 'next/server'
import { getOutfits, addOutfit } from '@/lib/db'
import { Outfit } from '@/lib/types'

export async function GET() {
  try {
    const outfits = await getOutfits()
    return NextResponse.json(outfits)
  } catch (error) {
    console.error('GET outfits error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch outfits' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const outfit: Outfit = {
      id: body.id || Date.now().toString(),
      clothes_ids: body.clothes_ids,
      name: body.name,
      created_at: body.created_at || new Date().toISOString(),
    }

    const result = await addOutfit(outfit)
    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('POST outfit error:', error)
    return NextResponse.json(
      { error: 'Failed to save outfit' },
      { status: 500 }
    )
  }
}
