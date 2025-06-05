-- CreateTable
CREATE TABLE "_ProveedorLocatario" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ProveedorLocatario_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ProveedorLocatario_B_index" ON "_ProveedorLocatario"("B");

-- AddForeignKey
ALTER TABLE "_ProveedorLocatario" ADD CONSTRAINT "_ProveedorLocatario_A_fkey" FOREIGN KEY ("A") REFERENCES "Locatario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProveedorLocatario" ADD CONSTRAINT "_ProveedorLocatario_B_fkey" FOREIGN KEY ("B") REFERENCES "Proveedor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
