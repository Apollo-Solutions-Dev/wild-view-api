import { Controller, Post, Get, Delete, Body, Param } from '@nestjs/common';
import { TeamStaffsService } from './team-staffs.service';

@Controller('team-staffs')
export class TeamStaffsController {
  constructor(private readonly teamStaffsService: TeamStaffsService) {}

  @Post()
  create(@Body() data: { teamId: string; staffId: string }) {
    return this.teamStaffsService.create(data);
  }

  @Get()
  findAll() {
    return this.teamStaffsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamStaffsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teamStaffsService.remove(id);
  }
}

//