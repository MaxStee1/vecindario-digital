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

    // Si no existe o la contraseña no coincide, erro
    if(!user || !(await comparePasswords(dto.password, user.contrasenia))) {
      throw new UnauthorizedException('Credenciales incorrectas');
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

    // generar token JWT
    const token = this.jwtService.sign({
      id: user.id,
      email: user.email,
      rol: user.rol,
    });

    return { token };
  }

  /*
  async register(data: { 
    email: string; 
    password: string; 
    nombre: string; 
    direccion?: string; 
    telefono?: string;
    rol?: Rol;  // Rol opcional, por defecto comprador
  }) {
    const hashedPassword = await hashPassword(data.password);
    
    // datos base del usuario
    const userData = {
      email: data.email,
      contrasenia: hashedPassword,
      nombre: data.nombre,
      direccion: data.direccion,
      telefono: data.telefono,
      rol: data.rol || 'comprador',
    }

    // crear usuario con relaciones segun rol
    const user = await this.prisma.usuario.create({
      data: {
        ...userData,
        // si es comprador (o no se especifica rol)
        ...(data.rol === 'comprador' || !data.rol ? {
          comprador: {
            create: {
              direccionEntrega: data.direccion
            }
          }
        } : {}),
        // si es locatario
        ...(data.rol === 'locatario' ? {
          locatario: {
            create: {
              nombreTienda: `Tienda de ${data.nombre}`,
              direccionTienda: data.direccion || '',
              puntajeVisibilidad: 100,
              fechaRegistro: new Date(),
              metodosEntrega: []
            }
          }
        } : {})
      },
      include: {
        comprador: true,
        locatario: true
      }
    });

    return this.generateToken(user);
  }
  */

  /*
  async login(email: string, password: string) {
    const user = await this.prisma.usuario.findUnique({ where: { email },
      include: {
        comprador: true,
        locatario: true
      }
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const passwordMatch = await comparePasswords(password, user.contrasenia);
    if (!passwordMatch) { 
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const token = this.generateToken(user);
    const rol = user.rol;
    return {
      token,
      rol
    };
  }
  */

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
