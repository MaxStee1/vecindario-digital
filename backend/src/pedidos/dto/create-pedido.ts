import { IsNotEmpty, IsString, IsArray, ValidateNested, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePedidoItemDto {
  @IsNumber()
  @IsNotEmpty()
  productId!: number;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  cantidad!: number;
}

export class CreatePedidoDto {
  @IsNotEmpty()
  @IsString()
  direccionEnvio!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePedidoItemDto)
  items!: CreatePedidoItemDto[];
}