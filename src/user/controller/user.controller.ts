import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { catchError, map, Observable, of } from 'rxjs';
import { hasRoles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-guard';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { User, UserRole } from '../models/user.interface';
import { UserService } from '../service/user.service';

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

    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    findAll(): Observable<User[]> {
        return this.userService.findALL();
    }

    @Delete(":id")
    deleteOne( @Param("id")id: string ): Observable<any> {
        return this.userService.deleteOne(
            Number(id)
        );
    }

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

}
