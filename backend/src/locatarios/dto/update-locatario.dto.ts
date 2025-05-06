import { IsString, IsOptional } from 'class-validator';

export class UpdateLocatarioDto {
  @IsString()
  @IsOptional()
  nombreTienda?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsOptional()
  direccionTienda?: string;

  @IsString()
  @IsOptional()
  horarioApertura?: string;

  @IsString()
  @IsOptional()
  horarioCierre?: string;
}