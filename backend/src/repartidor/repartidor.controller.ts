import { Controller, UseGuards, Req, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { RepartidorService } from './repartidor.service';
import { CreateRepartidorDto } from './dto/create-repartidor.dto';
import { UpdateRepartidorDto } from './dto/update-repartidor.dto';

@Controller('repartidor')
@UseGuards(JwtAuthGuard, RolesGuard) // Descomenta para proteger todas las rutas
export class RepartidorController {
  constructor(private repartidorService: RepartidorService) {}

  // =========================
  // CRUD DE REPARTIDOR
  // =========================

  // Crear Repartidor
  @Post()
  createRepartidor(@Body() dto: CreateRepartidorDto) {
    return this.repartidorService.createRepartidor(dto);
  }

  // Ver todos los repartidores
  @Get()
  getRepartidores() {
    return this.repartidorService.getRepartidores();
  }

  @Get('info')
  getLocatarioInfo(@Req() req) {
    return this.repartidorService.getRepartidorInfo(req.user.userId);
  }

  // Ver repartidor por id
  @Get(':id')
  getRepartidorById(@Param('id') id: string) {
    return this.repartidorService.getRepartidorById(Number(id));
  }

  // Editar repartidor
  @Put(':id')
  updateRepartidor(
    @Param('id') id: string,
    @Body() dto: UpdateRepartidorDto,
  ) {
    return this.repartidorService.updateRepartidor(Number(id), dto);
  }

  // Eliminar repartidor
  @Delete(':id')
  deleteRepartidor(@Param('id') id: string) {
    return this.repartidorService.deleteRepartidor(Number(id));
  }

  // =========================
  // FUNCIONALIDADES DE PEDIDOS
  // =========================

  // Ver pedidos pendientes (no asignados a ningún repartidor y estado 'pendiente')
  @Get('pedidos/pendientes')
  getPedidosPendientes() {
    return this.repartidorService.getPedidosPendientes();
  }

  // Ver pedidos asignados a este repartidor
  @Get(':id/pedidos')
  getPedidosAsignados(@Param('id') id: string) {
    return this.repartidorService.getPedidosAsignados(Number(id));
  }

  // Aceptar un pedido (asignar a repartidor y cambiar estado a 'enviado')
  @Post(':id/aceptar-pedido/:pedidoId')
  aceptarPedido(@Param('id') id: string, @Param('pedidoId') pedidoId: string) {
    return this.repartidorService.aceptarPedido(Number(id), Number(pedidoId));
  }

  // Marcar pedido como entregado
  @Post(':id/entregar-pedido/:pedidoId')
  marcarPedidoEntregado(@Param('id') id: string, @Param('pedidoId') pedidoId: string) {
    return this.repartidorService.marcarPedidoEntregado(Number(id), Number(pedidoId));
  }
}