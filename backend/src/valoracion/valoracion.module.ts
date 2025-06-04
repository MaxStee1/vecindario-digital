import { Module } from '@nestjs/common';
import { ValoracionController } from './valoracion.controller';
import { ValoracionService } from './valoracion.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ValoracionController],
  providers: [ValoracionService],
})
export class ValoracionModule {}
