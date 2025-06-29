import { PedidoItem } from './pedido-item.entity';

export enum PedidoStatus {
  PENDIENTE = 'pendiente',
  ENVIADO = 'enviado',
  EN_REPARTO = 'en reparto',
  CANCELADO = 'cancelado',
}

export class Pedido {
  id!: number;
  userId!: number; 
  items!: PedidoItem[];
  direccionEnvio!: string;
  estado!: PedidoStatus;
  fechaCreacion!: Date;
  fechaActualizacion!: Date;
}