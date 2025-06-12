import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRepartidorDto } from './dto/create-repartidor.dto';
import { UpdateRepartidorDto } from './dto/update-repartidor.dto';

@Injectable()
export class RepartidorService {
  constructor(private prisma: PrismaService) {}

  // =========================
  // CRUD DE REPARTIDOR
  // =========================

  // Crear un repartidor
  async createRepartidor(dto: CreateRepartidorDto) {
    // Verifica que el usuario exista y no tenga ya un repartidor asociado
    const usuario = await this.prisma.usuario.findUnique({ where: { id: dto.usuarioId } });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    const existe = await this.prisma.repartidor.findUnique({ where: { usuarioId: dto.usuarioId } });
    if (existe) throw new BadRequestException('Ya existe un repartidor para este usuario');

    return this.prisma.repartidor.create({
      data: {
        usuarioId: dto.usuarioId,
        ubicacionActual: dto.ubicacionActual,
      },
      include: { usuario: true },
    });
  }

  // Obtener todos los repartidores
  async getRepartidores() {
    return this.prisma.repartidor.findMany({
      include: { usuario: true },
    });
  }

  // Obtener repartidor por id
  async getRepartidorById(id: number) {
    const repartidor = await this.prisma.repartidor.findUnique({
      where: { id },
      include: { usuario: true },
    });
    if (!repartidor) throw new NotFoundException('Repartidor no encontrado');
    return repartidor;
  }

  // Actualizar repartidor
  async updateRepartidor(id: number, dto: UpdateRepartidorDto) {
    const repartidor = await this.prisma.repartidor.findUnique({ where: { id } });
    if (!repartidor) throw new NotFoundException('Repartidor no encontrado');
    return this.prisma.repartidor.update({
      where: { id },
      data: {
        ubicacionActual: dto.ubicacionActual,
        disponible: dto.disponible,
      },
    });
  }

  // Eliminar repartidor
  async deleteRepartidor(id: number) {
    const repartidor = await this.prisma.repartidor.findUnique({ where: { id } });
    if (!repartidor) throw new NotFoundException('Repartidor no encontrado');
    return this.prisma.repartidor.delete({ where: { id } });
  }

  // =========================
  // FUNCIONALIDADES DE PEDIDOS
  // =========================

  /**
   * Ver pedidos pendientes (no asignados a ningún repartidor y estado 'pendiente')
   */
  async getPedidosPendientes() {
    return this.prisma.pedido.findMany({
      where: {
        estado: 'pendiente',
        repartidorId: null,
      },
      include: {
        comprador: { include: { usuario: true } },
        productos: true,
      },
      orderBy: { fechaPedido: 'asc' },
    });
  }

  /**
   * Aceptar un pedido: asigna el pedido al repartidor y cambia el estado a 'enviado'
   */
  async aceptarPedido(repartidorId: number, pedidoId: number) {
    const pedido = await this.prisma.pedido.findUnique({ where: { id: pedidoId } });
    if (!pedido) throw new NotFoundException('Pedido no encontrado');
    if (pedido.repartidorId) throw new BadRequestException('Pedido ya asignado');
    if (pedido.estado !== 'pendiente') throw new BadRequestException('El pedido no está pendiente');

    return this.prisma.pedido.update({
      where: { id: pedidoId },
      data: {
        repartidorId,
        estado: 'enviado',
      },
    });
  }

  /**
   * Ver pedidos asignados a un repartidor (en curso: estado 'enviado' o 'pendiente')
   */
  async getPedidosAsignados(repartidorId: number) {
    return this.prisma.pedido.findMany({
      where: {
        repartidorId,
        estado: { in: ['enviado', 'pendiente'] },
      },
      include: {
        comprador: { include: { usuario: true } },
        productos: true,
      },
      orderBy: { fechaPedido: 'asc' },
    });
  }

  /**
   * Marcar pedido como entregado: solo si está asignado a este repartidor y no está ya entregado
   */
  async marcarPedidoEntregado(repartidorId: number, pedidoId: number) {
    const pedido = await this.prisma.pedido.findUnique({ where: { id: pedidoId } });
    if (!pedido) throw new NotFoundException('Pedido no encontrado');
    if (pedido.repartidorId !== repartidorId) throw new BadRequestException('No puedes modificar este pedido');
    if (pedido.estado === 'entregado') throw new BadRequestException('El pedido ya fue entregado');

    return this.prisma.pedido.update({
      where: { id: pedidoId },
      data: {
        estado: 'entregado',
        fechaEntrega: new Date(),
      },
    });
  }
}