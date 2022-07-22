import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/guard/jwt-guard';
import { Comments } from '../models/comments.interface';
import { CommentsService } from '../services/comments.service';

@Controller('comments')
export class CommentsController {

    constructor(
        private commentsService: CommentsService
    ) {}

    @UseGuards(JwtAuthGuard)
    @Post(':blogId')
    createComment(
        @Param('blogId') blogId: number,
        @Req() req,
        @Body() comment: Comments   
    ): Observable<Comments> {
        const user = req.user;
        return this.commentsService.createComment(blogId, comment, user);
    }

    @Get('blog/:blogId')
    getByBlog(
        @Param('blogId') blogId: number,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ): Observable<any> {
        return this.commentsService.getByBlog(blogId, {page, limit});
    }

    @Get('comment/:commentId')
    getByComment(
        @Param('commentId') commentId: number,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ): Observable<any> {
        return this.commentsService.getByComment(commentId, {page, limit});
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    delete(@Param('id') id: number): Observable<any> {
        return this.commentsService.delete(id);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    update(
        @Param('id') id: number,
        @Body() comment: Comments
    ): Observable<any> {
        return this.commentsService.update(id, comment);
    }

}
