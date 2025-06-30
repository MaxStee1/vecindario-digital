import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class AddProductToPedidoDto {
  @IsNumber()
  @IsNotEmpty()
  productId!: number;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  cantidad!: number;
}