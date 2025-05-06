import { Module } from '@nestjs/common';
import { LocatariosService } from './locatarios.service';
import { LocatariosController } from './locatarios.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LocatariosController],
  providers: [LocatariosService],
})
export class LocatariosModule {}
