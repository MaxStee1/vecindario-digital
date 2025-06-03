import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { Prisma } from '@prisma/client';
import { UpdateProveedorDto } from './dto/update-proveedor.dto ';

@Injectable()
export class ProveedorService {
  constructor(private prisma: PrismaService) {}

  async createProveedor(dto: CreateProveedorDto) {
    // Verificar primero si existe
  const existe = await this.prisma.proveedor.findUnique({
    where: { email: dto.email }
  });
  
  if (existe) {
    throw new ConflictException('Email ya registrado');
  }
  
  // Si no existe, crear
  return this.prisma.proveedor.create({
    data: {
      nombre: dto.nombre,
      email: dto.email,
    }
  });
  }

  async getProveedores() {
    return this.prisma.proveedor.findMany({
      orderBy: {
        id: 'asc',
      }
    })
  }

  async getProveedorById(id: number) {
    const proveedor = await this.prisma.proveedor.findUnique({
      where: { 
        id: id
      },
    });
    if (!proveedor) {
      throw new ConflictException('Proveedor no encontrado');
    }
    return proveedor;
  }

  async updateProveedor(id: number, dto: UpdateProveedorDto) {
    const prov = await this.prisma.proveedor.findUnique({
      where: { id: id },
    })
    if (!prov) {
      throw new ConflictException('Proveedor no encontrado');
    }
    return this.prisma.proveedor.update({
      where: { id: id },
      data: {
        nombre: dto.nombre,
        email: dto.email,
      },
    });
  }

  async deleteProveedor(id: number) {
    const proveedor = await this.prisma.proveedor.findUnique({
      where: { id: id },
    });
    if (!proveedor) {
      throw new ConflictException('Proveedor no encontrado');
    }
    return this.prisma.proveedor.delete({
      where: { id: id },
    });
  }

}
