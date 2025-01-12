import {
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';

@Injectable()
export class S3Service {
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async getSignedUrl(key: string) {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    });

    return await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
  }

  async getVideoUploadUrl(fileName: string) {
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `v1.5/input_videos/${fileName}`,
      ContentType: 'video/*',
    });

    return await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
  }

  async listFiles(prefix: string) {
    console.log('Searching with prefix:', prefix);
    
    const fullPrefix = prefix.startsWith('v1.5/') ? prefix : `v1.5/image_points/${prefix}`;
    console.log('Full prefix:', fullPrefix);

    const command = new ListObjectsV2Command({
      Bucket: process.env.AWS_BUCKET_NAME,
      Prefix: fullPrefix,
    });

    const response = await this.s3Client.send(command);
    
    console.log('S3 Response:', response);

    const files = await Promise.all(
      response.Contents?.map(async (file) => ({
        key: file.Key,
        lastModified: file.LastModified,
        size: file.Size,
        url: await this.getSignedUrl(file.Key),
      })) || [],
    );

    return files;
  }

  async getJsonUploadUrl(fileName: string) {
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `v1.5/image_points/${fileName}`,
      ContentType: 'application/json',
    });

    return await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
  }

  async getFileContent(key: string): Promise<Buffer> {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    });
    
    const response = await this.s3Client.send(command);
    return Buffer.from(await response.Body.transformToByteArray());
  }
}
