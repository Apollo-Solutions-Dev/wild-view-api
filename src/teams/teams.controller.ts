import { Controller, Post, Get, Delete, Body, Param, Patch } from '@nestjs/common';
import { TeamsService } from './teams.service';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  create(@Body() data: { name: string; videoId: string }) {
    return this.teamsService.create(data);
  }

  @Get()
  findAll() {
    return this.teamsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teamsService.remove(id);
  }

  @Get(':id/staffs')
  findStaff(@Param('id') id: string) {
    return this.teamsService.findStaff(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: { name: string }) {
    return this.teamsService.update(id, data);
  }

  @Get(':id/staff')
  findTeamStaff(@Param('id') id: string) {
    return this.teamsService.findTeamStaff(id);
  }
}

// manter create, adicionar patch(mudar o title), traz todos os staffs do team(teams/:teamId/staffs) 