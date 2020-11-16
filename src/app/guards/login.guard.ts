import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/common/auth.service';
import { Roles } from '../models/enums';
import { GlobalService } from '../services/common/global.service';
import { LocalService } from '../services/common/local.service';

declare function isOnMobile(): any;

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
            this.router.navigate(['staff/login']);
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

            if (!isOnMobile()) {
                this.router.navigate(['admin/login']);
            } else {
                this.router.navigate(['staff/login']);
            }

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

            switch (role) {
                case Roles.Account:
                    this.router.navigate(['staff/orders-manage']);
                    break;
                case Roles.Florist:
                    this.router.navigate(['staff/florist-main']);
                    break;
                case Roles.Shipper:
                    this.router.navigate(['staff/shipper-main']);
                    break;
                default:
                    break;
            }
            return false;
        }
    }
}


@Injectable({
    providedIn: 'root'
})
export class MobileHomeGuard implements CanActivate {

    constructor(private router: Router, private globalServie: GlobalService) {
    }

    canActivate() {

        let loggedInGuard = new LoggedInGuard(this.router, this.globalServie);

        if (!loggedInGuard.canActivate())
            return false;

        const role = AuthService.getCurrentRole();

        switch (role) {
            case Roles.Account:
            case Roles.Admin:
                this.router.navigate(['staff/orders-manage']);
                break;
            case Roles.Florist:
                this.router.navigate(['staff/florist-main']);
                break;
            case Roles.Shipper:
                this.router.navigate(['staff/shipper-main']);
                break;
            default:
                break;
        }
        return false;
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
            this.router.navigate(['staff/login']);
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
            this.router.navigate(['staff/login']);
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

        const role = AuthService.getCurrentRole();
        if (role == Roles.Florist) {
            return true;
        } else {
            this.router.navigate(['staff/login']);
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
            this.router.navigate(['staff/login']);
            return false;
        }
    }
}
