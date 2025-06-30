import { IsString, IsNumber, IsOptional, Min, Max } from "class-validator";

export class CreateValoracionDto {
  @IsNumber()
  compradorId!: number;

  @IsNumber()
  productoId!: number;

  @IsNumber()
  @Min(1)
  @Max(5)
  calificacion!: number;

  @IsOptional()
  @IsString()
  comentario?: string;
}