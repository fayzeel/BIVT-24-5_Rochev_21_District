import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InfrastructureTypeController } from './infrastructure-type.controller';
import { InfrastructureTypeService } from './infrastructure-type.service';
import { InfrastructureType } from './infrastructure-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InfrastructureType])],
  controllers: [InfrastructureTypeController],
  providers: [InfrastructureTypeService],
  exports: [InfrastructureTypeService],
})
export class InfrastructureTypeModule {}