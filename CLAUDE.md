# b3-clothes: Outfit Creator

App web para subir fotos de ropa y crear outfits por slider (estilo snake).

## Fases Desarrollo

**Fase 1: Frontend** (Claude hace)
- Home + upload UI
- Slider outfit creator
- Galería closet
- Galería outfits
- Mocks/dummy data. API endpoints stubbed (return mock)
- Ready para conectar a backend

**Fase 2: Backend + DB** (Usuario hace/juntos)
- Supabase setup + tables
- `/api/upload` → storage + DB
- `/api/clothes` CRUD
- `/api/outfits` CRUD
- Auth hardcoded user_id
- Integra frontend con endpoints reales

**Fase 3: V2+** (Después)
- Vision API
- Algoritmo match
- Estilos IA
- OAuth multi-user

---

## Roadmap

### MVP (V1) ✅ En progreso
- [x] DB personal (1 user hardcoded) — solo ves tu app
- [x] Upload foto → galería ropa (organizada por tipo)
- [x] Slider UI: desliza prendas para armar outfit (estilo snake)
- [x] Guardar outfit
- [x] Borrar outfit + borrar prendas
- [ ] **Cesta de Ropa Sucia** — marca prendas como "dirty" temporalmente
- [ ] Deploy Vercel

### V2 — Aprender más
- [ ] Vision API detecta colores automático
- [ ] Algoritmo match: combina colores que matchean
- [ ] Recomendaciones inteligentes

### V3 (Opcional)
- [ ] IA entiende estilos (baggy, starboy, soft baggy, lean baggy)
- [ ] IA genera outfits automáticos por día/estilo
- [ ] OAuth multi-user (varios users, pero comparten cuenta = ven closet)
- [ ] Upload 3D model o PNG aesthetic (no solo fotos)

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 14 (App Router) + React + Tailwind |
| Backend | Next.js API routes |
| DB | Supabase (PostgreSQL) |
| Storage | Supabase Storage (fotos) |
| Auth | Hardcoded user ID (MVP); OAuth v3 |
| Vision | Claude API (vision, ya tienes créditos) |
| Deploy | Vercel |

---

## Architecture

```
/app
  /page.tsx              → Home + upload
  /outfits/page.tsx      → Galería outfits
  /closet/page.tsx       → Galería prendas
  /api/upload            → POST foto → Supabase
  /api/outfits           → CRUD outfits
  /api/clothes           → CRUD prendas

/lib
  /supabase.ts           → Client Supabase
  /vision.ts             → Vision API wrapper
  /hooks                 → useOutfits, useClothes
```

---

## MVP Features

1. **Upload ropa**
   - Sube foto → automático detecta tipo (Top/Bottom/Shoes)
   - Galería organizada por tipo (TOPS → BOTTOMS → SHOES)
   - Botón delete × en cada prenda (hover)

2. **Slider UI (Outfit Creator — Estilo Snake)**
   - Top, Bottom, Shoes apilados verticalmente
   - Botones ← → para cambiar prenda en cada slot
   - Vista previa en vivo del outfit

3. **Guardar + Borrar outfits**
   - Guardar outfit con nombre (o timestamp)
   - Botón "Borrar" rojo en cada outfit guardado
   - Ver todos outfits en `/outfits`

4. **Cesta de Ropa Sucia**
   - Marcar prendas como "dirty" (no disponibles para outfits)
   - Vista separada de prendas limpias vs sucias
   - Toggle rápido sin borrar

5. **Galería**
   - `/closet` → todas prendas (grid por tipo)
   - `/outfits` → todos outfits guardados

---

## DB Schema (Supabase)

```sql
-- Prendas (ropa subida)
CREATE TABLE clothes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  image_url TEXT NOT NULL,
  color TEXT,
  type TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Outfits guardados
CREATE TABLE outfits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  clothes_ids UUID[] NOT NULL,
  name TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- RLS: user_id = current_user solo ve sus datos
```

---

## TODO — Fase 1 (Frontend ✅)

- [x] Init Next.js project
- [x] Slider UI (React component)
- [x] Upload form (drag-drop)
- [x] Galería closet
- [x] Galería outfits
- [x] Home page (upload + slider)
- [x] Mock data (prendas + outfits)

## TODO — Fase 2 (Backend + DB — usuario)

- [ ] Setup Supabase + env vars
- [ ] Auth: hardcoded user_id ENV
- [ ] Upload foto → `/api/upload`
- [ ] Save outfit → `/api/outfits`
- [ ] GET `/api/clothes`
- [ ] GET `/api/outfits`
- [ ] Integrate frontend con endpoints reales
- [ ] Deploy Vercel

## TODO — Fase 3+ (V2/V3)

- [ ] V2: Vision API colors
- [ ] V3: IA estilos

---

## Notas Velocidad

- Tailwind: zero CSS custom
- Supabase: SQL listo (no ORM)
- Next.js: deploy directo, no extra config
- Cliente: React hooks simples, no Redux/Zustand
- Imágenes: Supabase Storage direct links
