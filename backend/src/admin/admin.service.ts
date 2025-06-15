import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Rol } from '@prisma/client';
import { hashPassword } from 'src/utils/hash';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // obtener usuarios por rol
  async getUsersByRole(rol: Rol) {
    return this.prisma.usuario.findMany({
        where: { rol, eliminado: false },
        orderBy: { id: 'asc' },
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
        where: { eliminado: false },
        orderBy: { id: 'asc' },
        select: {
            id: true,
            nombre: true,
            email: true,
            rol: true,
            direccion: true,
            telefono: true,
            CreatedAt: true,
        },

    })
  }

  // actualizar datos de usuario
  async updateUser(userId: number, data: { nombre?: string; direccion?: string, email?: string }) {
    return this.prisma.usuario.update({
        where: { id: userId },
        data: {
            nombre: data.nombre,
            direccion: data.direccion,
            email: data.email,
            updatedAt: new Date(),
        }
    });
  }

  // eliminar usuario
  async deleteUser(userId: number) {
    const usuario = await this.prisma.usuario.findUnique({
        where: { id: userId },
        select: { rol: true },
    });

    if (!usuario) {
        throw new Error('Usuario no encontrado');
    }

    return this.prisma.usuario.update({
        where: { id: userId },
        data: { eliminado: true },
    });

  }


  // metricas de venta
  async getSalesMetrics() {
    const [totalVentas, pedidosPorEstado, localesActivos, totalLocatarios, totalCompradores, totalRepartidores] = await Promise.all([
        this.prisma.pedido.aggregate({
            _sum: { total: true },
            where: { estado: 'entregado'},
        }),

        this.prisma.pedido.groupBy({
            by: ['estado'],
            _count: { _all: true },
        }),

        /*
        this.prisma.locatario.findMany({
            where: { usuario: { eliminado: false } },
            take: 5,
            orderBy: { productos: { _count: 'desc'} },
            include: {
                usuario: { select: { nombre: true } },
                productos: { select: { nombre: true }},
            },
        }),
        */
       this.prisma.locatario.count({
        where: { usuario: { eliminado: false } }, 
       }),

        this.prisma.locatario.count({
            where: { usuario: { eliminado: false } },
        }),

        this.prisma.comprador.count({
            where: { usuario : { eliminado: false } },
        }),

        this.prisma.repartidor.count({
            where: { usuario: { eliminado: false } },
        }),

    ]);

    return {
        totalVentas: totalVentas._sum.total || 0,
        pedidosPorEstado,
        localesActivos,
        totalLocatarios,
        totalCompradores,
        totalRepartidores,
    };
  }

    async createAdmin(data: { name: string; email: string; password: string }) {
        const hashedPassword = await hashPassword(data.password);
        return this.prisma.usuario.create({
            data: {
                nombre: data.name,
                email: data.email,
                contrasenia: hashedPassword,
                rol: 'admin',
            },
        });
    }

    async createUser(data: { nombre: string; email: string; password: string; rol: Rol }) {
        const hashedPassword = await hashPassword(data.password);
        const usuario = await this.prisma.usuario.create({
            data: {
                nombre: data.nombre,
                email: data.email,
                contrasenia: hashedPassword,
                rol: data.rol,
            },
        });
        switch (data.rol) {
            case 'locatario':
                await this.prisma.locatario.create({
                  data: {
                    usuarioId: usuario.id,
                    nombreTienda: "Tienda de" + usuario.nombre,
                    direccionTienda: "sin direccion",
                  },
                });
                break;
            case 'comprador':
                await this.prisma.comprador.create({
                  data: {
                    usuarioId: usuario.id,
                    direccionEntrega: "sin direccion",
                  },
                });
                break;
            case 'repartidor':
                await this.prisma.repartidor.create({
                    data: {
                        usuarioId: usuario.id,
                    }
                });
                break;
            case 'admin':
                // No pasa nada, ya que el admin no tiene datos adicionales
                break;
            default:
                throw new Error('Rol no valido');
        }
    }

}