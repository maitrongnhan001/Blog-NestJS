import { Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/guard/jwt-guard';
import { BlogLikes } from '../models/blogLikes.interface';
import { BlogLikesService } from '../services/blog-likes.service';

@Controller('blog-likes')
export class BlogLikesController {

    constructor(
        private blogLikesService: BlogLikesService
    ) {}

    @UseGuards(JwtAuthGuard)
    @Post(':blogId')
    addLike(
        @Param('blogId') blogId: number,
        @Req() req
    ) {
        const user = req.user;
        
        return this.blogLikesService.addLike(blogId, user);
    }

    @Get('blog/:id')
    getByBlog(
        @Param('id') id: number,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ): Observable<Pagination<BlogLikes>> {
        return this.blogLikesService.getByBlog(
            id,
            {
                page: page,
                limit: limit
            }
        );
    }

    @Get('user/:id')
    getByUser(
        @Param('id') id: number,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ): Observable<Pagination<BlogLikes>> {
        return this.blogLikesService.getByUser(
            id,
            {
                page: page,
                limit: limit
            }
        );
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':blogId')
    deleteLike(
        @Param('blogId') blogId: number,
        @Req() req
    ): Observable<any> {
        const user = req.user;
        return this.blogLikesService.deleteLike(user, blogId);
    }
}