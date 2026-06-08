import { IsString, IsDate, IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEventDto {
  @IsString()
  name!: string;

  @IsDate()
  @Type(() => Date)
  event_date!: Date;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  district_id!: number;
}