import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { from, Observable, of } from 'rxjs';
import { User } from 'src/user/models/user.interface';
import { compare, hash } from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {}

    generateJWT(user: User): Observable<string> {
        return from( this.jwtService.signAsync({user}) );
    }

    hashPassword(password: string): Observable<string> {
        return from<string>(hash(password, 12));
    }

    comparePassword(newPassword: string, passwordHash: string): Observable<any | boolean> {
        return of<any | boolean>(compare(newPassword, passwordHash));
    }
}
 