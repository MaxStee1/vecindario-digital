import { IsString, IsEmail } from 'class-validator';

export class CreateProveedorDto {
  @IsString()
  nombre!: string;

  @IsEmail()
  email!: string;

}