import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateProductoDto } from "./dto/create-producto.dto";
import { UpdateProductoDto } from "./dto/update-producto.dto";
import { UpdateLocatarioDto } from "./dto/update-locatario.dto";

@Injectable()
export class LocatariosService {
  constructor(private prisma: PrismaService) {}

  // Productos
  async getLocatarioProducts(userId: number) {
    const locatario = await this.prisma.locatario.findUnique({
      where: { usuarioId: userId },
      include: { 
        productos: {
          orderBy: { id: 'asc' },
          include: {
            valoraciones: true,
          }
        } 
      },
    });

    if (!locatario) throw new NotFoundException('locatario no encontrado');

    const productosConPromedio = locatario.productos.map(producto => {
      const valoraciones = producto.valoraciones || [];
      const promedio = valoraciones.length > 0
        ? valoraciones.reduce((acc, v) => acc + v.calificacion, 0) / valoraciones.length
        : null;
      return {
        ...producto,
        promedioCalificacion: promedio,
      };
    });
    return productosConPromedio;
  }

    async getValoracionesDeProducto(userId: number, productoId: number) {
    // Verifica que el producto pertenezca al locatario
    const producto = await this.prisma.producto.findFirst({
      where: {
        id: productoId,
        locatario: { usuarioId: userId }
      },
      include: {
        valoraciones: {
          include: {
            comprador: { include: { usuario: true } }
          }
        }
      }
    });
    if (!producto) throw new NotFoundException('Producto no encontrado');
    return producto.valoraciones.map(v => ({
      id: v.id,
      calificacion: v.calificacion,
      comentario: v.comentario,
      fecha: v.fecha,
      comprador: v.comprador?.usuario?.nombre || null
    }));
  }

  async getProductById(userId: number, productId: number) {
    return this.prisma.producto.findFirst({
      where: {
        id: productId,
        locatario: { usuarioId: userId },
      },
    });
  }

  async createProduct(userId: number, dto: CreateProductoDto) {
    const locatario = await this.prisma.locatario.findUnique({
      where: { usuarioId: userId },
    });

    if (!locatario) throw new NotFoundException('locatario no encontrado');

    return this.prisma.producto.create({
      data: {
        ...dto,
        locatarioId: locatario.id,
      },
    });
  }

  async updateProduct(
    userId: number,
    productId: number,
    dto: UpdateProductoDto,
  ) {
    // verificar que el producto pertenezca al locatario
    await this.ValidateProductOwnership(userId, productId);

    return this.prisma.producto.update({
      where: { id: productId },
      data: {
        nombre: dto.nombre,
        descripcion: dto.descripcion,
        precio: dto.precio,
        stock: dto.stock,
      }
    });
  }

  async deleteProduct(userId: number, productId: number) {
    // verificar que el producto pertenezca al locatario
    await this.ValidateProductOwnership(userId, productId);

    return this.prisma.producto.delete({
      where: { id: productId },
    });
  }

  async getLocatarioInfo(userId: number) {
    const locatario = await this.prisma.locatario.findUnique({
      where: { usuarioId: userId },
      include: { usuario: true },
    });

    if (!locatario) throw new NotFoundException('locatario no encontrado');
    return locatario;
  }

 async updateLocatarioInfo(
    userId: number,
    dto: UpdateLocatarioDto,
  ) { 
    const locatario = await this.prisma.locatario.findUnique({
      where: { usuarioId: userId },
    });

    if (!locatario) throw new NotFoundException('locatario no encontrado');

    return this.prisma.locatario.update({
      where: { id: locatario.id },
      data: dto,
    });
  }

  private async ValidateProductOwnership(userId: number, productId: number) {
    const product = await this.prisma.producto.findFirst({
      where: {
        id: productId,
        locatario: { usuarioId: userId },
      },
    });
    if (!product) throw new NotFoundException('Producto no encontrado');
  }

  // Proveedores
  async getProveedores(userId: number): Promise<any[]> {
    const locatario = await this.prisma.locatario.findUnique({
      where: { usuarioId: userId },
      include: { proveedores: true },
    });

    if (!locatario) throw new NotFoundException('locatario no encontrado');
    return locatario.proveedores as any[];
  }

  async addProveedor( userId: number, proveedorId: number) {
    const locatario = await this.prisma.locatario.findUnique({
      where: { usuarioId: userId },
    });

    if (!locatario) throw new NotFoundException('locatario no encontrado');

    const proveedor = await this.prisma.proveedor.findUnique({
      where: { id: proveedorId },
    });

    if (!proveedor) throw new NotFoundException('Proveedor no encontrado');

    // Verificar si el proveedor ya está asociado al locatario
    const existingProveedor = await this.prisma.locatario.findFirst({
      where: {
        id: locatario.id,
        proveedores: {
          some: { id: proveedor.id },
        },
      },
    });

    if (existingProveedor) {
      throw new NotFoundException('Proveedor ya asociado al locatario');
    }

    return this.prisma.locatario.update({
      where: { id: locatario.id },
      data: {
        proveedores: {
          connect: { id: proveedor.id },
        },
      },
    })
  }

  async removeProveedor(userId: number, proveedorId: number) {
    const locatario = await this.prisma.locatario.findUnique({
      where: { usuarioId: userId },
    });

    if (!locatario) throw new NotFoundException('locatario no encontrado');

    const proveedor = await this.prisma.proveedor.findUnique({
      where: { id: proveedorId },
      include: { locatarios: true },
    });
    if (!proveedor) throw new NotFoundException('Proveedor no encontrado');

    // Verificar si el proveedor ya está asociado al locatario
    const existingProveedor = await this.prisma.locatario.findFirst({
      where: {
        id: locatario.id,
        proveedores: {
          some: { id: proveedor.id },
        },
      },
    });
    
    if (!existingProveedor) {
      throw new NotFoundException('Proveedor no asociado al locatario');
    }

    return this.prisma.locatario.update({
      where: { id: locatario.id },
      data: {
        proveedores: {
          disconnect: { id: proveedorId },
        },
      },
    });
  }

}