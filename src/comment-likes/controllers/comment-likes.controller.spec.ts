import { Test, TestingModule } from '@nestjs/testing';
import { CommentLikesController } from './comment-likes.controller';

describe('CommentLikesController', () => {
  let controller: CommentLikesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentLikesController],
    }).compile();

    controller = module.get<CommentLikesController>(CommentLikesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
