import { Controller, Get, Post, Body, Put, Delete, Param, UseGuards, Req } from '@nestjs/common';
import { LocatariosService } from './locatarios.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Controller('locatarios/productos')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('locatario')
export class LocatariosController {
  constructor(private locatariosService: LocatariosService) {}

  // Crear Producto
  @Post()
  createProduct(@Req() req, @Body() dto: CreateProductoDto) {
    return this.locatariosService.createProduct(req.user.userId, dto);
  }

  // listar Productos del locatario
  @Get()
  getProducts(@Req() req) {
    return this.locatariosService.getLocatarioProducts(req.user.userId);
  }

  // Obtener un producto por ID
  @Get(':id')
  getProductById(@Req() req, @Param('id') productId: string) {
    return this.locatariosService.getProductById(req.user.userId, Number(productId)); 
  }

  // Actualizar Producto
  @Put(':id')
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
}