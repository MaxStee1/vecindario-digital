/*
  Warnings:

  - You are about to drop the column `metodoEntrega` on the `Pedido` table. All the data in the column will be lost.
  - You are about to drop the column `calorias` on the `Producto` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "Rol" ADD VALUE 'inactivo';

-- AlterTable
ALTER TABLE "Pedido" DROP COLUMN "metodoEntrega";

-- AlterTable
ALTER TABLE "Producto" DROP COLUMN "calorias";

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "eliminado" BOOLEAN NOT NULL DEFAULT false;
