import { Test, TestingModule } from '@nestjs/testing';
import { InfrastructureObjectController } from './infrastructure-object.controller';

describe('InfrastructureObjectController', () => {
  let controller: InfrastructureObjectController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InfrastructureObjectController],
    }).compile();

    controller = module.get<InfrastructureObjectController>(InfrastructureObjectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
