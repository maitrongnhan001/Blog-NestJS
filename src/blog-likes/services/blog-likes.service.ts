import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { from, map, Observable, switchMap } from 'rxjs';
import { BlogEntry } from 'src/blog/models/blog-entry.interface';
import { BlogService } from 'src/blog/service/blog.service';
import { User } from 'src/user/models/user.interface';
import { Repository } from 'typeorm';
import { BlogLikesEntity } from '../models/blogLikes.entity';
import { BlogLikes } from '../models/blogLikes.interface';

@Injectable()
export class BlogLikesService {

    constructor(
        @InjectRepository(BlogLikesEntity) private readonly blogLikesRepository: Repository<BlogLikesEntity>,
        private blogService: BlogService
    ) { }

    addLike(blogId: number, user: User): Observable<BlogLikes> {
        return this.blogService.findOne(blogId).pipe(
            switchMap((blog: BlogEntry) => {
                blog.likes++;
                return this.blogService.updateOne(blogId, blog).pipe(
                    switchMap((blog: BlogEntry) => {
                        const blogLikes: BlogLikes = {
                            userId: user,
                            blogId: blog
                        };

                        return this.blogLikesRepository.save(
                            blogLikes
                        );

                    })
                );
            })
        );
    }

    getByBlog(id: number, options: IPaginationOptions): Observable<Pagination<BlogLikes>> {
        return from(
            paginate<any>(
                this.blogLikesRepository,
                options,
                {
                    select: ['id'],
                    where: {blogId: {id: id}},
                    relations: ['userId', 'blogId']
                }
            )
        ).pipe(
            map(blogLikes => blogLikes)
        );
    }

    getByUser(id: number, options: IPaginationOptions): Observable<Pagination<BlogLikes>> {
        return from(
            paginate<any>(
                this.blogLikesRepository,
                options,
                {
                    select: ['id'],
                    where: {userId: {id: id}},
                    relations: ['userId', 'blogId']
                }
            )
        ).pipe(
            map(blogLikes => blogLikes)
        );
    }

    deleteLike(user: User, blogId: number): Observable<any> {
        return this.blogService.findOne(blogId).pipe(
            switchMap((blog: BlogEntry) => {
                blog.likes--;
                return this.blogService.updateOne(blogId, blog).pipe(
                    switchMap(() => {
                        return this.blogLikesRepository.delete({
                            userId: user,
                            blogId: blog
                        });
                    })
                );
            })
        )
    }
}
