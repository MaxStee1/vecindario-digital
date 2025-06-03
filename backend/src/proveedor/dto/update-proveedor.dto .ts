import { IsString, IsEmail, IsOptional } from 'class-validator';

export class UpdateProveedorDto {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

}