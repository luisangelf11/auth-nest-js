import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { LocalStrategy } from './strategy/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { SECRET } from 'constants/jwt-key';
import { JwtStrategy } from './strategy/jwt.strategy';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: SECRET,
      signOptions: { expiresIn: '8hrs' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, LocalStrategy, JwtStrategy, PrismaService],
})
export class AuthModule {}
