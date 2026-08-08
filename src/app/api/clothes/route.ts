import { NextResponse } from 'next/server'
import { getClothes, initDb } from '@/lib/db'

initDb()

export async function GET() {
  try {
    const clothes = getClothes()
    return NextResponse.json(clothes)
  } catch (error) {
    console.error('GET clothes error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch clothes' },
      { status: 500 }
    )
  }
}
