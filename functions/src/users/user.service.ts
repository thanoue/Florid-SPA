
// const jwt = require('jsonwebtoken');
import * as adminSdk from '../helper/admin.sdk';
const sha256 = require('js-sha256');

export async function authenticate(body: any): Promise<any> {

    return adminSdk.defauDatabase.ref('/users').orderByChild('Email').equalTo(body.username).once('value')
        .then((snapshot: any) => {

            let user: any;

            snapshot.forEach((data: any) => {
                user = data.val()
            });

            if (user) {

                const hashedPassword = sha256.hmac.create(adminSdk.momoConfig.secretKey).update(body.password).hex();

                if (hashedPassword !== user.Password) {
                    return false;
                }

                //const token = jwt.sign({ sub: key, role: user.Role }, adminSdk.OAuthPrivateKey);
                //  const { Password, ...userWithoutPassword } = user;
                const firebaseConfig = adminSdk.firebaseConfig;

                return {
                    //  ...userWithoutPassword,
                    //  token,
                    //  key,
                    firebaseConfig
                };
            } else {
                return false;
            }
        })
        .catch((error: any) => { throw error; })
}



export async function forceUserLogout(userId: string, token: string): Promise<boolean> {

    const message = {
        data: {
            userId: userId,
            content: 'ForceLogout'
        },
        token: token
    };

    return adminSdk.messaging.send(message)
        .then((response: any) => {
            // Response is a message ID string.
            console.info('Successfully sent message:', response);
            return true;
        })
        .catch((error: any) => {
            console.info('Error sending message:', error);
            return false;
        });
}

export function getUser(uid: string): Promise<any> {

    return adminSdk.defaultAuth.getUser(uid)
        .then((userRecord: any) => {

            const customClaims = (userRecord.customClaims || { role: '', isPrinter: false }) as { role?: string, isPrinter?: boolean };

            const role = customClaims.role ? customClaims.role : '';
            const isPrinter = customClaims.isPrinter ? customClaims.isPrinter : false;

            return {
                ...userRecord,
                role,
                isPrinter
            };
        });
}

export function getAllUsers(): Promise<any> {

    return adminSdk.defaultAuth.listUsers()
        .then((usersRes: any) => {

            const users: any[] = [];

            usersRes.users.forEach((userRecord: any) => {

                users.push({
                    userRecord,
                });
            });

            return users;
        });
}

export async function editUser(user: any): Promise<any> {

    const editUser = {
        email: user.Email,
        phoneNumber: user.PhoneNumber,
        emailVerified: true,
        password: user.Password,
        displayName: user.FullName,
        photoURL: user.AvtUrl,
        disabled: false
    }

    const { password, ...userWithoutPassword } = editUser;

    return adminSdk.defaultAuth.updateUser(user.Id, !user.password || user.Password == '' ? userWithoutPassword : editUser)
        .then(async (userRecord: any) => {
            // See the UserRecord reference doc for the contents of userRecord.
            console.log('Successfully updated user', userRecord.toJSON());

            await adminSdk.defaultAuth.setCustomUserClaims(userRecord.uid, { role: user.Role, isPrinter: user.IsPrinter })

            const hashedPassword = sha256.hmac.create(adminSdk.momoConfig.secretKey).update(user.Password).hex();

            adminSdk.defauDatabase.ref('users').child(user.Id).set({
                PhoneNumber: user.PhoneNumber,
                FullName: user.FullName,
                Email: user.Email,
                AvtUrl: user.AvtUrl,
                Active: true,
                Role: user.Role,
                IsPrinter: user.IsPrinter,
                Password: hashedPassword,
                Id: user.Id
            });

            return userRecord;

        })
        .catch(function (error: any) {
            console.log('Error updating user:', error);
            throw error
        });

}

export async function createUser(user: any): Promise<any> {

    return adminSdk.defaultAuth.createUser({
        email: user.Email,
        phoneNumber: user.PhoneNumber,
        emailVerified: true,
        password: user.Password,
        displayName: user.FullName,
        photoURL: user.AvtUrl,
        disabled: false
    })
        .then(async (userRecord: any) => {

            await adminSdk.defaultAuth.setCustomUserClaims(userRecord.uid, { role: user.Role, isPrinter: user.IsPrinter })

            const hashedPassword = sha256.hmac.create(adminSdk.momoConfig.secretKey).update(user.Password).hex();

            adminSdk.defauDatabase.ref('users').child(userRecord.uid).set({
                PhoneNumber: userRecord.phoneNumber,
                FullName: userRecord.displayName,
                Email: userRecord.email,
                AvtUrl: userRecord.photoURL,
                Active: true,
                Role: user.Role,
                IsPrinter: user.IsPrinter,
                Password: hashedPassword,
                Id: userRecord.uid
            });

            return userRecord;
        })
        .catch(function (error: any) {
            throw error;
            //res.status(403).send(error);
        });
}

