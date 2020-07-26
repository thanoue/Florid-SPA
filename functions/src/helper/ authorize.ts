import { Role } from "./role";
import * as adminSdk from './admin.sdk';
import * as admin from 'firebase-admin'

const expressJwt = require('express-jwt');

export async function authorizeFunction(token: string, roles: Role[] | string = []): Promise<boolean> {

    let role: string[] = [];

    if (typeof roles === 'string') {
        role.push(roles);
    } else {
        role = roles;
    }
    try {

        if (role.length <= 0) {
            return true;
        }

        const decodedToken: admin.auth.DecodedIdToken = await adminSdk.defaultAuth.verifyIdToken(token);

        const loggedRole: string = decodedToken.role ? decodedToken.role : Role.None;

        if (role.length === 0 || role.indexOf(loggedRole) > -1) {
            return true;
        } else {
            return false;
        }
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

export function authorize(roles: Role[] | string = []) {

    let role: string[] = [];

    // roles param can be a single role string (e.g. Role.User or 'User') 
    // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])

    if (typeof roles === 'string') {

        role.push(roles);

    } else {

        role = roles;

    }


    return [
        // authenticate JWT token and attach user to request object (req.user)
        expressJwt({
            secret: 'KHOIDEPTRAIAHIIH'
        }),
        // authorize based on user role
        (req: any, res: any, next: any) => {
            if (role.length && !role.includes(req.user.role)) {
                // user's role is not authorized
                return res.status(401).json({ message: 'Unauthorized' });
            }

            // authentication and authorization successful
            next();
        }
    ];
}