import { IsNumber, IsString, IsOptional, Min, Max } from 'class-validator';

export class CreateValoracionDto {
  @IsNumber()
  productoId!: number;

  @IsNumber()
  @Min(1)
  @Max(5)
  calificacion!: number;

  @IsOptional()
  @IsString()
  comentario?: string;

  @IsOptional()
  @IsNumber()
  pedidoId?: number; // validar que el producto fue comprado
}