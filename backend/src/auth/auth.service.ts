import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { hashPassword, comparePasswords } from 'src/utils/hash';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async login(dto: LoginDto) {
    // Buscar usuario por email
    const user = await this.prisma.usuario.findUnique({
      where: { email: dto.email },
    });

    // Si no existe o la contraseña no coincide, error
    if(!user || !(await comparePasswords(dto.password, user.contrasenia))) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // Si el usuario está eliminado, error
    if (user.eliminado) {
      throw new UnauthorizedException('Usuario eliminado');
    }

    // generar token JWT
    const token = this.jwtService.sign({
      id: user.id,
      email: user.email,
      rol: user.rol,
    });

    return {
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
      }
    };
  }

  async register(dto: RegisterDto) {
    // encriptar contraseña
    const hashedPassword = await hashPassword(dto.password);
  
    // guardar usuario en la DB
    const user = await this.prisma.usuario.create({
      data: {
        nombre: dto.nombre,
        email: dto.email,
        contrasenia:hashedPassword,
        rol: dto.rol,
      },
    });

    switch (dto.rol) {
      case 'locatario':
        await this.prisma.locatario.create({
          data: {
            usuarioId: user.id,
            nombreTienda: "Tienda de" + dto.nombre,
            direccionTienda: "sin direccion",
          },
        });
        break;
      case 'comprador':
        await this.prisma.comprador.create({
          data: {
            usuarioId: user.id,
            direccionEntrega: "sin direccion",
          },
        });
        break;
      case 'repartidor':
        await this.prisma.repartidor.create({
          data: {
            usuarioId: user.id,
          },
        });
        break;
      default:
        throw new UnauthorizedException('Rol no valido');
    }

    // generar token JWT
    const token = this.jwtService.sign({
      id: user.id,
      email: user.email,
      rol: user.rol,
    });

    return { token };
  }

  async validateUserById(userId: number) {
    return this.prisma.usuario.findUnique({
      where: { id: userId},
      select: {
        id: true,
        email: true,
        rol: true,
        nombre: true
      }
    });
  }

}
