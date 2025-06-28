import { IsEmail, IsString, IsEnum, Matches, MinLength } from 'class-validator';
import { Rol } from '@prisma/client';

export class RegisterDto {
  @IsString()
  nombre!: string;

  @IsEmail()
  @Matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, { message: 'El correo debe ser un Gmail válido' })
  email!: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password!: string;

  @IsEnum(['locatario', 'comprador', 'repartidor'], { message: 'Rol no valido' })
  rol!: Rol;
}