import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(body: CreateUserDto) {
    try {
      const salts = await bcrypt.genSalt();
      const hash = await bcrypt.hash(body.password, salts);
      const newUser = await this.prisma.user.create({
        data: { username: body.username, password: hash },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = newUser;
      return result;
    } catch (error) {
      if (error instanceof Error)
        throw new InternalServerErrorException(error.message);
    }
  }

  async findOneUser(username: string) {
    try {
      const user = await this.prisma.user.findFirst({ where: { username } });
      if (user) return user;
      return null;
    } catch (error) {
      if (error instanceof Error)
        throw new InternalServerErrorException(error.message);
    }
  }

  async getUserById(id: number) {
    try {
      const user = await this.prisma.user.findFirst({ where: { id } });
      if (!user)
        throw new NotFoundException(`Usuario con id ${id} no encontrado`);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {password, ...result} = user;
      return result;
    } catch (error) {
      if (error instanceof NotFoundException)
        throw new NotFoundException(error.message);
      if (error instanceof Error)
        throw new InternalServerErrorException(error.message);
    }
  }
}
