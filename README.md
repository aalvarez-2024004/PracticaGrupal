# Sistema de Gestión de Inventario

Práctica grupal — arquitectura distribuida con React, Node.js, Express y MongoDB (más PostgreSQL en autenticación).

## Estructura del monorepo

```
├── SistemaInventario/     # Frontend React (Vite + Tailwind + Zustand)
├── service-auth/          # Servicio de Autenticación (puerto 3001) — PostgreSQL
├── service-inventory/     # Servicio A — Gestión de Inventario (puerto 3005) — MongoDB
├── service-reports/       # Servicio B — Alertas y Reportes (puerto 3006) — MongoDB
├── README.md
└── .gitignore
```

## Puertos

| Componente | Puerto |
|---|---|
| service-auth | 3001 |
| service-inventory | 3005 |
| service-reports | 3006 |
| SistemaInventario | 5173 |

## Requisitos

- Node.js 20+
- pnpm
- MongoDB en `localhost:27017`
- PostgreSQL para auth (usar el `docker-compose.yml` de `service-auth`)

```bash
cd service-auth
docker compose up -d
```

## Instalación

```bash
cd service-auth && pnpm install
cd ../service-inventory && pnpm install
cd ../service-reports && pnpm install
cd ../SistemaInventario && pnpm install
```

Copiar `.env.example` a `.env` en cada carpeta (los valores por defecto funcionan en local).

## Ejecución

```bash
# Terminal 1
cd service-auth && pnpm dev

# Terminal 2
cd service-inventory && pnpm dev

# Terminal 3
cd service-reports && pnpm dev

# Terminal 4
cd SistemaInventario && pnpm dev
```

Abrir http://localhost:5173

## Endpoints principales

### Auth (`/api/auth`)

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`

### Inventario (`/inventarios/v1`)

- CRUD `/productos`
- CRUD `/categorias`
- `POST /entradas` · `POST /salidas` · `GET /movimientos`

### Reportes (`/serviceReports/v1`)

- `GET /low-stock` · `GET /out-of-stock`
- `GET /top-productos` · `GET /categorias` · `GET /resumen`
- `GET /excel` (descarga reporte en Excel)

El Servicio B consume el Servicio A por HTTP y aplica lógica propia (filtros, agregaciones y exportación).
