import { IsNumber, IsString, IsEnum, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { MetodoEntrega, EstadoPedido } from '@prisma/client';

class PedidoProductoDto {
  @IsNumber()
  productoId!: number;

  @IsNumber()
  cantidad!: number;

  @IsNumber()
  precio!: number;
}

export class CreatePedidoDto {
  @IsNumber()
  locatarioId!: number;

  @IsString()
  @IsOptional()
  direccionEntrega?: string;

  /*@IsEnum(MetodoEntrega)
  metodoEntrega!: MetodoEntrega;
*/
  @IsEnum(EstadoPedido)
  @IsOptional()
  estado?: EstadoPedido;

  @IsNumber()
  total!: number;

  @IsString()
  @IsOptional()
  notas?: string;

  @IsString()
  @IsOptional()
  fechaEntrega?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PedidoProductoDto)
  productos!: PedidoProductoDto[];
}