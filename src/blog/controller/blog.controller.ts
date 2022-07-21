import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/guard/jwt-guard';
import { UserIsAuthorGuard } from '../guards/user-is-author.guards';
import { BlogEntry } from '../models/blog-entry.interface';
import { BlogService } from '../service/blog.service';
const ControllerURL = 'http://localhost:3000/api/blogs';

@Controller('blogs')
export class BlogController {

    constructor (
        private blogService: BlogService
    ) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() blogEntry: BlogEntry, @Request() req): Observable<BlogEntry> {
        const user = req.user;
        return this.blogService.create(user, blogEntry);
    }

    // @Get()
    // findBlogEntries(@Query('userId') userId: number): Observable<BlogEntry[]> {
    //     if (!userId) {
    //         return this.blogService.findAll();
    //     } else {
    //         return this.blogService.findByUser(Number(userId));
    //     }
    // }

    @Get()
    index(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ) {
        limit = limit > 100 ? 100: limit;

        return this.blogService.paginateAll({
            page: page,
            limit: limit,
            route: ControllerURL
        });
    }

    @Get('user/:id')
    indexByUser(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Param('id') id: number
    ) {
        limit = limit > 100 ? 100: limit;

        return this.blogService.paginateByUser({
            page: page,
            limit: limit,
            route: ControllerURL
        }, id);
    }

    @Get(":id")
    findOne(@Param("id") id: string): Observable<BlogEntry> {
        return this.blogService.findOne( Number(id) );
    }

    @UseGuards(JwtAuthGuard, UserIsAuthorGuard)
    @Put(":id")
    updateOne(@Param("id") id: number, @Body() blog: BlogEntry): Observable<BlogEntry> {
        console.log(id, blog)
        return this.blogService.updateOne(id, blog);
    }
 
    @UseGuards(JwtAuthGuard, UserIsAuthorGuard)
    @Delete(":id")
    deleteOne(@Param("id") id: number): Observable<any> {
        return this.deleteOne(id);
    }
}
