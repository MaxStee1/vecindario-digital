#!/bin/bash

set -e

echo "== Instalando dependencias del backend =="
cd backend
npm install

echo "== Instalando dependencias del frontend =="
cd ../frontend-vite
npm install

echo "== Recuerda configurar backend/.env antes de continuar =="
read -p "¿Ya configuraste backend/.env? (y/n): " ENV_READY
if [[ "$ENV_READY" != "y" ]]; then
  echo "Por favor, configura backend/.env y vuelve a ejecutar este script."
  exit 1
fi

echo "== Aplicando migraciones y datos de prueba =="
cd ../backend
npx prisma migrate dev --name init
npx prisma generate
npm run seed

echo "== Listo! =="
echo "Ahora puedes iniciar ambos servidores con:"
echo "  npm run dev"
echo "o manualmente:"
echo "  cd backend && npm run start:dev"
echo "  cd frontend-vite && npm run dev"
echo ""
echo "Accede a la app en http://localhost:5173"