import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { hashPassword, comparePasswords } from 'src/utils/hash';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async register(data: { email: string; password: string; firstName: string; lastName: string }) {
    const hashedPassword = await hashPassword(data.password);
    
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        userRoles: {
          create: {
            role: {
              connect: { name: 'comprador' } // rol por defecto
            }
          }
        }
      },
      include: { userRoles: true }
    });

    return this.generateToken(user.id, user.email);
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Usuario no encontrado');

    const passwordMatch = await comparePasswords(password, user.password);
    if (!passwordMatch) throw new UnauthorizedException('Contraseña incorrecta');

    return this.generateToken(user.id, user.email);
  }

  private generateToken(userId: number, email: string) {
    const payload = { sub: userId, email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
