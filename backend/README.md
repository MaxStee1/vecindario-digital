<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

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
