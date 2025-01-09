import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { S3Service } from './s3/s3.service';
import { PrismaService } from './prisma/prisma.service';
import { FileInterceptor } from '@nestjs/platform-express';

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
  async getJsonUploadUrl(@Body() body: { fileName: string }) {
    const uploadUrl = await this.s3Service.getJsonUploadUrl(body.fileName);
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
