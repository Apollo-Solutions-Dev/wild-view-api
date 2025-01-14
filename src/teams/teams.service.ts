import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { randomBytes } from 'crypto';

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) {}

  async create(data: { name: string }) {
    const team = await this.prisma.team.findFirst({
      where: {
        name: data.name,
      },
    });

    if (team) {
      throw new Error('Team already exists');
    }

    const id = randomBytes(16).toString('hex');

    return this.prisma.team.create({
      data: {
        id,
        name: data.name,
      },
    });
  }

  async findStaff(id: string) {
    return this.prisma.team.findUnique({
      where: { id },
      include: {
        staffs: {
          include: {
            staff: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.team.findMany({
      include: {
        staffs: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.team.findUnique({
      where: { id },
      include: {
        staffs: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.team.delete({
      where: { id },
    });
  }

  async update(id: string, data: { name: string }) {
    return this.prisma.team.update({
      where: { id },
      data,
    });
  }

  async findTeamStaff(id: string) {
    const team = await this.prisma.team.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        staffs: {
          select: {
            staff: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
      },
    });

    return {
      ...team,
      staffs: team.staffs.map((s) => s.staff),
    };
  }
}

//trazer todos os staff
