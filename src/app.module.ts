import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { S3Module } from './s3/s3.module';
import { S3Service } from './s3/s3.service';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    S3Module,
	AuthModule,
	PrismaModule,
  ],
  controllers: [AppController],
  providers: [S3Service, PrismaService],
})
export class AppModule {}
