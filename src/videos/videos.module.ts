import { Module } from '@nestjs/common';
import { VideosController } from './videos.controller';
import { VideosService } from './videos.service';
import { VideosQueryController } from './videos-query.controller';

@Module({
  controllers: [VideosController, VideosQueryController],
  providers: [VideosService],
})
export class VideosModule {}
