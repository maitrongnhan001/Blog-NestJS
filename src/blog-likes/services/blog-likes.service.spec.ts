import { Test, TestingModule } from '@nestjs/testing';
import { BlogLikesService } from './blog-likes.service';

describe('BlogLikesService', () => {
  let service: BlogLikesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlogLikesService],
    }).compile();

    service = module.get<BlogLikesService>(BlogLikesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
