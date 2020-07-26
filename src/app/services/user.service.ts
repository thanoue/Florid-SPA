import { BaseService } from './common/base.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/entities/user.entity';
import { HttpService } from './common/http.service';
import { API_END_POINT } from '../app.constants';
import { Roles } from '../models/enums';
import { GlobalService } from './common/global.service';

@Injectable({
    providedIn: 'root'
})
export class UserService {


    protected get tableName(): string {
        return '/users';
    }

    constructor(private httpService: HttpService, private globalService: GlobalService) {
    }

    insertUser(user: User, avatarFile: any): Promise<User> {
        return this.httpService.postForm(API_END_POINT.createUser, {
            fullName: user.FullName,
            email: user.Email,
            loginName: user.LoginName,
            password: user.Password,
            phoneNumber: user.PhoneNumber,
            avatar: avatarFile,
            isPrinter: user.IsPrinter,
            role: user.Role
        }).then(severUser => {
            user.AvtUrl = severUser.user.AvtUrl;
            return user;
        }).catch(err => {
            this.httpService.handleError(err);
            throw err;
        });
    }

    deleteUser(userId: number, avtUrl: string): Promise<any> {

        return this.httpService.post(API_END_POINT.deleteUser, {
            userId: userId,
            avtUrl: avtUrl
        }).then(res => {
            return true;
        }).catch(err => {
            this.httpService.handleError(err);
        });
    }


    updateUser(user: User, avatarFile: any): Promise<User> {
        console.log(user, avatarFile);

        return this.httpService.postForm(API_END_POINT.updateUser, {
            id: user.Id,
            fullName: user.FullName,
            email: user.Email,
            loginName: user.LoginName,
            password: !user.Password || user.Password == '' ? '' : user.Password,
            phoneNumber: user.PhoneNumber,
            oldAvtUrl: user.AvtUrl,
            newAvatar: avatarFile,
            isPrinter: user.IsPrinter,
            role: user.Role
        }).then(data => {
            user.AvtUrl = data.avtUrl;
            return user;
        }).catch(err => {
            this.httpService.handleError(err);
            throw err;
        });
    }

    async getAll(): Promise<User[]> {
        return this.httpService.get(API_END_POINT.getAllUser)
            .then(data => {

                let users: User[] = [];

                if (data && data.users) {
                    data.users.forEach(rawUser => {
                        let user = new User();

                        user.Id = rawUser.Id.toString();
                        user.AvtUrl = rawUser.AvtUrl;
                        user.Email = rawUser.Email;
                        user.PhoneNumber = rawUser.PhoneNumber;
                        user.LoginName = rawUser.LoginName;
                        user.FullName = rawUser.FullName;
                        user.IsPrinter = rawUser.IsPrinter;

                        if (rawUser.roles && rawUser.roles[0]) {
                            user.Role = rawUser.roles[0].Name;
                        } else {
                            user.Role = Roles.User;
                        }

                        users.push(user);
                    });
                }

                return users;
            }).catch(err => {
                this.httpService.handleError(err);
                throw err;
            });
    }

    async getByLoginId(loginId: string): Promise<User> {

        this.globalService.startLoading();

        return new User();
    }
}
