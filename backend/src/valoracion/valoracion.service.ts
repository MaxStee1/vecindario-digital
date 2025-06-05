import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateValoracionDto } from './dto/create-valoracion.dto';
import { UpdateValoracionDto } from './dto/update-valoracion.dto';

@Injectable()
export class ValoracionService {
  constructor(private prisma: PrismaService) {}

  // obetner todas las valoraciones
  async getValoraciones() {
    return this.prisma.valoracion.findMany({
        select: {
            id: true,
            comentario: true,
            calificacion: true,
            fecha: true,
            tipoEntrega: true,
            comprador: {
                select: {
                    id: true,
                    usuarioId: true,
                    direccionEntrega: true,
                },
            },
            producto: {
                select: {
                    id: true,
                    nombre: true,
                    descripcion: true,
                    precio: true,
                    locatarioId: true,
                }
            },
        }
    });
  }

  // crear una nueva valoracion
  async createValoracion(createValoracionDto: CreateValoracionDto) {
    // Verificar si el comprador existe
    const compradorExists = await this.prisma.comprador.findUnique({
        where: { id: createValoracionDto.compradorId },
    });
    if (!compradorExists) {
        throw new NotFoundException(`Comprador con id ${createValoracionDto.compradorId} no encontrado`);
    }

    // Verificar si el producto existe
    const productoExiste = await this.prisma.producto.findUnique({
        where: { id: createValoracionDto.productoId },
    })
    if (!productoExiste) {
        throw new NotFoundException(`Producto con id ${createValoracionDto.productoId} no encontrado`);
    }

    return this.prisma.valoracion.create({
        data: {
            compradorId: createValoracionDto.compradorId,
            productoId: createValoracionDto.productoId,
            calificacion: createValoracionDto.calificacion,
            comentario: createValoracionDto.comentario,
            tipoEntrega: createValoracionDto.tipoEntrega,
            fecha: new Date(),
        },
    });
    }

    // actualizar valoracion
    async updateValoracion(id: number, updateValoracionDto: UpdateValoracionDto) {
        const existingValoracion = await this.prisma.valoracion.findUnique({
            where: { id },
        });

        if (!existingValoracion) {
            throw new NotFoundException(`Valoracion con id ${id} no encontrada`);
        }

        return this.prisma.valoracion.update({
            where: { id },
            data: {
                calificacion: updateValoracionDto.calificacion,
                comentario: updateValoracionDto.comentario,
            },
        });
    }

    // eliminar valoracion
    async deleteValoracion(id: number) {
        const existingValoracion = await this.prisma.valoracion.findUnique({
            where: { id },
        });
        if (!existingValoracion) {
            throw new NotFoundException(`Valoracion con id ${id} no encontrada`);
        }

         // Eliminar la valoracion
        return this.prisma.valoracion.delete({
            where: { id },
        });
    }
}
