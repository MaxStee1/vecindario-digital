import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Injectable()
export class ProductosService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateProductoDto) {
    return this.prisma.producto.create({ data });
  }

  findAll() {
    return this.prisma.producto.findMany();
  }

  findOne(id: number) {
    return this.prisma.producto.findUnique({ where: { id } });
  }

  update(id: number, data: UpdateProductoDto) {
    return this.prisma.producto.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.producto.delete({ where: { id } });
  }
}