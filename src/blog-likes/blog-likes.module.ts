import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { BlogModule } from 'src/blog/blog.module';
import { BlogLikesController } from './controllers/blog-likes.controller';
import { BlogLikesEntity } from './models/blogLikes.entity';
import { BlogLikesService } from './services/blog-likes.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([BlogLikesEntity]),
        AuthModule,
        BlogModule
    ],
    controllers: [BlogLikesController],
    providers: [BlogLikesService]
})
export class BlogLikesModule {}
