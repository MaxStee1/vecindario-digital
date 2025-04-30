import { Controller, Get, UseGuards } from '@nestjs/common';
import { get } from 'http';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/auth/user.decorator';

@Controller('users')
export class UserController {
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@User() user: any) {
    return { 
        message: 'usuario autenticado',
        user,
    };
  }
}
