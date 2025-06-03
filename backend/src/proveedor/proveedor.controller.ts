import { Controller, UseGuards, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { ProveedorService } from './proveedor.service';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto ';

@Controller('proveedor')
//@UseGuards(JwtAuthGuard, RolesGuard)
export class ProveedorController {
  constructor(private proveedorService: ProveedorService) {}

  // Crear Proveedor
  @Post()
  createProveedor(@Body() dto: CreateProveedorDto) {
    return this.proveedorService.createProveedor(dto);
  }

  // Ver proveedores
  @Get()
  getProveedores() {
    return this.proveedorService.getProveedores();
  }

  // Ver proveedores por id
  @Get(':id')
  getProveedorById(@Param('id') id: string) {
    return this.proveedorService.getProveedorById(Number(id));
  }

  // Editar proveedor
  @Put(':id')
  updateProveedor(
  @Param('id') id: string,
  @Body() dto: UpdateProveedorDto,
  ) {
    return this.proveedorService.updateProveedor(Number(id), dto);
  }

  // Eliminar proveedor
  @Delete(':id')
  deleteProveedor(@Param('id') id: string) {
    return this.proveedorService.deleteProveedor(Number(id));
  }

}
