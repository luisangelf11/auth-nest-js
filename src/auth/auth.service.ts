import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './user';
import { JwtService } from '@nestjs/jwt';
import { PayloadEntity, PayloadFull } from './payload';
import RefreshTokenDto from './dto/refresh.dto';
import { SECRET } from 'constants/jwt-key';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(body: CreateUserDto) {
    try {
      const user = await this.userService.findOneUser(body.username);
      const matchResult = await bcrypt.compare(
        body.password,
        user?.password ?? '',
      );
      if (user && matchResult) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = user;
        return result;
      }
      return null;
    } catch (error) {
      if (error instanceof Error)
        throw new InternalServerErrorException(error.message);
    }
  }

  login(user: UserEntity) {
    const payload: PayloadEntity = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async refreshToken(body: RefreshTokenDto) {
    try {
      const payload: PayloadFull = await this.jwtService.verifyAsync(
        body.refreshToken,
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { exp, iat, ...result } = payload;
      const refreshToken = await this.jwtService.signAsync(result, {
        secret: SECRET,
        expiresIn: '22hrs',
      });
      return { refreshToken };
    } catch (error) {
      if (error instanceof Error)
        throw new InternalServerErrorException(error.message);
    }
  }
}
