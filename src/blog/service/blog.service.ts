import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { from, map, Observable, of, switchMap } from 'rxjs';
import { User } from 'src/user/models/user.interface';
import { UserService } from 'src/user/service/user.service';
import { Repository } from 'typeorm';
import { BlogEntryEntity } from '../models/blog-entry.entity';
import { BlogEntry } from '../models/blog-entry.interface';
const slugify = require('slugify');

@Injectable()
export class BlogService {

    constructor(
        @InjectRepository(BlogEntryEntity) private readonly blogRepository: Repository<BlogEntryEntity>,
        private userService: UserService
    ){}

    create(user: User, blogEntry: BlogEntry): Observable<BlogEntry> {
        blogEntry.author = user;
        return this.generateSlug(blogEntry.title).pipe(
            switchMap((slug: string) => {
                blogEntry.slug = slug;
                return from(this.blogRepository.save(blogEntry));
            })
        )
    }

    generateSlug(title: string): Observable<string> {
        return of(slugify(title));
    }

    findAll(): Observable<BlogEntry[]> {
        return from(this.blogRepository.find({
            relations: ['author']
        }));
    }

    paginateAll(options: IPaginationOptions): Observable<Pagination<BlogEntry>> {
        return from(paginate<any>(
            this.blogRepository, 
            options, 
            { relations: ['author'] }
        )).pipe(
            map((blogEntries: Pagination<BlogEntry>) => {
                return blogEntries;
            })
        );
    }

    paginateByUser(options: IPaginationOptions, id: number): Observable<Pagination<BlogEntry>> {
        return from(
            paginate<any>(
                this.blogRepository,
                options,
                {
                    relations: ['author'],
                    where: { author: {id: id} }
                }
            )
        ).pipe(
            map(blogEntries => blogEntries)
        )
    }

    findByUser(userId: number): Observable<BlogEntry[]> {
        return from(this.blogRepository.find({
                where: {
                    author: {id: userId}
                },
                relations: ['author']
            })
        )
    }

    findOne(id: number): Observable<BlogEntry> {
        return from(
            this.blogRepository.findOne({
                where: {id: id},
                relations: ['author']
            })
        );
    }

    updateOne(id: number, blog: BlogEntry): Observable<BlogEntry> {
        return from(this.blogRepository.update(id, blog)).pipe(
            switchMap(() => {
                return this.blogRepository.findOne({
                    where: {id: id}
                })
            })
        )
    }

    deleteOne(id: number): Observable<any> {
        return from(this.blogRepository.delete(id));
    }
}
