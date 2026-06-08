import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InfrastructureObjectController } from './infrastructure-object.controller';
import { InfrastructureObjectService } from './infrastructure-object.service';
import { InfrastructureObject } from './infrastructure-object.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InfrastructureObject])],
  controllers: [InfrastructureObjectController],
  providers: [InfrastructureObjectService],
  exports: [InfrastructureObjectService],
})
export class InfrastructureObjectModule {}