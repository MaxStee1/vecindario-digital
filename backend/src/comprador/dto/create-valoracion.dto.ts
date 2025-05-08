import { IsNumber, IsString, IsOptional, Min, Max, IsEnum } from 'class-validator';
import { MetodoEntrega } from '@prisma/client';

export class CreateValoracionDto {
  @IsNumber()
  locatarioId!: number;

  @IsNumber()
  @Min(1)
  @Max(5)
  calificacion!: number;

  @IsOptional()
  @IsString()
  comentario?: string;

  @IsOptional()
  @IsNumber()
  pedidoId?: number;

  @IsEnum(MetodoEntrega)
  tipoEntrega!: MetodoEntrega;
}