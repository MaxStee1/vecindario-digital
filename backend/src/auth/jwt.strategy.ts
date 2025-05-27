import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(), // Permite usar Authorization: Bearer <token>
        (req: Request) => req?.cookies?.token,    // Permite usar cookie 'token'
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'supersecret',
    });
  }

  validate(payload: { id: number, email: string, rol: string }) {
    return {
      userId: payload.id,
      email: payload.email,
      rol: payload.rol,
    };
  }
}