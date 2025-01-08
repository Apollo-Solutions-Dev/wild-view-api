import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findOne(userId: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(userData: User): Promise<User> {
    const existingUser = await this.findByEmail(userData.email);

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    return this.prisma.user.create({
      data: { ...userData, password: hashedPassword },
    });
  }

  async updateUser(userData: User): Promise<User> {
    if (!userData.id) {
      throw new Error('User ID is required for update');
    }

    const updateData = { ...userData };
    const createData = { ...userData, id: undefined };

    if (updateData.password) {
      const hashedPassword = await bcrypt.hash(updateData.password, 10);
      updateData.password = hashedPassword;
    }

    return this.prisma.user.upsert({
      where: { id: userData.id },
      update: updateData,
      create: createData,
    });
  }

  async validateUser(userId: number, clientId: number) {
    const user = await this.findOne(userId);
    if (!user || clientId !== user.id) {
      throw new UnauthorizedException('Unauthorized user');
    }
    return user;
  }
}
