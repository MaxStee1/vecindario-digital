import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRepartidorDto {
  @IsNumber()
  usuarioId!: number;

  @IsOptional()
  @IsString()
  ubicacionActual?: string;
}