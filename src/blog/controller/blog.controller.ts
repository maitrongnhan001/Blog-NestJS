import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, Request, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Observable, of } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/guard/jwt-guard';
import { UserIsAuthorGuard } from '../guards/user-is-author.guards';
import { BlogEntry } from '../models/blog-entry.interface';
import { BlogService } from '../service/blog.service';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { join, parse } from 'path';
import { Image } from '../models/Image.interface';
const ControllerURL = process.env.APP_URL;

export const storage = {
    storage: diskStorage({
        destination: './uploads/blog-entry-images',
        filename: (req, file, cb) => {
            const filename: string = parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
            const extension: string = parse(file.originalname).ext;
            cb(null, `${filename}${extension}`)
        }
    })
}

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

    @Get()
    index(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ) {
        limit = limit > 100 ? 100: limit;

        return this.blogService.paginateAll({
            page: page,
            limit: limit,
            route: `${ControllerURL}/blogs`
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
            route: `${ControllerURL}/blogs`
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

    @UseGuards(JwtAuthGuard)
    @Post('image/upload')
    @UseInterceptors(FileInterceptor('file', storage))
    uploadFile(@UploadedFile() file, @Request() req): Observable<Image> {
        return of(file);
    }

    @Get('image/:imagename')
    findImage(@Param('imagename') imagename, @Res() res): Observable<object> {
        return of(res.sendFile(join(process.cwd(), 'uploads/blog-entry-images/' + imagename)))
    }
}
