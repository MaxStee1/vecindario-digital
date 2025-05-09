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

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    AdminModule,
    LocatariosModule,
    CompradorModule,
  ],
  controllers: [AppController],
  providers: [AppService, LocatariosService, CompradorService],
})
export class AppModule {}
