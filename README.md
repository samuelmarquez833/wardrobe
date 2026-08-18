# Wardrobe

Photograph the clothes you own, keep them in a digital closet, and build outfits by scrolling
each layer independently — tops, bottoms, shoes — until the combination looks right.

Single-user. There is no login.

## Tech stack

- Next.js 15 (App Router) + React 19
- TypeScript
- Tailwind CSS 3
- Supabase — PostgreSQL for the data, Supabase Storage for the photos
- `@supabase/supabase-js`, called only from server-side route handlers

## What it does

- **Upload** a photo, tag it as top / bottom / shoes / accessory, optionally assign a
  subcategory you define yourself (e.g. "hoodies", "jeans")
- **Closet** — every garment in a grid, grouped by type
- **Laundry basket** — flag a garment as dirty and it drops out of the outfit builder until
  you flag it back
- **Outfit builder** — three stacked carousels, one per layer, with prev/next controls and a
  per-slot subcategory filter; live preview of the combination
- **Save and delete outfits**; deleting a garment also removes its file from Storage

## Data access

`src/lib/supabase.ts` builds the client with the **service_role** key, which bypasses Row Level
Security. That key must never reach the browser, so the module is imported only from API route
handlers — never from a client component. The client is built lazily behind a `Proxy` so that
`next build` succeeds without the environment variables present.

RLS is enabled on all three tables with no policies attached. The public anon key therefore
reads nothing at all, and every request has to go through the app's own API routes. That is the
whole access control model — appropriate for one user, and the thing to replace first if this
ever becomes multi-user.

## API

```
GET    /api/clothes                 list garments
POST   /api/upload                  multipart: file, type, subcategory_id -> Storage + row
DELETE /api/clothes/[id]            deletes the row and the stored file
PATCH  /api/clothes/[id]            body: { toggle_dirty: true }

GET    /api/outfits
POST   /api/outfits
DELETE /api/outfits/[id]

GET    /api/subcategories
POST   /api/subcategories
DELETE /api/subcategories/[id]      also clears the reference on affected garments
```

## Running it

### Supabase

Create a project, then run `db/schema.sql` in the SQL Editor. It is idempotent and creates the
`clothes`, `outfits` and `subcategories` tables, enables RLS, and creates a public `clothes`
storage bucket.

### Environment

Copy `.env.local.example` to `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service_role key from Project Settings -> API>
```

### Start

```bash
npm install
npm run dev           # http://localhost:3000
```

```bash
npm run build
npm start
npm run lint
```

## Known gaps

- No authentication. Every row is written with a hardcoded `user_id` of `'default'`, and anyone
  who can reach the URL can read and delete everything.
- Primary keys are `Date.now().toString()`, which collides under concurrent writes. UUIDs would
  be the fix.
- `src/lib/mock-data.ts` is a leftover from the pre-backend version and is no longer imported.
- Uploads are not validated for size or MIME type.
- `type` is cast with `as any` in the upload handler instead of being checked.
