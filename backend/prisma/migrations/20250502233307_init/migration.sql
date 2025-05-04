-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('admin', 'locatario', 'comprador', 'repartidor');

-- CreateEnum
CREATE TYPE "MetodoEntrega" AS ENUM ('envio', 'retiro');

-- CreateEnum
CREATE TYPE "EstadoPedido" AS ENUM ('pendiente', 'enviado', 'entregado', 'cancelado');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contrasenia" TEXT NOT NULL,
    "rol" "Rol" NOT NULL,
    "direccion" TEXT,
    "telefono" TEXT,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Locatario" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "nombreTienda" TEXT NOT NULL,
    "descripcion" TEXT,
    "direccionTienda" TEXT NOT NULL,
    "horarioApertura" TEXT,
    "horarioCierre" TEXT,
    "puntajeVisibilidad" INTEGER NOT NULL DEFAULT 100,
    "fechaRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metodosEntrega" "MetodoEntrega"[],

    CONSTRAINT "Locatario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comprador" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "direccionEntrega" TEXT,

    CONSTRAINT "Comprador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Producto" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "precio" DECIMAL(10,2) NOT NULL,
    "stock" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "locatarioId" INTEGER NOT NULL,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pedido" (
    "id" SERIAL NOT NULL,
    "compradorId" INTEGER NOT NULL,
    "locatarioId" INTEGER NOT NULL,
    "direccionEntrega" TEXT,
    "fechaPedido" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaEntrega" TIMESTAMP(3) NOT NULL,
    "estado" "EstadoPedido" NOT NULL,
    "metodoEntrega" "MetodoEntrega" NOT NULL,
    "total" INTEGER NOT NULL,
    "notas" TEXT NOT NULL,

    CONSTRAINT "Pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Valoracion" (
    "id" SERIAL NOT NULL,
    "compradorId" INTEGER NOT NULL,
    "locatarioId" INTEGER NOT NULL,
    "pedidoId" INTEGER,
    "calificacion" INTEGER NOT NULL,
    "comentario" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tipoEntrega" "MetodoEntrega" NOT NULL,

    CONSTRAINT "Valoracion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Locatario_usuarioId_key" ON "Locatario"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Comprador_usuarioId_key" ON "Comprador"("usuarioId");

-- AddForeignKey
ALTER TABLE "Locatario" ADD CONSTRAINT "Locatario_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comprador" ADD CONSTRAINT "Comprador_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_locatarioId_fkey" FOREIGN KEY ("locatarioId") REFERENCES "Locatario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_compradorId_fkey" FOREIGN KEY ("compradorId") REFERENCES "Comprador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_locatarioId_fkey" FOREIGN KEY ("locatarioId") REFERENCES "Locatario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Valoracion" ADD CONSTRAINT "Valoracion_compradorId_fkey" FOREIGN KEY ("compradorId") REFERENCES "Comprador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Valoracion" ADD CONSTRAINT "Valoracion_locatarioId_fkey" FOREIGN KEY ("locatarioId") REFERENCES "Locatario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Valoracion" ADD CONSTRAINT "Valoracion_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido"("id") ON DELETE SET NULL ON UPDATE CASCADE;
