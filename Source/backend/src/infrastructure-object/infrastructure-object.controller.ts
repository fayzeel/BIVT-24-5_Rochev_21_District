import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { InfrastructureObjectService } from './infrastructure-object.service';
import { CreateInfrastructureObjectDto } from './dto/create-infrastructure-object.dto';
import { UpdateInfrastructureObjectDto } from './dto/update-infrastructure-object.dto';

@Controller('infrastructure-object')
export class InfrastructureObjectController {
  constructor(private readonly service: InfrastructureObjectService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateInfrastructureObjectDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateInfrastructureObjectDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}