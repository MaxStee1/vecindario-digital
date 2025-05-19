import { Controller, Get, Post, Body, Put, Delete, Param, UseGuards, Req } from '@nestjs/common';
import { LocatariosService } from './locatarios.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

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

}