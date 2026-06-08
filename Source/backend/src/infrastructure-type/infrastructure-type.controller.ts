import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { InfrastructureTypeService } from './infrastructure-type.service';
import { CreateInfrastructureTypeDto } from './dto/create-infrastructure-type.dto';
import { UpdateInfrastructureTypeDto } from './dto/update-infrastructure-type.dto';

@Controller('infrastructure-type')
export class InfrastructureTypeController {
  constructor(private readonly service: InfrastructureTypeService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateInfrastructureTypeDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateInfrastructureTypeDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}