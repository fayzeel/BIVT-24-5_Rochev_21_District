import { PartialType } from '@nestjs/mapped-types';
import { CreateInfrastructureTypeDto } from './create-infrastructure-type.dto';

export class UpdateInfrastructureTypeDto extends PartialType(CreateInfrastructureTypeDto) {}