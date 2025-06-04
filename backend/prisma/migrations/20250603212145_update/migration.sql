/*
  Warnings:

  - You are about to drop the column `pedidoId` on the `Valoracion` table. All the data in the column will be lost.
  - Added the required column `productoId` to the `Valoracion` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Valoracion" DROP CONSTRAINT "Valoracion_pedidoId_fkey";

-- AlterTable
ALTER TABLE "Valoracion" DROP COLUMN "pedidoId",
ADD COLUMN     "productoId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Valoracion" ADD CONSTRAINT "Valoracion_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
