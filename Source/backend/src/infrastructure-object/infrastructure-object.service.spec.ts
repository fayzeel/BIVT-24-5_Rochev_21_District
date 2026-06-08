import { Test, TestingModule } from '@nestjs/testing';
import { InfrastructureObjectService } from './infrastructure-object.service';

describe('InfrastructureObjectService', () => {
  let service: InfrastructureObjectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InfrastructureObjectService],
    }).compile();

    service = module.get<InfrastructureObjectService>(InfrastructureObjectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
