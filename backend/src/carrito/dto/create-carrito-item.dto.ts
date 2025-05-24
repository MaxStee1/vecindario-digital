import { IsNumber, Min } from 'class-validator';

export class CreateCarritoItemDto {
  @IsNumber()
  usuarioId!: number;

  @IsNumber()
  productoId!: number;

  @IsNumber()
  @Min(1)
  cantidad!: number;
}