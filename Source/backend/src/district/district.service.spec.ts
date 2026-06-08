import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { District } from './district.entity';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';

@Injectable()
export class DistrictService {
  constructor(
    @InjectRepository(District)
    private readonly districtRepo: Repository<District>,
  ) {}

  findAll(): Promise<District[]> {
    return this.districtRepo.find({
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<District> {
    const district = await this.districtRepo.findOne({ where: { id } });
    if (!district) {
      throw new NotFoundException(`Район с ID ${id} не найден`);
    }
    return district;
  }

  create(createDistrictDto: CreateDistrictDto): Promise<District> {
    const district = this.districtRepo.create(createDistrictDto);
    return this.districtRepo.save(district);
  }

  async update(id: number, updateDistrictDto: UpdateDistrictDto): Promise<District> {
    await this.districtRepo.update(id, updateDistrictDto);
    const updated = await this.findOne(id);
    return updated;
  }

  async remove(id: number): Promise<void> {
    const result = await this.districtRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Район с ID ${id} не найден`);
    }
  }
}