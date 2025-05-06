import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { MetodoEntrega } from '@prisma/client';

export class CreateProductoDto {
  @IsString()
  nombre!: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsNumber()
  precio!: number;

  @IsNumber()
  stock!: number;
  
  @IsOptional()
  @IsEnum(MetodoEntrega, { each: true })
  metodosEntrega?: MetodoEntrega[];
}