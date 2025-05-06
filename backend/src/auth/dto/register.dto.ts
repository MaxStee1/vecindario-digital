import { IsEmail, IsString, IsEnum } from 'class-validator';
import { Rol } from '@prisma/client';

export class RegisterDto {
  @IsString()
  nombre!: string;

  @IsEmail()
  email!: string;

  @IsString()
  password!: string;

  @IsEnum(['locatario', 'comprador'], { message: 'Rol no valido' })
  rol!: Rol;
}