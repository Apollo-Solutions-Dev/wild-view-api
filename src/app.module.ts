import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { S3Module } from './s3/s3.module';
import { S3Service } from './s3/s3.service';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    S3Module,
  ],
  controllers: [AppController],
  providers: [S3Service],
})
export class AppModule {}
