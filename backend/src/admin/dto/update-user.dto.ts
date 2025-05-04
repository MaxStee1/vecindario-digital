import { IsString, IsOptional } from "class-validator";

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    nombre?: string;
  
    @IsString()
    @IsOptional()
    direccion?: string;
  }