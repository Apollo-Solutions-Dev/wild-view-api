import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { randomBytes } from 'crypto';

@Injectable()
export class StaffService {
  constructor(private prisma: PrismaService) {}

  async create(data: { name: string; imageUrl?: string }) {
    const id = randomBytes(16).toString('hex');

    return this.prisma.staff.create({
      data: {
        id,
        name: data.name,
        imageUrl: data.imageUrl,
      },
    });
  }

  async findAll() {
    return this.prisma.staff.findMany({
      select: {
        id: true,
        name: true,
        imageUrl: true,
        teams: {
          select: {
            id: true,
          },
        },
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.staff.findUnique({
      where: { id },
    });
  }

  async remove(id: string) {
    return this.prisma.staff.delete({
      where: { id },
    });
  }
}
