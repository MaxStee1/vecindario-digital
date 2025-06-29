import { PartialType } from '@nestjs/mapped-types';
import { CreatePedidoDto } from './create-pedido';

export class UpdatePedidoDto extends PartialType(CreatePedidoDto) {

}

