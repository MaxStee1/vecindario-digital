import { Module } from '@nestjs/common';
import { RepartidorController } from './repartidor.controller';
import { RepartidorService } from './repartidor.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RepartidorController],
  providers: [RepartidorService],
})
export class RepartidorModule {}