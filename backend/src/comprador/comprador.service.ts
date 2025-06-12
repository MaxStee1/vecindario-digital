import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';

@Injectable()
export class CompradorService {
  constructor(private prisma: PrismaService) {}

  async getPerfil(userId: number) {
    return this.prisma.comprador.findUnique({
      where: { usuarioId: userId },
      include: { usuario: true },
    });
  }

  async updateDireccion(userId: number, direccion: string) {
    return this.prisma.comprador.update({
      where: { usuarioId: userId },
      data: { direccionEntrega: direccion },
    });
  }

  async crearPedido(userId: number, dto: CreatePedidoDto) {
  const { locatarioId, productos, ...rest } = dto;

  return this.prisma.pedido.create({
    data: {
      direccionEntrega: rest.direccionEntrega,
      estado: rest.estado ?? 'pendiente',
      total: rest.total,
      notas: rest.notas,
      fechaEntrega: rest.fechaEntrega,
      productos: {
        create: productos.map(p => ({
          producto: { connect: { id: Number(p.productoId) } },
          cantidad: p.cantidad,
          precio: p.precio,
        })),
      },
      comprador: { connect: { usuarioId: userId } },
    },
    include: {
      comprador: true,
      productos: true,
    },
  });
}

  /*async crearValoracion(userId: number, dto: CreateValoracionDto) {
    return this.prisma.valoracion.create({
      data: {
        calificacion: dto.calificacion,
        comentario: dto.comentario,
        tipoEntrega: dto.tipoEntrega,
        comprador: { connect: { usuarioId: userId } },
        locatario: { connect: { id: dto.locatarioId } },
        pedido: dto.pedidoId ? { connect: { id: dto.pedidoId } } : undefined,
      },
    });
  }*/

  async getProductosDisponibles() {
    return this.prisma.producto.findMany({
      where: {
        stock: { gt: 0 },
      },
      orderBy: {
        id: 'asc',
      },
      include: {
        locatario: {
          include: {
            usuario: true,
          },
        },
      },
    });
  }

async getPedidos(userId: number) {
  //Busca el id del Comprador usando el usuarioId
  const comprador = await this.prisma.comprador.findUnique({
    where: { usuarioId: userId },
    select: { id: true },
  });

  if (!comprador) return [];

  //Busca los pedidos usando el id del Comprador
  return this.prisma.pedido.findMany({
    where: { compradorId: comprador.id },
    include: {
      comprador: {
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      fechaPedido: 'desc',
    },
  });
}

}