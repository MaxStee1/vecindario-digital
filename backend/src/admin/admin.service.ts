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
    const [
        totalVentas,
        pedidosPorEstado,
        localesActivos,
        totalLocatarios,
        totalCompradores,
        totalRepartidores,
        totalUsuarios,
        topProductos
    ] = await Promise.all([
        this.prisma.pedido.aggregate({
            _sum: { total: true },
            where: { estado: 'entregado'},
        }),
        this.prisma.pedido.groupBy({
            by: ['estado'],
            _count: { _all: true },
        }),
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
        this.prisma.usuario.count({
            where: { eliminado: false }
        }),
        // Top 5 productos más vendidos
        this.prisma.pedidoProducto.groupBy({
            by: ['productoId'],
            _sum: { cantidad: true },
            orderBy: { _sum: { cantidad: 'desc' } },
            take: 5,
        })
    ]);

    // Obtener nombres de productos para el top
    const productoIds = topProductos.map(tp => tp.productoId);
    const productos = await this.prisma.producto.findMany({
        where: { id: { in: productoIds } }
    });
    const topProductosConNombre = topProductos.map(tp => ({
        nombre: productos.find(p => p.id === tp.productoId)?.nombre || 'Desconocido',
        cantidadVendida: tp._sum.cantidad || 0
    }));

    return {
        totalVentas: totalVentas._sum.total || 0,
        pedidosPorEstado,
        localesActivos,
        totalLocatarios,
        totalCompradores,
        totalRepartidores,
        totalUsuarios,
        topProductos: topProductosConNombre
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

    async getTopLocatariosPorProductos(limit: number = 5) {
        const productosPorLocatario = await this.prisma.producto.groupBy({
            by: ['locatarioId'],
            _count: { id: true },
            orderBy: { _count: { id: 'desc' } },
            take: limit,
        });

        const locatarioIds = productosPorLocatario.map(v => v.locatarioId);
        const locatarios = await this.prisma.locatario.findMany({
            where: { id: { in: locatarioIds } },
            include: { usuario: true }
        });

        return productosPorLocatario.map(v => ({
            nombre: locatarios.find(l => l.id === v.locatarioId)?.usuario?.nombre || 'Desconocido',
            cantidadProductos: v._count.id
        }));
    }

}