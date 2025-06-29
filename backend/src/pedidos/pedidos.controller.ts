
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Req } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from './dto/create-pedido';
import { AddProductToPedidoDto } from './dto/add-product-pedido';
import { RemoveProductFromPedidoDto } from './dto/remove-product-pedido'; 
//import { UpdateAddressPedidoDto } from './dto/update-address-pedido.dto';
import { FilterPedidoStatusDto } from './dto/filter-pedido-status.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('pedidos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Post()
  @Roles('cliente')
  async crearPedido(@Body() createPedidoDto: CreatePedidoDto, @Req() req: any) {
    const userId = req.user.id;
    return this.pedidosService.create(createPedidoDto, userId);
  }

  @Get()
  @Roles('admin', 'locatario', 'cliente')
  async obtenerTodosLosPedidos(@Query() filterDto: FilterPedidoStatusDto) {
    return this.pedidosService.findAll(filterDto);
  }

  @Get(':id')
  @Roles('admin', 'locatario', 'cliente')
  async obtenerPedidoPorId(@Param('id') id: string) {
    return this.pedidosService.findOne(+id);
  }

  /*---
  ## **Editar Pedido**
  ---

  @Patch(':id/direccion')
  @Roles('cliente', 'locatario')
  async actualizarDireccionPedido(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressPedidoDto) {
    return this.pedidosService.updatePedidoAddress(+id, updateAddressDto);
  }*/

  @Patch(':id/agregar-producto')
  @Roles('cliente', 'locatario')
  async agregarProductoAlPedido(@Param('id') id: string, @Body() addProductDto: AddProductToPedidoDto) {
    return this.pedidosService.addProductToPedido(+id, addProductDto);
  }

  @Patch(':id/eliminar-producto')
  @Roles('cliente', 'locatario')
  async eliminarProductoDelPedido(@Param('id') id: string, @Body() removeProductDto: RemoveProductFromPedidoDto) {
    return this.pedidosService.removeProductFromPedido(+id, removeProductDto);
  }

  /*---
  ## **Ver Estado del Pedido**
  ---*/

  @Get('estado')
  @Roles('admin', 'locatario', 'cliente')
  async obtenerPedidosPorEstado(@Query() filterDto: FilterPedidoStatusDto) {
    return this.pedidosService.findAll(filterDto);
  }

  /*---
  ## **Cancelar Pedido**
  ---*/

  @Patch(':id/cancelar')
  @Roles('cliente', 'locatario')
  async cancelarPedido(@Param('id') id: string) {
    return this.pedidosService.cancelPedido(+id);
  }
}