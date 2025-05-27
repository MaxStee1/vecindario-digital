import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateProductoDto } from "./dto/create-producto.dto";
import { UpdateProductoDto } from "./dto/update-producto.dto";

@Injectable()
export class LocatariosService {
  constructor(private prisma: PrismaService) {}

  // Productos
  async getLocatarioProducts(userId: number) {
    const locatario = await this.prisma.locatario.findUnique({
      where: { usuarioId: userId },
      include: { productos: true },
    });

    if (!locatario) throw new NotFoundException('locatario no encontrado');
    return locatario.productos;
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
      data: dto,
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

  private async ValidateProductOwnership(userId: number, productId: number) {
    const product = await this.prisma.producto.findFirst({
      where: {
        id: productId,
        locatario: { usuarioId: userId },
      },
    });
    if (!product) throw new NotFoundException('Producto no encontrado');
  }
}