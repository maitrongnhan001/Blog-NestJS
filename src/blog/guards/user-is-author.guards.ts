import { CanActivate, ExecutionContext, forwardRef, Inject, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { map, Observable, switchMap } from "rxjs";
import { RolesGuard } from "src/auth/guard/role.guard";
import { User } from "src/user/models/user.interface";
import { UserService } from "src/user/service/user.service";
import { BlogEntry } from "../models/blog-entry.interface";
import { BlogService } from "../service/blog.service";

@Injectable()
export class UserIsAuthorGuard implements CanActivate {

    constructor(
        private blogService: BlogService,
        private userService: UserService,
    ) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const params = request.params;
        const blogEntryId: number = Number(params.id);
        const user: User = request.user;

        return this.userService.findOne(user.id).pipe(
            switchMap((user: User) => {
                return this.blogService.findOne(blogEntryId).pipe(
                    map((blogEntry: BlogEntry) => {
                        let hasPermission = false;

                        if (user.id === blogEntry.author.id) {
                            hasPermission = true;
                        }

                        return user && hasPermission;
                    })
                )
            })
        )
    }


}