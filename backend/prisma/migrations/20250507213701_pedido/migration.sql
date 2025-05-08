-- CreateTable
CREATE TABLE "_PedidoProductos" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PedidoProductos_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_PedidoProductos_B_index" ON "_PedidoProductos"("B");

-- AddForeignKey
ALTER TABLE "_PedidoProductos" ADD CONSTRAINT "_PedidoProductos_A_fkey" FOREIGN KEY ("A") REFERENCES "Pedido"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PedidoProductos" ADD CONSTRAINT "_PedidoProductos_B_fkey" FOREIGN KEY ("B") REFERENCES "Producto"("id") ON DELETE CASCADE ON UPDATE CASCADE;
