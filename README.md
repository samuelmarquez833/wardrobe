# b3 Clothes - Outfit Creator

App web para subir fotos de ropa y crear outfits por slider.

---
## Comandos para ejecutar

### Desarrollo (recomendado)
```bash
cd c:\Users\samma\Projects\Coding\b3\clothes
npm run dev
```
- Abre `http://localhost:3000`
- Auto-reload cuando cambias código
- Console muestra errores

### Build (producción)
```bash
npm run build
```
- Compila app
- Genera carpeta `.next/`
- Listo para deploy

### Start (producción local)
```bash
npm start
```
- Ejecuta build anterior
- Simula producción

### Lint (revisa código)
```bash
npm run lint
```
- Checkea TypeScript, ESLint
- No ejecuta, solo revisa

---

## Stack

| Capa | Tech |
|------|------|
| Frontend | React 19 + TypeScript |
| Framework | Next.js 15 |
| Styling | Tailwind CSS |
| Runtime | Node.js |
| Deploy | Vercel (próximo) |

---

## Estructura carpetas

```
src/
├── app/
│   ├── layout.tsx         → Layout global (nav)
│   ├── page.tsx           → Home (upload + slider)
│   ├── closet/page.tsx    → Galería prendas
│   ├── outfits/page.tsx   → Galería outfits
│   ├── api/               → (Fase 2: endpoints)
│   └── globals.css        → Tailwind
├── components/
│   ├── UploadForm.tsx     → Drag-drop upload
│   ├── SliderOutfitCreator.tsx → Slider
│   ├── ClothesGallery.tsx → Grid prendas
│   └── OutfitsGallery.tsx → Grid outfits
└── lib/
    ├── types.ts           → TypeScript types
    └── mock-data.ts       → Datos demo

```

---

## Fase 1: Frontend ✅

- [x] Home + upload UI
- [x] Slider outfit creator
- [x] Galería closet
- [x] Galería outfits
- [x] Mock data (Unsplash)

## Fase 2: Backend + DB (Usuario)

- [ ] Setup Supabase
- [ ] `/api/upload` → Supabase Storage + DB
- [ ] `/api/clothes` CRUD
- [ ] `/api/outfits` CRUD
- [ ] Conectar frontend a endpoints reales

## Fase 3: V2+ (Después)

- [ ] Vision API (detectar colores)
- [ ] Algoritmo match
- [ ] OAuth multi-user

---

## Notas

- **Mock data**: Imágenes de Unsplash (gratis)
- **Estado**: Todo en React state (se pierde al refresh)
- **Fase 2**: Integración Supabase = data persistente
- **Deploy**: `npm run build` → push a Vercel (1 click)

---

## Troubleshooting

**App no carga?**
- `npm install` (si falta dependencies)
- `npm run dev` (reinicia server)
- Abre `localhost:3000` (no `127.0.0.1`)

**Errores TypeScript?**
- `npm run lint` (qué está mal)
- Verifica tipos en `src/lib/types.ts`

**Puertos en uso?**
- Kill proceso: `Get-Process node | Stop-Process`
- O usa puerto diferente: `npm run dev -- -p 3001`
