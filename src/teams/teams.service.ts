import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) {}

  async create(data: { name: string; videoId: string }) {
    return this.prisma.team.create({
      data,
      include: { video: true },
    });
  }

  async findAll() {
    return this.prisma.team.findMany({
      include: { video: true },
    });
  }

  async findOne(id: string) {
    return this.prisma.team.findUnique({
      where: { id },
      include: { video: true },
    });
  }

  async remove(id: string) {
    return this.prisma.team.delete({
      where: { id },
    });
  }

  async findStaff(id: string) {
    const teams = await this.prisma.team.findUnique({
      where: { id },
      include: { staffs: true },
    });
    return teams.staffs ?? [];
  }
}
