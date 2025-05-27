import { Controller, UseGuards, Get, Req, Post, Body } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { CompradorService } from './comprador.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { CreateValoracionDto } from './dto/create-valoracion.dto';

@Controller('comprador')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('comprador')
export class CompradorController {
  constructor(private readonly compradorService: CompradorService) {}

  @Get('perfil')
  getPerfil(@Req() req) {
    return this.compradorService.getPerfil(req.user.userId);
  }

  @Post('direccion')
  updateDireccion(@Req() req, @Body('direccion') direccion: string) {
    return this.compradorService.updateDireccion(req.user.userId, direccion);
  }

  @Post('pedidos')
  crearPedido(@Req() req, @Body() dto: CreatePedidoDto) {
    return this.compradorService.crearPedido(req.user.userId, dto);
  }

  @Get('pedidos')
  getPedidos(@Req() req) {
    return this.compradorService.getPedidos(req.user.userId);
  }

  @Get('productos')
  async getProductosDisponibles() {
    return this.compradorService.getProductosDisponibles();
  }

  /*@Post('valoraciones')
  crearValoracion(@Req() req, @Body() dto: CreateValoracionDto) {
    return this.compradorService.crearValoracion(req.user.userId, dto);
  }*/
}
