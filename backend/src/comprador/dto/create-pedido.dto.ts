import { IsNumber, IsString, IsEnum, IsOptional } from 'class-validator';
import { MetodoEntrega, EstadoPedido } from '@prisma/client';

export class CreatePedidoDto {
  @IsNumber()
  locatarioId!: number;

  @IsString()
  @IsOptional()
  direccionEntrega?: string;

  @IsEnum(MetodoEntrega)
  metodoEntrega!: MetodoEntrega;

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

  @IsString()
  productoId!: string;
}