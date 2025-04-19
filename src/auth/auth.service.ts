import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './user';
import { JwtService } from '@nestjs/jwt';
import { PayloadEntity } from './payload';

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwtService: JwtService) {}

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
}
