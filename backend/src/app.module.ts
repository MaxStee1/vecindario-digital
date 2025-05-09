import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { LocatariosService } from './locatarios/locatarios.service';
import { LocatariosModule } from './locatarios/locatarios.module';

@Module({
  imports: [AuthModule, PrismaModule, AdminModule, LocatariosModule],
  controllers: [AppController],
  providers: [AppService, LocatariosService],
})
export class AppModule {}
