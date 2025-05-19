# Frontend - Vecindario Digital

Aplicación web desarrollada en **React** con **Vite** para la plataforma de comercio local.

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

- El frontend está configurado para consumir la API en `http://localhost:3001` (ver [src/services/api.ts](src/services/api.ts)).
- Las cookies de autenticación se envían automáticamente (`withCredentials: true`).

## Scripts

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Compila la app para producción
- `npm run preview` - Previsualiza la build de producción
- `npm run lint` - Linting del código

## Estructura

- `src/pages/` - Vistas principales (Login, Registro, Home, Admin, Locatario, Comprador)
- `src/components/` - Componentes reutilizables (LogoutButton, ProtectedRoute, etc.)
- `src/services/api.ts` - Configuración de Axios para llamadas a la API

## Notas

- El frontend requiere que el backend esté corriendo en `http://localhost:3001`.
- El login y registro funcionan mediante cookies HTTP-only, no se almacena el token en localStorage.

---