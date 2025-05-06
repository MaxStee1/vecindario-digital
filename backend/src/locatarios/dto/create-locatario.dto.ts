import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class CreateLocatarioDto {
  @IsString()
  @IsNotEmpty()
  nombreTienda!: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsNotEmpty()
  direccionTienda!: string;

  @IsString()
  @IsOptional()
  horarioApertura?: string;

  @IsString()
  @IsOptional()
  horarioCierre?: string;
}
