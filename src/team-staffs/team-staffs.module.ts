import { Module } from '@nestjs/common';
import { TeamStaffsController } from './team-staffs.controller';
import { TeamStaffsService } from './team-staffs.service';

@Module({
  controllers: [TeamStaffsController],
  providers: [TeamStaffsService],
})
export class TeamStaffsModule {}
