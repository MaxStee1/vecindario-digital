import { Controller, Get, Post, Body, Put, Delete, Param, UseGuards, Req } from '@nestjs/common';
import { LocatariosService } from './locatarios.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { UpdateLocatarioDto } from './dto/update-locatario.dto';

@Controller('locatarios')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LocatariosController {
  constructor(private locatariosService: LocatariosService) {}

  // Crear Producto
  @Post('productos')
  @Roles('locatario')
  createProduct(@Req() req, @Body() dto: CreateProductoDto) {
    return this.locatariosService.createProduct(req.user.userId, dto);
  }

  // listar Productos del locatario
  @Get('productos')
  @Roles('locatario')
  getProducts(@Req() req) {
    return this.locatariosService.getLocatarioProducts(req.user.userId);
  }

  // Obtener un producto por ID
  @Get('productos/:id')
  @Roles('locatario')
  getProductById(@Req() req, @Param('id') productId: string) {
    return this.locatariosService.getProductById(req.user.userId, Number(productId)); 
  }

  // Actualizar Producto
  @Put('productos/:id')
  @Roles('locatario')
  updateProduct(
    @Req() req,
    @Param('id') productId: string,
    @Body() dto: UpdateProductoDto,
  ) {
    return this.locatariosService.updateProduct(
      req.user.userId,
      Number(productId),
      dto,
    );
  }

  @Delete('productos/:id')
  @Roles('locatario')
  deleteProduct(@Req() req, @Param('id') productId: string) {
    return this.locatariosService.deleteProduct(
      req.user.userId,
      Number(productId),
    );
  }

  // obtener informacion del locatario a traves de id de usuario
  @Get('info')
  getLocatarioInfo(@Req() req) {
    return this.locatariosService.getLocatarioInfo(req.user.userId);
  }

  // Actualizar informacion del locatario
  @Put('info')
  updateLocatarioInfo(@Req() req, @Body() dto: UpdateLocatarioDto) {
    return this.locatariosService.updateLocatarioInfo(req.user.userId, dto);
  }

  // obtener Proveedores del locatario
  @Get('proveedores')
  // @Roles('locatario')
  getProveedores(@Req() req) {
    return this.locatariosService.getProveedores(req.user.userId);
  }

  // Agregar un proveedor
  @Put('proveedores/:id')
  // @Roles('locatario')
  addProveedor(@Req() req, @Param('id') proveedorId: string) {
    return this.locatariosService.addProveedor(req.user.userId, Number(proveedorId));
  }

  // Eliminar un proveedor
  @Delete('proveedores/:id')
  // @Roles('locatario')
  removeProveedor(@Req() req, @Param('id') proveedorId: string) {
    return this.locatariosService.removeProveedor(req.user.userId, Number(proveedorId));
  }

  @Get('productos/:id/valoraciones')
  @Roles('locatario')
  getValoracionesDeProductos(@Req() req, @Param('id') id: string) {
    return this.locatariosService.getValoracionesDeProducto(req.user.userId, +id);
  }

}