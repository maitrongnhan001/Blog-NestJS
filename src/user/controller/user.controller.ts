import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Pagination } from 'nestjs-typeorm-paginate';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { hasRoles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-guard';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { User, UserRole } from '../models/user.interface';
import { UserService } from '../service/user.service';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { join, parse } from 'path';
import { UserIsUserGuard } from 'src/auth/guard/UserIsUser.guard';

export const storage = {
    storage: diskStorage({
        destination: './uploads/profileimages',
        filename: (req, file, cb) => {
            const filename: string = parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
            const extension: string = parse(file.originalname).ext;
            cb(null, `${filename}${extension}`)
        }
    })
}

@Controller('users')
export class UserController {

    constructor(
        private userService: UserService
    ) {}

    @Post()
    create( @Body()user: User ): Observable<User | object> {
        console.log(user)
        return this.userService.createUser(user).pipe(
            map((user: User) => user),
            catchError( err => of({error: err.message}) )
        );
    }

    @Post('login')
    login(@Body()user: User): Observable<object> {
        return this.userService.login(user).pipe(
            map((jwt: string) => {
                return {access_token: jwt};
            })
        )
    }

    @Get(":id")
    findOne( @Param("id")id: string ): Observable<User> {
        return this.userService.findOne(
            Number(id)
        )
    }

    @Get()
    index(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('username') username: string
    ): Observable<Pagination<User>> {
        limit = limit > 100 ? 100 : limit;

        if (username) {
            return this.userService.paginateFilterByUsername(
                {
                    page: Number(page),
                    limit: Number(limit),
                    route: "http://localhost:3000/api/users"
                },
                {username}
            )
        } else {
            return this.userService.paginate({
                page, 
                limit,
                route: 'http://localhost:3000/users' 
            });
        }
    }

    @Delete(":id")
    deleteOne( @Param("id")id: string ): Observable<any> {
        return this.userService.deleteOne(
            Number(id)
        );
    }

    @UseGuards(JwtAuthGuard, UserIsUserGuard)
    @Put(":id")
    UpdateOne( @Param("id")id: string, @Body()user: User ) {
        return this.userService.updateOne(
            Number(id), user
        );
    }

    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(":id/role")
    updateRoleOfUser(
        @Param('id') id: string, 
        @Body() user: User
    ): Observable<User> {
        return this.userService.updateRoleOfUser(Number(id), user);
    }

    @UseGuards(JwtAuthGuard)
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', storage))
    uploadFile( @UploadedFile() file, @Request() req ): Observable<Object> {
        const user: User = req.user;
        return this.userService.updateOne(user.id, {profileImage: file.filename}).pipe(
            map((user: User) => ({profileImage: user.profileImage}))
        ); 
    }

    @Get('profile-image/:imagename')
    findProfileImage(@Param('imagename') imagename, @Res() res): Observable<object> {
        return of(res.sendFile(join(process.cwd(), 'uploads/profileimages/' + imagename)))
    }

}
