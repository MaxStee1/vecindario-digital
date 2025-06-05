import { IsString, IsNumber, IsOptional, IsEnum } from "class-validator";
import { MetodoEntrega } from "@prisma/client";

export class CreateValoracionDto {
  @IsNumber()
  readonly compradorId!: number;

  @IsNumber()
  readonly productoId!: number;

  @IsNumber()
  readonly calificacion!: number;

  @IsOptional()
  @IsString()
  readonly comentario?: string;

  @IsEnum(MetodoEntrega)
  readonly tipoEntrega!: MetodoEntrega;
}