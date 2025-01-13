import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StaffService {
  constructor(private prisma: PrismaService) {}

  async create(data: { name: string; key: string }) {
    return this.prisma.staff.create({ data });
  }

  async findAll() {
    return this.prisma.staff.findMany();
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
