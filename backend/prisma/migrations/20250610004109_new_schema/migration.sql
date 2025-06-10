/*
  Warnings:

  - You are about to drop the column `fechaAgregado` on the `CarritoItem` table. All the data in the column will be lost.
  - You are about to drop the column `usuarioId` on the `CarritoItem` table. All the data in the column will be lost.
  - You are about to drop the column `locatarioId` on the `Pedido` table. All the data in the column will be lost.
  - You are about to alter the column `precio` on the `Producto` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Integer`.
  - You are about to drop the `_PedidoProductos` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[compradorId,productoId]` on the table `CarritoItem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `compradorId` to the `CarritoItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CarritoItem" DROP CONSTRAINT "CarritoItem_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "Pedido" DROP CONSTRAINT "Pedido_locatarioId_fkey";

-- DropForeignKey
ALTER TABLE "_PedidoProductos" DROP CONSTRAINT "_PedidoProductos_A_fkey";

-- DropForeignKey
ALTER TABLE "_PedidoProductos" DROP CONSTRAINT "_PedidoProductos_B_fkey";

-- DropIndex
DROP INDEX "CarritoItem_usuarioId_productoId_key";

-- AlterTable
ALTER TABLE "CarritoItem" DROP COLUMN "fechaAgregado",
DROP COLUMN "usuarioId",
ADD COLUMN     "compradorId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Pedido" DROP COLUMN "locatarioId",
ADD COLUMN     "repartidorId" INTEGER;

-- AlterTable
ALTER TABLE "Producto" ADD COLUMN     "calorias" INTEGER,
ADD COLUMN     "imagenUrl" TEXT,
ALTER COLUMN "precio" SET DATA TYPE INTEGER;

-- DropTable
DROP TABLE "_PedidoProductos";

-- CreateTable
CREATE TABLE "Repartidor" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "disponible" BOOLEAN NOT NULL DEFAULT true,
    "ubicacionActual" TEXT,

    CONSTRAINT "Repartidor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categoria" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "locatarioId" INTEGER NOT NULL,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PedidoProducto" (
    "pedidoId" INTEGER NOT NULL,
    "productoId" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio" INTEGER NOT NULL,

    CONSTRAINT "PedidoProducto_pkey" PRIMARY KEY ("pedidoId","productoId")
);

-- CreateTable
CREATE TABLE "PedidoLocatario" (
    "pedidoId" INTEGER NOT NULL,
    "locatarioId" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "estado" "EstadoPedido" NOT NULL,

    CONSTRAINT "PedidoLocatario_pkey" PRIMARY KEY ("pedidoId","locatarioId")
);

-- CreateTable
CREATE TABLE "_CategoriaToProducto" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CategoriaToProducto_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Repartidor_usuarioId_key" ON "Repartidor"("usuarioId");

-- CreateIndex
CREATE INDEX "_CategoriaToProducto_B_index" ON "_CategoriaToProducto"("B");

-- CreateIndex
CREATE UNIQUE INDEX "CarritoItem_compradorId_productoId_key" ON "CarritoItem"("compradorId", "productoId");

-- AddForeignKey
ALTER TABLE "Repartidor" ADD CONSTRAINT "Repartidor_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Categoria" ADD CONSTRAINT "Categoria_locatarioId_fkey" FOREIGN KEY ("locatarioId") REFERENCES "Locatario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_repartidorId_fkey" FOREIGN KEY ("repartidorId") REFERENCES "Repartidor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PedidoProducto" ADD CONSTRAINT "PedidoProducto_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PedidoProducto" ADD CONSTRAINT "PedidoProducto_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PedidoLocatario" ADD CONSTRAINT "PedidoLocatario_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PedidoLocatario" ADD CONSTRAINT "PedidoLocatario_locatarioId_fkey" FOREIGN KEY ("locatarioId") REFERENCES "Locatario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarritoItem" ADD CONSTRAINT "CarritoItem_compradorId_fkey" FOREIGN KEY ("compradorId") REFERENCES "Comprador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoriaToProducto" ADD CONSTRAINT "_CategoriaToProducto_A_fkey" FOREIGN KEY ("A") REFERENCES "Categoria"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoriaToProducto" ADD CONSTRAINT "_CategoriaToProducto_B_fkey" FOREIGN KEY ("B") REFERENCES "Producto"("id") ON DELETE CASCADE ON UPDATE CASCADE;
