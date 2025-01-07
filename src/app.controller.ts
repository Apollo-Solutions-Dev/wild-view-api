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


@Controller('api')
export class AppController {
  constructor(private readonly s3Service: S3Service) {}

  @Get('get-file/:key(*)')
  async getFileFromS3(@Param('key') key: string) {
    const signedUrl = await this.s3Service.getSignedUrl(key);
    return { url: signedUrl };
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: any) {
    const result = await this.s3Service.uploadFile(
      file.buffer,
      'v1.5/draw_frame',
    );
    return { status: 'success', data: result };
  }
}

