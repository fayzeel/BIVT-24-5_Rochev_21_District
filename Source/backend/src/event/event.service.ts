import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly repo: Repository<Event>,
  ) {}

findAll(): Promise<Event[]> {
  return this.repo.find({
    relations: {
      district: true,
    },
    order: { event_date: 'ASC' },
  });
}

async findOne(id: number): Promise<Event> {
  const item = await this.repo.findOne({
    where: { id },
    relations: {
      district: true,
    },
  });
  if (!item) {
    throw new NotFoundException(`Событие с ID ${id} не найдено`);
  }
  return item;
}

  create(dto: CreateEventDto): Promise<Event> {
    const item = this.repo.create(dto);
    return this.repo.save(item);
  }

  async update(id: number, dto: UpdateEventDto): Promise<Event> {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.repo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Событие с ID ${id} не найден`);
    }
  }
}