import { IsString, IsOptional, IsNumber, Min } from 'class-validator';

export class CreateProductoDto {
  @IsString()
  nombre!: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsNumber()
  @Min(0)
  precio!: number;

  @IsNumber()
  @Min(0)
  stock!: number;

  @IsNumber()
  locatarioId!: number;
}