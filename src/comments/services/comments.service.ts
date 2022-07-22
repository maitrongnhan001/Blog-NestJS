import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { from, map, Observable, switchMap } from 'rxjs';
import { BlogEntry } from 'src/blog/models/blog-entry.interface';
import { BlogService } from 'src/blog/service/blog.service';
import { User } from 'src/user/models/user.interface';
import { Repository } from 'typeorm';
import { CommentsEntity } from '../models/comments.entity';
import { Comments } from '../models/comments.interface';

@Injectable()
export class CommentsService {

    constructor(
        @InjectRepository(CommentsEntity) private readonly commentsRepository: Repository<CommentsEntity>,
        private blogService: BlogService
    ) {}

    createComment(blogId: number, comments: Comments, user: User): Observable<Comments> {
        return this.blogService.findOne(blogId).pipe(
            switchMap((blog: BlogEntry) => {
                blog.comments++;
                return this.blogService.updateOne(blogId, blog).pipe(
                    switchMap(() => {
                        comments.author = user;
                        comments.blog = blog;
                        return this.commentsRepository.save(comments);
                    })
                );
            })
        );
    }

    getByBlog(id: number, options: IPaginationOptions):Observable<Pagination<Comments>> {
        return from(paginate<any>(
            this.commentsRepository,
            options,
            {where: {blog: {id: id}}}
        )).pipe(
            map(comments => comments)
        )
    }

    getByComment(id: number, options: IPaginationOptions):Observable<Pagination<Comments>> {
        return from(paginate<any>(
            this.commentsRepository,
            options,
            {where: {replied: id}}
        )).pipe(
            map(comments => comments)
        )
    }

    delete(id: number): Observable<any> {
        return from(this.commentsRepository.findOne(
                {
                    where: {id: id},
                    relations: ['blog']
                }
            )).pipe(
            switchMap((comment: Comments) => {
                console.log(comment)
                const blog: BlogEntry = comment.blog;
                const blogId = blog.id;
                blog.comments--;
                return this.blogService.updateOne(blogId, blog);
            }),
            switchMap(() => {
                return this.commentsRepository.delete(id);
            })
        );
    }

    update(id: number, comment: Comments): Observable<any> {
        return from(this.commentsRepository.update(id, comment));
    }

}
