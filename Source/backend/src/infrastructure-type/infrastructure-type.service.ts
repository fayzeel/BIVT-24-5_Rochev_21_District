import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InfrastructureType } from './infrastructure-type.entity';
import { CreateInfrastructureTypeDto } from './dto/create-infrastructure-type.dto';
import { UpdateInfrastructureTypeDto } from './dto/update-infrastructure-type.dto';

@Injectable()
export class InfrastructureTypeService {
  constructor(
    @InjectRepository(InfrastructureType)
    private readonly repo: Repository<InfrastructureType>,
  ) {}

  findAll(): Promise<InfrastructureType[]> {
    return this.repo.find({ order: { name: 'ASC' } });
  }

  async findOne(id: number): Promise<InfrastructureType> {
    const item = await this.repo.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException(`Тип инфраструктуры с ID ${id} не найден`);
    }
    return item;
  }

  create(dto: CreateInfrastructureTypeDto): Promise<InfrastructureType> {
    const item = this.repo.create(dto);
    return this.repo.save(item);
  }

  async update(id: number, dto: UpdateInfrastructureTypeDto): Promise<InfrastructureType> {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.repo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Тип инфраструктуры с ID ${id} не найден`);
    }
  }
}