import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import * as firebase from 'firebase';
import { AuthService } from '../services/common/auth.service';
import { Roles } from '../models/enums';
import { GlobalService } from '../services/common/global.service';
import { LocalService } from '../services/common/local.service';
@Injectable({
    providedIn: 'root'
})
export class LoggedInGuard implements CanActivate {

    constructor(private router: Router, private globalServie: GlobalService) {
    }
    canActivate() {

        if (LocalService.getUserId()) {
            return true;
        } else {
            this.router.navigate(['login']);
            return false;
        }
    }
}

@Injectable({
    providedIn: 'root'
})
export class AdminGuard implements CanActivate {

    constructor(private router: Router, private globalServie: GlobalService) {
    }

    canActivate() {

        let loggedInGuard = new LoggedInGuard(this.router, this.globalServie);

        if (!loggedInGuard.canActivate())
            return false;

        const role = (AuthService.getCurrentRole());
        if (role == Roles.Admin) {
            return true;
        } else {
            this.router.navigate(['login']);
            return false;
        }
    }
}
