const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const logger = require('../config/logger');

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {

    if(!req.body.phoneNumber){
        res.status(403).send({ message: 'Phone Number is required!'});
    }
    // Save User to Database
    User.create({
        FullName: req.body.fullName,
        Email: req.body.email,
        Password: bcrypt.hashSync(req.body.password, 8),
        PhoneNumber: req.body.phoneNumber,
        AvtUrl: 'https://cdn1.vectorstock.com/i/thumb-large/95/10/bald-man-with-mustache-in-business-suit-ico-vector-1979510.jpg',
    })
        .then(user => {
            res.send({ user: user});
        })
        .catch(err => logger.error(err, res));
};

exports.signout = (req, res) => {
    res.send({ message: "User was logged out!" });
}

exports.loginByEmail = (req, res) => {

    User.findOne({
        where: {
            Email: req.body.email
        }
    })
        .then(user => {

            if (!user) {
                res.status(404).send({ message: "User Not found." });
                return;
            }

            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.Password
            );

            if (!passwordIsValid) {

                res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!"
                });

                return;
            }

            var token = jwt.sign({ id: user.Id }, config.secret, {
                expiresIn: 86400 // 24 hours
            });


            res.status(200).send({
                id: user.Id,
                fullName: user.FullName,
                email: user.Email,
                accessToken: token,
                avtUrl: user.AvtUrl,
                phoneNumber: user.PhoneNumber
            });
        })
        .catch(err => logger.error(err, res));
};
