# Vecindario Digital

Proyecto de comercio digital y local para comunidades, desarrollado con **NestJS**, **Prisma**, **PostgreSQL** en el backend y **React + Vite** en el frontend.

## Estructura del Proyecto

```
.
├── backend/         # API RESTful (NestJS, Prisma, PostgreSQL)
├── frontend-vite/   # Aplicación web (React + Vite)
└── README.md        # Este archivo
```

## Requisitos

- Node.js >= 18
- PostgreSQL >= 13

## Instalación rápida

1. Clona el repositorio:
   ```sh
   git clone https://github.com/MaxStee1/vecindario-digital.git
   cd vecindario-digital
   ```

2. Ejecuta el script de instalación:
   ```sh
   npm run setup
   ```

   > El script instalará dependencias, pedirá que configures el archivo `backend/.env`, aplicará migraciones y cargará datos de prueba.

3. Inicia ambos servidores:
   ```sh
   npm run dev
   ```
   Esto levanta frontend y backend a la vez.

   O si prefieres iniciar por separado:
   ```sh
   cd backend && npm run start:dev
   # en otra terminal
   cd frontend-vite && npm run dev
   ```

4. Accede a la aplicación en [http://localhost:5173](http://localhost:5173)

---

## Requisitos

- Node.js >= 18
- npm >= 9
- Docker (opcional, para base de datos)

---

## Scripts útiles

- `./setup.sh` : Automatiza la instalación y preparación inicial.
- `npm run dev` : Inicia frontend y backend juntos usando `concurrently`.

## Subproyectos

- [Backend (NestJS)](backend/README.md)
- [Frontend (Vite + React)](frontend-vite/README.md)