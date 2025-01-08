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
import { FileInterceptor } from '@nestjs/platform-express';
import { PrismaService } from './prisma/prisma.service';
import * as bcrypt from 'bcrypt';

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

  @Post('upload')
  async uploadFile(@Body() jsonData: any) {
	const result = await this.s3Service.uploadFile(
	  Buffer.from(JSON.stringify(jsonData)),
	  'v1.5/image_points'
	);
	return { status: 'success', data: result };
  }

  @Post('get-video-upload-url')
  async getVideoUploadUrl(@Body() body: { fileName: string }) {
    const uploadUrl = await this.s3Service.getVideoUploadUrl(body.fileName);
    return { uploadUrl };
  }
}
