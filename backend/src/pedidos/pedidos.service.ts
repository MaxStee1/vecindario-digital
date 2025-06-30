
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreatePedidoDto } from './dto/create-pedido';
import { AddProductToPedidoDto } from './dto/add-product-pedido';
import { RemoveProductFromPedidoDto } from './dto/remove-product-pedido';
//import { UpdateAddressPedidoDto } from './dto/update-address-pedido.dto'; 
import { FilterPedidoStatusDto } from './dto/filter-pedido-status.dto';
import { Pedido, PedidoStatus } from './entities/pedido.entity';
import { PedidoItem } from './entities/pedido-item.entity';

@Injectable()
export class PedidosService {
  private pedidos: Pedido[] = []; 
  private nextId = 1;

  async create(createPedidoDto: CreatePedidoDto, userId: number): Promise<Pedido> {
    const newPedido: Pedido = {
      id: this.nextId++,
      userId,
      items: createPedidoDto.items.map(item => ({
        ...item,
        nombreProducto: `Producto ${item.productId}`, 
        precioUnitario: 100, 
      })),
      direccionEnvio: createPedidoDto.direccionEnvio,
      estado: PedidoStatus.PENDIENTE,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
    };
    this.pedidos.push(newPedido);
    return newPedido;
  }

  async findAll(filterDto: FilterPedidoStatusDto): Promise<Pedido[]> {
    if (filterDto.estado) {
      return this.pedidos.filter(pedido => pedido.estado === filterDto.estado);
    }
    return this.pedidos;
  }

  async findOne(id: number): Promise<Pedido> {
    const pedido = this.pedidos.find(p => p.id === id);
    if (!pedido) {
      throw new NotFoundException(`Pedido con ID ${id} no encontrado.`);
    }
    return pedido;
  }

  // --- Funcionalidades de Edición de Pedido ---

 /* async updatePedidoAddress(id: number, updateAddressDto: UpdateAddressPedidoDto): Promise<Pedido> {
    const pedido = await this.findOne(id);
    if (pedido.estado !== PedidoStatus.PENDIENTE) {
      throw new BadRequestException('Solo se puede cambiar la dirección de pedidos pendientes.');
    }
    pedido.direccionEnvio = updateAddressDto.newAddress;
    pedido.fechaActualizacion = new Date();
    return pedido;
  }*/

  async addProductToPedido(id: number, addProductDto: AddProductToPedidoDto): Promise<Pedido> {
    const pedido = await this.findOne(id);
    if (pedido.estado !== PedidoStatus.PENDIENTE) {
      throw new BadRequestException('No se pueden añadir productos a pedidos que no estén pendientes.');
    }

    const existingItem = pedido.items.find(item => item.productId === addProductDto.productId);
    if (existingItem) {
      existingItem.cantidad += addProductDto.cantidad;
    } else {
      pedido.items.push({
        productId: addProductDto.productId,
        cantidad: addProductDto.cantidad,
        nombreProducto: `Producto ${addProductDto.productId}`, 
        precioUnitario: 100, 
      });
    }
    pedido.fechaActualizacion = new Date();
    return pedido;
  }

  async removeProductFromPedido(id: number, removeProductDto: RemoveProductFromPedidoDto): Promise<Pedido> {
    const pedido = await this.findOne(id);
    if (pedido.estado !== PedidoStatus.PENDIENTE) {
      throw new BadRequestException('No se pueden eliminar productos de pedidos que no estén pendientes.');
    }

    const initialLength = pedido.items.length;
    pedido.items = pedido.items.filter(item => item.productId !== removeProductDto.productId);

    if (pedido.items.length === initialLength) {
      throw new NotFoundException(`Producto con ID ${removeProductDto.productId} no encontrado en el pedido.`);
    }

    if (pedido.items.length === 0) {
      // Opcional: Cancelar el pedido si no quedan productos
      pedido.estado = PedidoStatus.CANCELADO;
    }
    pedido.fechaActualizacion = new Date();
    return pedido;
  }

  // --- Funcionalidad de Cancelar Pedido ---
  async cancelPedido(id: number): Promise<Pedido> {
    const pedido = await this.findOne(id);
    if (pedido.estado === PedidoStatus.ENVIADO || pedido.estado === PedidoStatus.EN_REPARTO) {
      throw new BadRequestException('No se puede cancelar un pedido que ya ha sido enviado o está en reparto.');
    }
    if (pedido.estado === PedidoStatus.CANCELADO) {
      throw new BadRequestException('El pedido ya está cancelado.');
    }
    pedido.estado = PedidoStatus.CANCELADO;
    pedido.fechaActualizacion = new Date();
    return pedido;
  }
}