/*
  Warnings:

  - The values [enviado] on the enum `EstadoPedido` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EstadoPedido_new" AS ENUM ('pendiente', 'enReparto', 'entregado', 'cancelado');
ALTER TABLE "Pedido" ALTER COLUMN "estado" TYPE "EstadoPedido_new" USING ("estado"::text::"EstadoPedido_new");
ALTER TABLE "PedidoLocatario" ALTER COLUMN "estado" TYPE "EstadoPedido_new" USING ("estado"::text::"EstadoPedido_new");
ALTER TYPE "EstadoPedido" RENAME TO "EstadoPedido_old";
ALTER TYPE "EstadoPedido_new" RENAME TO "EstadoPedido";
DROP TYPE "EstadoPedido_old";
COMMIT;
