import { Controller, Get, Param, Put, Delete, Body, UseGuards } from '@nestjs/common';
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
  getUserByRole(@Param('rol') rol: Rol) {
    return this.adminService.getUsersByRole(rol);
  }

  @Get('users')
  @Roles('admin')
  getUsers() {
    return this.adminService.getAllUsers();
  }

  @Put('users/:id')
  updateUser(
    @Param('id') id: string,
    @Body() data: { nombre?: string; direccion?: string },
  ) {
    return this.adminService.updateUser(Number(id), data);
  }

  @Get('metrics')
  getMetrics() {
    return this.adminService.getSalesMetrics();
  }

  // editar usuario
  @Put('users/edit/:id')
  async editUser(
    @Param('id') id: string,
    @Body() data: { nombre?: string; direccion?: string },
  ) {
    const userId = Number(id);
    return this.adminService.updateUser(userId, data);
  }

}
