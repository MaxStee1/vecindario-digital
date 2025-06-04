/*
  Warnings:

  - You are about to drop the column `locatarioId` on the `Valoracion` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Valoracion" DROP CONSTRAINT "Valoracion_locatarioId_fkey";

-- AlterTable
ALTER TABLE "Valoracion" DROP COLUMN "locatarioId";
