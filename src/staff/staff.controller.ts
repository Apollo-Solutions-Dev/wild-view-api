import { Controller, Post, Get, Delete, Body, Param } from '@nestjs/common';
import { StaffService } from './staff.service';

@Controller('staffs')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  create(@Body() data: { name: string; key: string }) {
    return this.staffService.create(data);
  }

  @Get()
  findAll() {
    return this.staffService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.staffService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.staffService.remove(id);
  }
}

// só precisamos de rotas para: busca por id, create(name, file do staff (pode ser imagem ou video)), adicionar o put para add imagens(staffs/:id/media)
// trazer todas as imagens do staff
