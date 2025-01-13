import { Controller, Get } from '@nestjs/common';
import { VideosService } from './videos.service';

@Controller('videos')
export class VideosQueryController {
  constructor(private readonly videosService: VideosService) {}

  @Get()
  findAll() {
    return this.videosService.findAll();
  }
}
