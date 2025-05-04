import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [AuthModule, PrismaModule, UserModule, AdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
