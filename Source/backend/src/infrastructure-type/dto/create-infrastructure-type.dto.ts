import { IsString, IsOptional } from 'class-validator';

export class CreateInfrastructureTypeDto {
  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;
}