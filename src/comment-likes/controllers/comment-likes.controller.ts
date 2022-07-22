import { Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/guard/jwt-guard';
import { CommentLikes } from '../models/commentLikes.interface';
import { CommentLikesService } from '../services/comment-likes.service';

@Controller('comment-likes')
export class CommentLikesController {

    constructor(
        private commentLikesService: CommentLikesService
    ) {}
    
    @UseGuards(JwtAuthGuard)
    @Post(':commentId')
    addLike(
        @Param('commentId') commentId: number,
        @Req() req
    ): Observable<CommentLikes> {
        const user = req.user;
        return this.commentLikesService.addLike(commentId, user);
    }

    @Get(':commentId')
    getByComment(
        @Param('commentId') commentId: number,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ): Observable<any> {
        return this.commentLikesService.getByComment(commentId, {page, limit});
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    delete(@Param('id') id: number): Observable<any> {
        return this.commentLikesService.delete(id);
    }
}
