// src/pedidos/pedidos.module.ts
import { Module } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { PedidosController } from './pedidos.controller';

@Module({
  controllers: [PedidosController],
  providers: [PedidosService],
  exports: [PedidosService], 
})
export class PedidosModule {}