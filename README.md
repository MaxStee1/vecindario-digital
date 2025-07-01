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
   ./setup.sh
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

## Instalación Manual (alternativa)

Si tienes problemas con el script `./setup.sh`, puedes realizar la configuración manualmente siguiendo estos pasos:

1. **Instala las dependencias de backend y frontend:**
   ```bash
   cd backend
   npm install
   cd ../frontend-vite
   npm install
   ```

2. **Configura la base de datos y variables de entorno:**
   - Copia el archivo `.env.example` a `.env` en la carpeta `backend/` y edítalo con tus datos de conexión.

3. **Aplica las migraciones y genera el cliente Prisma:**
   ```bash
   cd backend
   npx prisma migrate dev --name init
   npx prisma generate
   ```

4. **Carga los datos de prueba (opcional):**
   ```bash
   npm run seed
   ```

5. **Inicia ambos servidores en terminales separadas:**
   - Backend:
     ```bash
     cd backend
     npm run start:dev
     ```
   - Frontend:
     ```bash
     cd frontend-vite
     npm run dev
     ```

6. **Accede a la aplicación:**  
   Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

---

## Scripts útiles

- `./setup.sh` : Automatiza la instalación y preparación inicial.
- `npm run dev` : Inicia frontend y backend juntos usando `concurrently`.

## Subproyectos

- [Backend (NestJS)](backend/README.md)
- [Frontend (Vite + React)](frontend-vite/README.md)