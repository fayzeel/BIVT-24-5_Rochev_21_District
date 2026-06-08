import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InfrastructureObject } from './infrastructure-object.entity';
import { CreateInfrastructureObjectDto } from './dto/create-infrastructure-object.dto';
import { UpdateInfrastructureObjectDto } from './dto/update-infrastructure-object.dto';

@Injectable()
export class InfrastructureObjectService {
  constructor(
    @InjectRepository(InfrastructureObject)
    private readonly repo: Repository<InfrastructureObject>,
  ) {}

  findAll(): Promise<InfrastructureObject[]> {
  return this.repo.find({
    relations: {
      district: true,
      type: true,
    },
    order: { name: 'ASC' },
  });
}

async findOne(id: number): Promise<InfrastructureObject> {
  const item = await this.repo.findOne({
    where: { id },
    relations: {
      district: true,
      type: true,
    },
  });
  if (!item) {
    throw new NotFoundException(`Объект инфраструктуры с ID ${id} не найден`);
  }
  return item;
}

  create(dto: CreateInfrastructureObjectDto): Promise<InfrastructureObject> {
    const item = this.repo.create(dto);
    return this.repo.save(item);
  }

  async update(id: number, dto: UpdateInfrastructureObjectDto): Promise<InfrastructureObject> {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.repo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Объект инфраструктуры с ID ${id} не найден`);
    }
  }
}