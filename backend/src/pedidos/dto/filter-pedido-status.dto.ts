import { IsEnum, IsOptional } from 'class-validator';
import { PedidoStatus } from '../entities/pedido.entity';

export class FilterPedidoStatusDto {
  @IsOptional()
  @IsEnum(PedidoStatus)
  estado?: PedidoStatus;
}