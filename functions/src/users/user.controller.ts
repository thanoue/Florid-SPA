const express = require('express');
const userRouter = express.Router();
import * as userService from './user.service';
const blacklist = require('express-jwt-blacklist');

// routes
userRouter.post('/login', authenticate);
userRouter.post('/logout', logout);
userRouter.post('/createUser', createUser);
// userRouter.get('/', auth.authorize(Role.Admin), getAll);
// userRouter.get('/getUser', auth.authorize(Role.Admin), getUser);

module.exports = userRouter;

async function authenticate(req: any, res: any, next: any) {
    try {
        const user = await userService.authenticate(req.body);

        if (!user) {
            res.status(400).json({ message: 'Username or password is incorrect' });
        } else {
            res.status(200).send(user);
            return;
        }
    } catch (error) {
        console.log(error);
        res.status(403).send(error);
        return;
    }
}


function logout(req: any, res: any) {
    blacklist.revoke(req.user);
    res.sendStatus(200);
}

async function createUser(req: any, res: any) {
    try {
        const user = await userService.createUser(req.body);
        if (user) {
            res.status(200).send(user.toJSON());
        } else {
            res.status(500).send('ERROR!');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}


