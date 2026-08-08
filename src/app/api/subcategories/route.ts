import { NextRequest, NextResponse } from 'next/server'
import { getSubcategories, addSubcategory, initDb } from '@/lib/db'
import { Subcategory } from '@/lib/types'

initDb()

export async function GET() {
  try {
    const subcategories = getSubcategories()
    return NextResponse.json(subcategories)
  } catch (error) {
    console.error('GET subcategories error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subcategories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.type || !body.name) {
      return NextResponse.json(
        { error: 'type and name are required' },
        { status: 400 }
      )
    }

    const subcategory: Subcategory = {
      id: Date.now().toString(),
      type: body.type,
      name: body.name,
      created_at: new Date().toISOString(),
    }

    const result = addSubcategory(subcategory)
    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('POST subcategory error:', error)
    return NextResponse.json(
      { error: 'Failed to create subcategory' },
      { status: 500 }
    )
  }
}
