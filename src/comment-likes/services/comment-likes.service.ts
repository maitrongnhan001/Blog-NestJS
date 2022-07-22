import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { from, Observable, switchMap } from 'rxjs';
import { Comments } from 'src/comments/models/comments.interface';
import { CommentsService } from 'src/comments/services/comments.service';
import { User } from 'src/user/models/user.interface';
import { Repository } from 'typeorm';
import { CommentLikesEntity } from '../models/commentLikes.entity';
import { CommentLikes } from '../models/commentLikes.interface';

@Injectable()
export class CommentLikesService {

    constructor(
        @InjectRepository(CommentLikesEntity) private readonly commentLikesRepository: Repository<CommentLikesEntity>,
        private commentsService: CommentsService
    ) {}

    addLike(commentId: number, user: User): Observable<CommentLikes> {
        return this.commentsService.findOne(commentId).pipe(
            switchMap((comment: Comments) => {
                comment.like++;
                return this.commentsService.update(commentId, comment).pipe(
                    switchMap(() => {
                        const commentLikes: CommentLikes = {
                            user: user,
                            comment: comment
                        }

                        return this.commentLikesRepository.save(commentLikes);
                    })
                );
            })
        )
    }

    getByComment(commentId: number, options: IPaginationOptions): Observable<Pagination<CommentLikes>> {
        return from(
            paginate<CommentLikes>(
                this.commentLikesRepository,
                options,
                {
                    where: {comment: {id: commentId}},
                    relations: ['user', 'comment']
                }
            )
        );
    }

    delete(commentLikeId: number): Observable<any> {
        return from(this.commentLikesRepository.findOne({
            where: {id: commentLikeId},
            relations: ['comment']
        })).pipe(
            switchMap((commentLike: CommentLikes) => {
                const commentId = commentLike.comment.id;
                const comment = commentLike.comment;
                comment.like--;
                return this.commentsService.update(commentId, comment);
            }),
            switchMap(() => {
                return this.commentLikesRepository.delete(commentLikeId);
            })
        );
    }
}
