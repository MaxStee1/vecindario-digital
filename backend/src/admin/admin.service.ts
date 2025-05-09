import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Rol } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // obtener usuarios por rol
  async getUsersByRole(rol: Rol) {
    return this.prisma.usuario.findMany({
        where: { rol },
        select: {
            id: true,
            nombre: true,
            email: true,
            rol: true,
            direccion: true,
            telefono: true,
            CreatedAt: true,
        },
    });
  }

  async getAllUsers() {
    return this.prisma.usuario.findMany({
        select: {
            id: true,
            nombre: true,
            email: true,
            rol: true,
            direccion: true,
            telefono: true,
            CreatedAt: true,
        }
    })
  }

  // actualizar datos de usuario
  async updateUser(userId: number, data: { nombre?: string; direccion?: string }) {
    return this.prisma.usuario.update({
        where: { id: userId },
        data: {
            nombre: data.nombre,
            direccion: data.direccion,
            updatedAt: new Date(),
        }
    });
  }

  // metricas de venta
  async getSalesMetrics() {
    const [totalVentas, pedidosPorEstado, topLocatarios] = await Promise.all([
        this.prisma.pedido.aggregate({
            _sum: { total: true },
            where: { estado: 'entregado'},
        }),

        this.prisma.pedido.groupBy({
            by: ['estado'],
            _count: { _all: true },
        }),

        this.prisma.locatario.findMany({
            take: 5,
            orderBy: { productos: { _count: 'desc'} },
            include: {
                usuario: { select: { nombre: true } },
                productos: { select: { nombre: true }},
            },
        }),
    ]);

    return {
        totalVentas: totalVentas._sum.total || 0,
        pedidosPorEstado,
        topLocatarios,
    };
  }
}