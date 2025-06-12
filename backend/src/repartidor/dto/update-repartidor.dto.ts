import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateRepartidorDto {
  @IsOptional()
  @IsString()
  ubicacionActual?: string;

  @IsOptional()
  @IsBoolean()
  disponible?: boolean;
}