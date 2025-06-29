import { IsNotEmpty, IsNumber } from 'class-validator';

export class RemoveProductFromPedidoDto {
  @IsNumber()
  @IsNotEmpty()
  productId!: number;
}
