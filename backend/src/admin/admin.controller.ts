import { Controller, Get, Param, Put, Delete, Body, UseGuards, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Rol } from '@prisma/client';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';


@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users/:rol')
  @Roles('admin')
  getUserByRole(@Param('rol') rol: Rol) {
    return this.adminService.getUsersByRole(rol);
  }

  @Get('users')
  @Roles('admin')
  getUsers() {
    return this.adminService.getAllUsers();
  }

  @Put('users/:id')
  @Roles('admin')
  updateUser(
    @Param('id') id: string,
    @Body() data: { nombre?: string; direccion?: string, email?: string },
  ) {
    return this.adminService.updateUser(Number(id), data);
  }

  @Get('metrics')
  @Roles('admin')
  getMetrics() {
    return this.adminService.getSalesMetrics();
  }

  @Get('top-locatarios-productos')
  @Roles('admin')
  getTopLocatariosVentas() {
      return this.adminService.getTopLocatariosPorProductos();
  }

  // editar usuario
  @Put('users/edit/:id')
  @Roles('admin')
  async editUser(
    @Param('id') id: string,
    @Body() data: { nombre?: string; direccion?: string },
  ) {
    const userId = Number(id);
    return this.adminService.updateUser(userId, data);
  }

  // eliminar usuario
  @Put('users/delete/:id')
  @Roles('admin')
  deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(Number(id));
  }

  @Post('users')
  @Roles('admin')
  createUser(@Body() data: {nombre: string; email: string; password: string; rol: Rol}) {
    return this.adminService.createUser(data);
  }
}
