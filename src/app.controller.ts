import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PrismaService } from './prisma/prisma.service';
import { S3Service } from './s3/s3.service';

@Controller('api')
export class AppController {
  constructor(
    private readonly s3Service: S3Service,
    private prisma: PrismaService,
  ) {}

  @Get('list-files/:folder(*)')
  async listFiles(@Param('folder') folder: string) {
    const files = await this.s3Service.listFiles(folder);
    return { files };
  }

  @Post('get-json-upload-url')
  async getJsonUploadUrl(
    @Body()
    body: {
      data: {
        video: string;
        polygons: Array<Array<{ x: number; y: number }>>;
      };
      fileName?: string;
    },
  ) {
    if (!body.data?.polygons) {
      throw new Error('Polygons data is required');
    }
    if (!body.data?.video) {
      throw new Error('Video path is required');
    }

    const fileName = `v1.5/image_points/${body.data.video.split('/').pop()}.json`;
    const uploadUrl = await this.s3Service.getJsonUploadUrl(fileName);
    return { uploadUrl };
  }

  @Post('get-video-upload-url')
  @UseInterceptors(FileInterceptor('file'))
  async getVideoUploadUrl(
    @UploadedFile() file: any,
    @Body('fileName') fileName: string,
  ) {
    try {
      if (!fileName) {
        throw new Error('Filename is required');
      }

      const uploadUrl = await this.s3Service.getVideoUploadUrl(fileName);

      const urlResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: file.buffer,
        headers: {
          'Content-Type': 'video/mp4',
        },
      });

      if (!urlResponse.ok) {
        throw new Error('Failed to upload video');
      }

      return {
        status: 'success',
        message: 'Video uploaded successfully',
        url: urlResponse.url,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message || 'Failed to upload video',
        code: error.code,
      };
    }
  }
}
