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
  async getJsonUploadUrl(@Body() body: { 
    data: { 
      video: string, 
      polygons: Array<Array<{x: number, y: number}>> 
    },
    fileName?: string 
  }) {
    try {
      if (!body.data?.polygons) {
        throw new Error('Polygons data is required');
      }
      if (!body.data?.video) {
        throw new Error('Video path is required');
      }

      const fileName = body.data.video.split('/').pop() + '.json';
      const uploadUrl = await this.s3Service.getJsonUploadUrl(fileName);

      // Actually perform the upload
      const urlResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: JSON.stringify(body.data),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!urlResponse.ok) {
        throw new Error('Failed to upload JSON');
      }

      return {
        status: 'success',
        message: 'JSON uploaded successfully',
        url: fileName
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message || 'Failed to upload JSON',
        code: error.code,
      };
    }
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

  @Get('list-json-files/:folder(*)')
  async listJsonFiles(@Param('folder') folder: string) {
    try {
      // Extract the base filename without path
      const baseFileName = folder.split('/').pop();
      console.log('Base filename:', baseFileName);

      // List all files in the bucket
      const files = await this.s3Service.listFiles('');
      console.log('All files:', files);
      
      // Filter for JSON files that match our video filename
      const jsonFiles = await Promise.all(
        files
          .filter(file => {
            console.log('Checking file:', file.key);
            return file.key.endsWith('.json') && 
                   file.key.includes(baseFileName);
          })
          .map(async (file) => {
            console.log('Fetching content for:', file.key);
            const content = await this.s3Service.getFileContent(file.key);
            return {
              path: file.key,
              content: JSON.parse(content.toString())
            };
          })
      );

      console.log('Matched JSON files:', jsonFiles);
      return { 
        status: 'success',
        files: jsonFiles 
      };
    } catch (error) {
      console.error('Error in listJsonFiles:', error);
      return {
        status: 'error',
        message: error.message || 'Failed to list JSON files',
        code: error.code,
      };
    }
  }
}
