# 🛒 Vecindario Online - Backend

Este es el backend del proyecto **Vecindario Online**, construido con **NestJS**, **TypeScript**, **Prisma** y **PostgreSQL**.

## 🧰 Tecnologías

- NestJS
- Prisma ORM
- PostgreSQL
- JWT (Passport.js)
- TypeScript

## 🧬 Base de Datos (Prisma)

El archivo con el esquema de base de datos se encuentra en:

backend/prisma/schema.prisma

Contiene las siguientes entidades:

- `User`: Información básica del usuario
- `Role`: Tipos de roles (en español: "administrador", "locatario", "comprador")
- `UserRole`: Tabla intermedia para asignación de múltiples roles a un usuario
- `Locatario`: Información adicional del usuario cuando tiene rol de locatario
- `Product`: Productos registrados por locatarios

Relaciones importantes:

- Un usuario puede tener múltiples roles.
- Un locatario es un usuario con datos adicionales y productos.
- Un producto pertenece a un locatario.
## 📦 Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/usuario/proyecto.git
   cd proyecto/backend
2. Instala las dependencias
    ```bash
    npm install
    ```
3. Configura tu entorno: Crea un archivo .env con el siguiente contenido:
   ```ini
   DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/nombreDB
   JWT_SECRET=supersecret
4. Aplica las migraciones y genera el cliente Prisma:
   ```bash
   npx prisma migrate dev --name init
   npx prisma generat
5. Agrega los datos de prueba
   ```bash
   npm run seed

6. Inicia el servidor:
   ```bash
   npm run start:dev

DATOS DE PRUEBA
  ```markdown
ADMIN:
  {
    firsName: "Admin",
    lastName: "Uno",
    email: "admin@admin.com",
    password: "password"
  }
LOCATARIO
  {
    firstName: "Locatario",
    lastName: "Mercado",
    email: "locatario@example.com",
    password: "password"
  }
  ```

## 🔐 Autenticación
Se usa JWT para proteger rutas. Para acceder a rutas protegidas, es necesario:
1. Registrarse (/auth/register)

   para el registro se necesita: firstName, lastName, email, password

2. Hacer login (/auth/login)
     
   para el login se necesita: email, password 

3. Usar el token JWT en el header:
  ```makefile
  Authorization: Bearer TU_TOKEN
  ```

## Estructura actual
- User: Todos los usuarios registrados
- Role: Roles (administrador, locatario, comprador)
- UserRole: Relación entre usuarios y roles
- Locatario: Información del comercio de un locatario
- Product: Productos creados por locatarios


## 🔛 Rutas utiles para frontend/backend
- POST /auth/register → Registro
- POST /auth/login → Login
- GET /users/me → Obtener perfil autenticado (token necesario)
- POST /locatario → Crear perfil locatario (token necesario)
- GET /locatario → Ver info de locatario (token necesario)
