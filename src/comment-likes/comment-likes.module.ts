import { Module } from '@nestjs/common';
import { CommentLikesService } from './services/comment-likes.service';
import { CommentLikesController } from './controllers/comment-likes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { CommentsModule } from 'src/comments/comments.module';
import { CommentLikesEntity } from './models/commentLikes.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentLikesEntity]),
    AuthModule,
    CommentsModule
  ],
  providers: [CommentLikesService],
  controllers: [CommentLikesController]
})
export class CommentLikesModule {}
