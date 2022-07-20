import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { catchError, from, map, Observable, of, switchMap, throwError } from 'rxjs';
import { AuthService } from 'src/auth/service/auth.service';
import { Like, Repository } from 'typeorm';
import { UserEntity } from '../models/user.entity';
import { User, UserRole } from '../models/user.interface';


@Injectable()
export class UserService {

    constructor (
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        private authService: AuthService
    ) {}

    createUser(user: User): Observable<User> {
        return this.authService.hashPassword(user.password).pipe(
            switchMap((passwordHash: string) => {
                const newUser = new UserEntity();
                newUser.name = user.name;
                newUser.username = user.username;
                newUser.email = user.email;
                newUser.password = passwordHash;
                newUser.role = UserRole.user;

                return from( this.userRepository.save(newUser) ).pipe(
                    map((user: User) => {
                        const {password, ...result} = user;

                        return result;
                    }),
                    catchError( err => throwError(err) ),
                );
            })
        )
    }

    findOne(id: number): Observable<User> {
        return from( this.userRepository.findOne({
            where: {id: id}
        }) ).pipe(
            map((user: User) => {
                const { password, ...result } = user;

                return result;
            }),
            catchError(err => throwError(err))
        );
    }

    findALL(): Observable<User[]> {
        return from( this.userRepository.find() ).pipe(
            map((users: User[]) => {
                users.forEach( element => delete element.password );

                return users;
            })
        );
    }

    paginate(option: IPaginationOptions): Observable<Pagination<User>> {
        return from( paginate<User>(this.userRepository, option) ).pipe(
            map((usersPageable: Pagination<User>) => {
                usersPageable.items.forEach(element => delete element.password)

                return usersPageable;
            })
        )
    } 

    paginateFilterByUsername(option: IPaginationOptions, user: User): Observable<Pagination<User>> {
        const page = Number(option.page);
        const limit = Number(option.limit);
        
        return from( this.userRepository.findAndCount({
            skip: (page - 1) * limit || 0,
            take: limit || 10,
            order: {id: "ASC"},
            select: ['id', 'name', 'username', 'email', 'role'],
            where: [
                {username: Like(`%${user.username}%`)}
            ]
        }) ).pipe(
            map(([users, totalUsers]) => {
                const usersPageable: Pagination<User> = {
                    items: users,
                    links: {
                        first: option.route + `?limit=${limit}`,
                        previous: option.route + ``,
                        next: option.route + `?limit=${option.limit}&page=${page + 1}`,
                        last: option.route + `?limit=${option.limit}&page=${ Math.ceil(totalUsers / limit)}`,
                    },
                    meta: {
                        currentPage: page,
                        itemCount: users.length,
                        itemsPerPage: limit,
                        totalItems: totalUsers,
                        totalPages: Math.ceil(totalUsers / limit)
                    }
                }; 

                return usersPageable;
            })
        )
    }

    deleteOne( id: number ): Observable<any> {
        return from( this.userRepository.delete(id) )
    }

    updateOne(id: number, user: User): Observable<any> {
        delete user.email;
        delete user.password;

        return from( this.userRepository.update(id, user) ).pipe(
            switchMap( () => {
                return this.findOne(id)
            } )
        )
    }

    login(user: User): Observable<string> {
        return this.validateUser(user.email, user.password).pipe(
            switchMap((user: User) => {
                if (user) {
                    return this.authService.generateJWT(user).pipe(map((jwt: string) => jwt));
                } else {
                    return "Wrong Credentials";
                }
            })
        )
    }

    validateUser(email: string, password: string): Observable<User> {
        return this.findByMail(email).pipe(
            switchMap((user: User) => this.authService.comparePassword(password, user.password).pipe(
                map((match: boolean) => {
                    if (match) {
                        const {password, ...result} = user;

                        return result;
                    } else {
                        throw Error;
                    }
                })
            ))
        )
    }

    findByMail(email: string): Observable<User> {
        return from(this.userRepository.findOne(
            {where: {email}}
        ))
    }

    updateRoleOfUser(id: number, user: User): Observable<any> {
        return from( this.userRepository.update(id, user) );
    }

}
