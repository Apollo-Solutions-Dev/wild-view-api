import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TeamStaffsService {
  constructor(private prisma: PrismaService) {}

  async create(data: { teamId: string; staffId: string }) {
    return this.prisma.teamStaff.create({
      data,
      include: {
        team: true,
        staff: true,
      },
    });
  }

  async findAll() {
    return this.prisma.teamStaff.findMany({
      include: {
        team: true,
        staff: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.teamStaff.findUnique({
      where: { id },
      include: {
        team: true,
        staff: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.teamStaff.delete({
      where: { id },
    });
  }
}
