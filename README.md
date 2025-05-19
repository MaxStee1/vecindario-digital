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

## Instalación Rápida

1. Clona el repositorio:
   ```bash
   git clone https://github.com/MaxStee1/vecindario-digital.git
   cd vecindario-digital
   ```

2. Instala dependencias:
   ```bash
   cd backend
   npm install
   cd ../frontend-vite
   npm install
   ```

3. Configura la base de datos y variables de entorno en [backend/.env](backend/.env).

4. Aplica migraciones y datos de prueba:
   ```bash
   cd backend
   npx prisma migrate dev --name init
   npm run seed
   ```

5. Inicia ambos servidores:
   - Backend: `npm run start:dev` (puerto 3001)
   - Frontend: `npm run dev` (puerto 5173)

6. Accede a la app en [http://localhost:5173](http://localhost:5173)

## Documentación

- [backend/README.md](backend/README.md)
- [frontend-vite/README.md](frontend-vite/README.md)

---
