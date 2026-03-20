# Kanban Board Colaborativo

Aplicacion frontend estilo Trello construida con React + TypeScript + Vite.

## Stack
- React 19 + Vite 8
- Zustand (estado + persistencia)
- Tailwind CSS 4
- Vitest (unit tests)
- GitHub Actions (CI + deploy Pages)

## Funcionalidades actuales
- Multi-tablero con selector y lista inicial
- CRUD base de tableros, columnas y tarjetas
- Formularios profesionales con dialogos propios (sin `prompt` ni `confirm`)
- Filtros por texto, responsable, prioridad, label y fecha
- Limites WIP por columna
- Activity log por cambios en tarjetas
- Persistencia local segura (fallback en memoria para entornos sin `localStorage`)

## Calidad y buenas practicas incluidas
- Validaciones centralizadas (`src/lib/validation.ts`)
- Generacion de IDs desacoplada (`src/lib/id.ts`)
- Reglas de integridad del dominio en store:
  - no permite borrar la ultima columna del tablero
  - sanitiza nombres y descripciones
  - normaliza orden de columnas
- Unit tests para store y filtros
- CI con `lint + test + build`

## Scripts
```bash
npm run dev
npm run lint
npm run test
npm run build
npm run preview
```

## Estructura principal
```text
src/
  components/
  data/
  hooks/
  lib/
  pages/
  store/
  types/
```

## Deploy
- GitHub Pages via workflow `.github/workflows/deploy-pages.yml`
- El `base` de Vite se configura automaticamente para Pages en CI.
