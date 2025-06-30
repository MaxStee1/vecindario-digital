import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCarritoItemDto } from './dto/create-carrito-item.dto';
import { UpdateCarritoItemDto } from './dto/update-carrito-item.dto';

@Injectable()
export class CarritoService {
  constructor(private prisma: PrismaService) {}

  async agregarProducto(dto: CreateCarritoItemDto) {
    // Verifica stock
    const producto = await this.prisma.producto.findUnique({ where: { id: dto.productoId } });
    if (!producto) throw new NotFoundException('Producto no encontrado');
    if (dto.cantidad > producto.stock) throw new BadRequestException('Cantidad supera el stock disponible');

    // Si ya existe, suma la cantidad
    const existente = await this.prisma.carritoItem.findUnique({
      where: { compradorId_productoId: { compradorId: dto.compradorId, productoId: dto.productoId } },
    });
    if (existente) {
      const nuevaCantidad = existente.cantidad + dto.cantidad;
      if (nuevaCantidad > producto.stock) throw new BadRequestException('Cantidad total supera el stock');
      return this.prisma.carritoItem.update({
        where: { id: existente.id },
        data: { cantidad: nuevaCantidad },
      });
    }
    // Si no existe, lo crea
    return this.prisma.carritoItem.create({ data: dto });
  }

  async eliminarProducto(compradorId: number, productoId: number) {
    return this.prisma.carritoItem.deleteMany({
      where: { compradorId, productoId },
    });
  }

  async obtenerCarrito(compradorId: number) {
    return this.prisma.carritoItem.findMany({
      where: { compradorId },
      include: { 
        producto: { include: { locatario: true } } 
      },
    });
  }

  async actualizarCantidad(compradorId: number, productoId: number, dto: UpdateCarritoItemDto) {
    const item = await this.prisma.carritoItem.findUnique({
      where: { compradorId_productoId: { compradorId, productoId } },
    });
    if (!item) throw new NotFoundException('Producto no está en el carrito');
    return this.prisma.carritoItem.update({
      where: { id: item.id },
      data: dto,
    });
  }

  async vaciarCarrito(compradorId: number) {
    return this.prisma.carritoItem.deleteMany({
      where: { compradorId },
    });
  }
}