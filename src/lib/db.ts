import Database from 'better-sqlite3'
import path from 'path'
import { Clothing, Outfit } from './types'

const dbPath = path.join(process.cwd(), 'db', 'clothes.sqlite')
const db = new Database(dbPath)

db.pragma('journal_mode = WAL')

export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS clothes (
      id TEXT PRIMARY KEY,
      image_url TEXT NOT NULL,
      color TEXT,
      type TEXT NOT NULL,
      is_dirty INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      user_id TEXT DEFAULT 'default'
    );

    CREATE TABLE IF NOT EXISTS outfits (
      id TEXT PRIMARY KEY,
      clothes_ids TEXT NOT NULL,
      name TEXT,
      created_at TEXT NOT NULL,
      user_id TEXT DEFAULT 'default'
    );

    CREATE INDEX IF NOT EXISTS idx_clothes_user ON clothes(user_id);
    CREATE INDEX IF NOT EXISTS idx_outfits_user ON outfits(user_id);
  `)
}

export function addClothing(clothing: Clothing): Clothing {
  const stmt = db.prepare(`
    INSERT INTO clothes (id, image_url, color, type, is_dirty, created_at, user_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `)
  stmt.run(
    clothing.id,
    clothing.image_url,
    clothing.color,
    clothing.type,
    clothing.is_dirty ? 1 : 0,
    clothing.created_at,
    'default'
  )
  return clothing
}

export function getClothes(): Clothing[] {
  const stmt = db.prepare('SELECT * FROM clothes WHERE user_id = ? ORDER BY created_at DESC')
  const rows = stmt.all('default') as any[]
  return rows.map(row => ({
    ...row,
    is_dirty: row.is_dirty === 1,
  }))
}

export function getClothingById(id: string): Clothing | undefined {
  const stmt = db.prepare('SELECT * FROM clothes WHERE id = ? AND user_id = ?')
  const row = stmt.get(id, 'default') as any
  if (!row) return undefined
  return { ...row, is_dirty: row.is_dirty === 1 }
}

export function deleteClothing(id: string): void {
  const stmt = db.prepare('DELETE FROM clothes WHERE id = ? AND user_id = ?')
  stmt.run(id, 'default')
}

export function toggleDirty(id: string): void {
  const stmt = db.prepare(`
    UPDATE clothes SET is_dirty = 1 - is_dirty
    WHERE id = ? AND user_id = ?
  `)
  stmt.run(id, 'default')
}

export function addOutfit(outfit: Outfit): Outfit {
  const stmt = db.prepare(`
    INSERT INTO outfits (id, clothes_ids, name, created_at, user_id)
    VALUES (?, ?, ?, ?, ?)
  `)
  const clothesIdsStr = JSON.stringify(outfit.clothes_ids)
  stmt.run(outfit.id, clothesIdsStr, outfit.name, outfit.created_at, 'default')
  return outfit
}

export function getOutfits(): Outfit[] {
  const stmt = db.prepare('SELECT * FROM outfits WHERE user_id = ? ORDER BY created_at DESC')
  const rows = stmt.all('default') as any[]
  return rows.map(row => ({
    ...row,
    clothes_ids: JSON.parse(row.clothes_ids),
  }))
}

export function deleteOutfit(id: string): void {
  const stmt = db.prepare('DELETE FROM outfits WHERE id = ? AND user_id = ?')
  stmt.run(id, 'default')
}
