import { Injectable } from '@nestjs/common';
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
  private s3Client: S3Client;

  constructor() {
	this.s3Client = new S3Client({
		region: process.env.AWS_REGION,
		credentials: {
			accessKeyId: process.env.AWS_ACCESS_KEY_ID,
			secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
		},
	})
  }

  async getSignedUrl(key: string) {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    });
    
    return await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
  }

  async uploadFile(file: Buffer, folderName: string) {
	console.log(process.env.AWS_BUCKET_NAME)
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${folderName}/${Date.now()}`,
      Body: file,
    };

    return await this.s3Client.send(new PutObjectCommand(params));
  }
}
