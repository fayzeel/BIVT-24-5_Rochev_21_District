import { PartialType } from '@nestjs/mapped-types';
import { CreateInfrastructureObjectDto } from './create-infrastructure-object.dto';

export class UpdateInfrastructureObjectDto extends PartialType(CreateInfrastructureObjectDto) {}