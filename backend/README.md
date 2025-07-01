<p align="center">
  <a href="https://nestjs.com/" target="_blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="NestJS Logo" /></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-%5E10.0.0-red" alt="NestJS" />
  <img src="https://img.shields.io/badge/Prisma-%5E5.0.0-blueviolet" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-%3E=13-blue" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Node.js-%3E=18-green" alt="Node.js" />
</p>

# Backend - Vecindario Digital

API RESTful para la plataforma de comercio local, desarrollada con **NestJS**, **Prisma** y **PostgreSQL**.

## Tecnologías

- [NestJS](https://nestjs.com/)
- [Prisma ORM](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [JWT](https://jwt.io/) (autenticación)
- [TypeScript](https://www.typescriptlang.org/)

## Configuración

1. Copia `.env.example` a `.env` y configura tu conexión a la base de datos y el secret JWT:
   ```
   DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/vecindario
   JWT_SECRET=supersecret
   ```

2. Instala dependencias:
   ```bash
   npm install
   ```

3. Aplica migraciones y genera el cliente Prisma:
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

4. (Opcional) Carga datos de prueba:
   ```bash
   npm run seed
   ```

## Scripts

- `npm run start:dev` - Inicia el servidor en modo desarrollo
- `npm run build` - Compila el proyecto
- `npm run test` - Ejecuta tests unitarios
- `npm run test:e2e` - Ejecuta tests end-to-end
- `npm run seed` - Carga datos de prueba

## Endpoints principales

- `POST /auth/register` - Registro de usuario
- `POST /auth/login` - Login (devuelve cookie JWT)
- `POST /auth/logout` - Logout
- `GET /auth/me` - Perfil autenticado
- `GET /locatarios/productos` - Productos del locatario
- `GET /comprador/productos` - Productos disponibles para compradores
- `GET /admin/users` - Listado de usuarios (admin)

## Estructura de la base de datos

Consulta [prisma/schema.prisma](prisma/schema.prisma) para ver el modelo de datos.

## Notas

- El backend corre por defecto en el puerto **3001**.
- El frontend debe apuntar a `http://localhost:3001` para las peticiones API.
- El token JWT se almacena en una cookie HTTP-only para mayor seguridad.

---
