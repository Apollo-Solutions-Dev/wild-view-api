import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { S3Module } from './s3/s3.module';
import { S3Service } from './s3/s3.service';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    S3Module,
	AuthModule,
  ],
  controllers: [AppController],
  providers: [S3Service, PrismaService],
})
export class AppModule {}
