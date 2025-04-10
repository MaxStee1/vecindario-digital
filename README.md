# 🏘️ Plataforma Vecinal de Comercio Local

Bienvenido al proyecto de la **Junta de Vecinos**, una plataforma digital que reúne a las tiendas y kioscos del vecindario en un solo lugar. Aquí los locatarios pueden publicar productos, los compradores hacer pedidos, y los administradores supervisar la actividad comercial.

---

## 🚀 Tecnologías Utilizadas

- **Frontend**: React
- **Backend**: Node.js, Express
- **Base de Datos**: PostgreSQL
- **ORM**: Prisma
- **Autenticación**: JWT, bcrypt
- **Otros**: CORS, dotenv

---

## ⚙️ Instalación del Proyecto

### 1. Clona el repositorio

```bash
git clone https://github.com/tu-usuario/tu-repo.git
cd tu-repo
```

### 2. Instala las dependencias

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd ../frontend
npm install
```

### 3. Configura el entorno

Crea un archivo `.env` en la carpeta `backend` con el siguiente contenido:

```env
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/nombre_de_tu_db"
JWT_SECRET="una_clave_secreta"
NODE_ENV="development"
```

> Asegúrate de reemplazar los valores según tu configuración local.

### 4. Inicializa la base de datos

#### 4.1 Ejecuta migraciones con Prisma
```bash
cd backend
npx prisma migrate dev --name init
```

#### 4.2 Llena la base de datos con datos de prueba
```bash
npm run seed
```

### 5. Inicia los servidores

#### Backend
```bash
npm run dev
```

#### Frontend
En otra terminal:
```bash
cd frontend
npm start
```

### 6. Accede a la app

(frontend) Abre tu navegador y entra a:
```
http://localhost:3000
```
(backend)
http://localhost:3001
---

## 👤 Usuarios de Prueba

| Rol       | Email                    | Contraseña |
|-----------|--------------------------|------------|
| ADMIN     | admin@admin.com          | password   |
| LOCATARIO | locatario@example.com    | password   |
| COMPRADOR | comprador@example.com    | password   |

---

## 🧭 Funcionalidades por Rol


## 🛠️ Estructura del Proyecto

```
root/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── routes/
│   ├── controllers/
│   ├── middlewares/
│   ├── index.js
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── routes/
│   │   └── App.jsx
│   └── ...
└── README.md
```

---

## 📌 Notas

---




