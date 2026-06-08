import { IsString, IsInt, IsOptional, Min, Max } from 'class-validator';

export class CreateInfrastructureObjectDto {
  @IsString()
  name!: string;

  @IsString()
  address!: string;

  @IsInt()
  @IsOptional()
  @Min(1000)
  @Max(3000)
  foundation_year?: number;

  @IsInt()
  @IsOptional()
  district_id?: number;

  @IsInt()
  @IsOptional()
  type_id?: number;
}