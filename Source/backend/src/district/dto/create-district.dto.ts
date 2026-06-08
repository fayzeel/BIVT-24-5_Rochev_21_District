import { IsString, IsInt, IsOptional, Min, Max, IsNumber } from 'class-validator';

export class CreateDistrictDto {
  @IsString()
  name!: string;

  @IsNumber()
  @Min(0)
  area_km2!: number;

  @IsInt()
  @Min(0)
  population!: number;

  @IsInt()
  @Min(1000)
  @Max(3000)
  foundation_year!: number;

  @IsString()
  @IsOptional()
  description?: string;
}