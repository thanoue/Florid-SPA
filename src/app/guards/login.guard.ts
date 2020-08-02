import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/common/auth.service';
import { Roles } from '../models/enums';
import { GlobalService } from '../services/common/global.service';
import { LocalService } from '../services/common/local.service';

@Injectable({
    providedIn: 'root'
})
export class LoggedInMobileGuard implements CanActivate {

    constructor(private router: Router, private globalServie: GlobalService) {
    }

    canActivate() {

        if (LocalService.getUserId()) {
            return true;
        } else {
            this.router.navigate(['staff-login']);
            return false;
        }
    }
}

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


@Injectable({
    providedIn: 'root'
})
export class AccountMobileGuard implements CanActivate {

    constructor(private router: Router, private globalServie: GlobalService) {
    }

    canActivate() {

        let loggedInGuard = new LoggedInMobileGuard(this.router, this.globalServie);

        if (!loggedInGuard.canActivate())
            return false;

        const role = (AuthService.getCurrentRole());
        if (role == Roles.Admin || role == Roles.Account) {
            return true;
        } else {
            this.router.navigate(['staff-login']);
            return false;
        }
    }
}


@Injectable({
    providedIn: 'root'
})
export class AccountAndShipperMobileGuard implements CanActivate {

    constructor(private router: Router, private globalServie: GlobalService) {
    }

    canActivate() {

        let loggedInGuard = new LoggedInMobileGuard(this.router, this.globalServie);

        if (!loggedInGuard.canActivate())
            return false;

        const role = (AuthService.getCurrentRole());
        if (role == Roles.Admin || role == Roles.Account || role == Roles.Shipper) {
            return true;
        } else {
            this.router.navigate(['staff-login']);
            return false;
        }
    }
}

@Injectable({
    providedIn: 'root'
})
export class FloristMobileGuard implements CanActivate {

    constructor(private router: Router, private globalServie: GlobalService) {
    }

    canActivate() {

        let loggedInGuard = new LoggedInMobileGuard(this.router, this.globalServie);

        if (!loggedInGuard.canActivate())
            return false;

        const role = (AuthService.getCurrentRole());
        if (role == Roles.Florist) {
            return true;
        } else {
            this.router.navigate(['staff-login']);
            return false;
        }
    }
}


@Injectable({
    providedIn: 'root'
})
export class ShipperMobileGuard implements CanActivate {

    constructor(private router: Router, private globalServie: GlobalService) {
    }

    canActivate() {

        let loggedInGuard = new LoggedInMobileGuard(this.router, this.globalServie);

        if (!loggedInGuard.canActivate())
            return false;

        const role = (AuthService.getCurrentRole());
        if (role == Roles.Shipper) {
            return true;
        } else {
            this.router.navigate(['staff-login']);
            return false;
        }
    }
}
