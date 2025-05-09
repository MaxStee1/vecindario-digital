import { Controller, Get, Param, Put, Body, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Rol } from '@prisma/client';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users/:rol')
  getUserByRole(@Param('rol') rol: Rol) {
    return this.adminService.getUsersByRole(rol);
  }

  @Get('users')
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
}
