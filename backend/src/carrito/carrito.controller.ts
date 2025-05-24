import { Controller, Post, Delete, Body, Param, Get, Patch } from '@nestjs/common';
import { CarritoService } from './carrito.service';
import { CreateCarritoItemDto } from './dto/create-carrito-item.dto';
import { UpdateCarritoItemDto } from './dto/update-carrito-item.dto';

@Controller('carrito')
export class CarritoController {
  constructor(private readonly carritoService: CarritoService) {}

  @Post('agregar')
  agregar(@Body() dto: CreateCarritoItemDto) {
    return this.carritoService.agregarProducto(dto);
  }

  @Delete('eliminar/:usuarioId/:productoId')
  eliminar(@Param('usuarioId') usuarioId: string, @Param('productoId') productoId: string) {
    return this.carritoService.eliminarProducto(+usuarioId, +productoId);
  }

  @Get(':usuarioId')
  obtener(@Param('usuarioId') usuarioId: string) {
    return this.carritoService.obtenerCarrito(+usuarioId);
  }

  @Patch('actualizar/:usuarioId/:productoId')
  actualizar(
    @Param('usuarioId') usuarioId: string,
    @Param('productoId') productoId: string,
    @Body() dto: UpdateCarritoItemDto,
  ) {
    return this.carritoService.actualizarCantidad(+usuarioId, +productoId, dto);
  }
}