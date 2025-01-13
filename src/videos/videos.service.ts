import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class VideosService {
  constructor(private prisma: PrismaService) {}

  async create(data: { title: string; key: string }) {
    try {
      return await this.prisma.video.create({
        data,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          const existingVideo = await this.prisma.video.findUnique({
            where: { key: data.key },
          });
          return existingVideo;
        }
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.video.findMany();
  }

  async findOne(id: string) {
    return this.prisma.video.findUnique({
      where: { id },
    });
  }

  async remove(id: string) {
    return this.prisma.video.delete({
      where: { id },
    });
  }
}
