import { IsString, IsEmail, IsOptional, IsInt, Min } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Имя должно быть строкой' })
  name!: string;

  @IsEmail({}, { message: 'Некорректный формат email' })
  email!: string;

  @IsOptional()
  @IsInt({ message: 'Возраст должен быть целым числом' })
  @Min(0, { message: 'Возраст не может быть отрицательным' })
  age?: number;
}