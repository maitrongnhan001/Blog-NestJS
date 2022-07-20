import { Body, Controller, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/guard/jwt-guard';
import { BlogEntry } from '../models/blog-entry.interface';
import { BlogService } from '../service/blog.service';

@Controller('blogs')
export class BlogController {

    constructor (
        private blogService: BlogService
    ) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() blogEntry: BlogEntry, @Request() req): Observable<BlogEntry> {
        const user = req.user.user;
        return this.blogService.create(user, blogEntry);
    }

    @Get()
    findBlogEntries(@Query('userId') userId: number): Observable<BlogEntry[]> {
        if (!userId) {
            return this.blogService.findAll();
        } else {
            return this.blogService.findByUser(Number(userId));
        }
    }

    @Get(":id")
    findOne(@Param("id") id: string): Observable<BlogEntry> {
        return this.blogService.findOne( Number(id) );
    }

}
