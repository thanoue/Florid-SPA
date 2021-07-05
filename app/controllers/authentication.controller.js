const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const logger = require('../config/logger');
const Config = db.config;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
    // Save User to Database
    User.create({
        FullName: req.body.fullName,
        Email: req.body.email,
        LoginName: req.body.loginName,
        Password: bcrypt.hashSync(req.body.password, 8),
        PhoneNumber: req.body.phoneNumber,
        AvtUrl: 'https://cdn1.vectorstock.com/i/thumb-large/95/10/bald-man-with-mustache-in-business-suit-ico-vector-1979510.jpg',
        IsPrinter: req.body.isPrinter
    })
        .then(user => {
            if (req.body.roles) {
                Role.findAll({
                    where: {
                        Name: {
                            [Op.or]: req.body.roles
                        }
                    }
                }).then(roles => {
                    user.setRoles(roles).then(() => {
                        res.send({ message: "User was registered successfully!" });
                    });
                });
            } else {
                user.setRoles([1]).then(() => {
                    res.send({ message: "User was registered successfully!" });
                });
            }
        })
        .catch(err => logger.error(err, res));
};

exports.signout = (req, res) => {
    res.send({ message: "User was logged out!" });
}

exports.signin = (req, res) => {

    User.findOne({
        where: {
            LoginName: req.body.loginName
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

            var authorities = [];

            user.getRoles().then(roles => {

                for (let i = 0; i < roles.length; i++) {
                    authorities.push(roles[i].Name);
                }

                Config.findOne()
                    .then(configData => {

                        res.status(200).send({
                            id: user.Id,
                            fullName: user.FullName,
                            loginName: user.LoginName,
                            email: user.Email,
                            roles: authorities,
                            accessToken: token,
                            avtUrl: user.AvtUrl,
                            phoneNumber: user.PhoneNumber,
                            isPrinter: user.IsPrinter,
                            config: configData
                        });

                    });
            });
        })
        .catch(err => logger.error(err, res));
};
