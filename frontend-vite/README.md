# Frontend - Vecindario Digital

Aplicación web desarrollada en **React** con **Vite** para la plataforma de comercio local.

![Node.js version](https://img.shields.io/badge/node-%3E=18.0.0-green)
![npm version](https://img.shields.io/badge/npm-%3E=9.0.0-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-%3E=15.0-blue)

## Tecnologías

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [PrimeReact](https://primereact.org/) (UI)
- [Axios](https://axios-http.com/) (HTTP requests)
- [React Router](https://reactrouter.com/)

## Instalación

1. Instala dependencias:
   ```bash
   npm install
   ```

2. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

3. Accede a la app en [http://localhost:5173](http://localhost:5173)

## Configuración

- El frontend está configurado para consumir la API en `http://localhost:3000` (ver [src/services/api.ts](src/services/api.ts)).
- Las cookies de autenticación se envían automáticamente (`withCredentials: true`).

## Scripts

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Compila la app para producción
- `npm run preview` - Previsualiza la build de producción
- `npm run lint` - Linting del código

## Rutas principales

- `/` — Página de inicio
- `/login` — Inicio de sesión
- `/registro` — Registro de usuario

## Estructura de carpetas

- `src/components` — Componentes reutilizables
- `src/pages` — Vistas principales
- `src/services` — Lógica de conexión con el backend
## Notas

- El frontend requiere que el backend esté corriendo en `http://localhost:3000`.
- El login y registro funcionan mediante cookies HTTP-only, no se almacena el token en localStorage.

---