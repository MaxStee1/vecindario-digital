import { IsString, IsNumber, IsOptional } from "class-validator";

export class UpdateValoracionDto {
  @IsNumber()
  @IsOptional()
  readonly calificacion?: number;

  @IsOptional()
  @IsString()
  readonly comentario?: string;
}