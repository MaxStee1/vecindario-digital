import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { LocatariosService } from './locatarios/locatarios.service';
import { LocatariosModule } from './locatarios/locatarios.module';
import { CompradorService } from './comprador/comprador.service';
import { CompradorModule } from './comprador/comprador.module';
import { ProductosModule } from './productos/productos.module';
import { CarritoModule } from './carrito/carrito.module';
import { ProveedorModule } from './proveedor/proveedor.module';
import { ValoracionModule } from './valoracion/valoracion.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    AdminModule,
    LocatariosModule,
    CompradorModule,
    ProductosModule,
    CarritoModule,
    ProveedorModule,
    ValoracionModule,
  ],
  controllers: [AppController],
  providers: [AppService, LocatariosService, CompradorService],
})
export class AppModule {}
