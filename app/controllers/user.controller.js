const db = require("../models");
const guid = require('guid');
var bcrypt = require("bcryptjs");
const User = db.user;
const Role = db.role;
const UsersRoles = db.user_role;
const fs = require('fs');

const appConstant = require('../config/app.config');
const userAvtFolderPath = appConstant.fileFolderPath.userAvt;

exports.getAll = (req, res) => {
    User.findAll({
        include: [
            {
                model: Role
            }
        ]
    })
        .then(users => {
            res.send({ users: users });
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
}

exports.createUser = (req, res) => {

    const guid = require('guid');

    var avtname = 'https://cdn1.vectorstock.com/i/thumb-large/95/10/bald-man-with-mustache-in-business-suit-ico-vector-1979510.jpg';

    if (req.files) {

        avtname = commonService.getNewFileName(req.files.avatar);

        avatar.mv(userAvtFolderPath + avtname);
    }

    // Save User to Database
    User.create({
        FullName: req.body.fullName,
        Email: req.body.email,
        LoginName: req.body.loginName,
        Password: bcrypt.hashSync(req.body.password, 8),
        PhoneNumber: req.body.phoneNumber,
        AvtUrl: avtname,
        IsPrinter: req.body.isPrinter
    })
        .then(user => {
            if (req.body.role) {
                Role.findOne({
                    where: {
                        Name: req.body.role
                    }
                }).then(role => {
                    if (!role || role == null) {
                        res.status(500).send({ message: "Invalid Role!" });
                    } else {
                        user.setRoles(role).then(() => {
                            res.send({ user: user });
                        });
                    }
                });
            } else {
                // user role = 1
                user.setRoles([1]).then(() => {
                    res.send({ user: user });
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({ message: err });
        });
};

exports.editUser = (req, res) => {

    let avtname = req.body.oldAvtUrl ? req.body.oldAvtUrl : '';

    if (req.files) {

        avtname = commonService.getNewFileName(req.files.newAvatar);

        newAvatar.mv(userAvtFolderPath + avtname);

        if (req.body.oldAvtUrl && req.body.oldAvtUrl.indexOf('http') < 0) {
            fs.unlink(userAvtFolderPath + req.body.oldAvtUrl, (err) => {
                console.log(err);
            });
        }
    }

    let updates = {
        FullName: req.body.fullName,
        Email: req.body.email,
        LoginName: req.body.loginName,
        PhoneNumber: req.body.phoneNumber,
        AvtUrl: avtname,
        IsPrinter: req.body.isPrinter
    }

    if (req.body.password && req.body.password != '') {
        updates.Password = bcrypt.hashSync(req.body.password, 8);
    }

    // Save User to Database
    User.update(updates, {
        where: {
            Id: req.body.id
        }
    })
        .then(user => {
            if (req.body.role) {
                Role.findOne({
                    where: {
                        Name: req.body.role
                    }
                }).then(role => {

                    if (!role || role == null) {

                        res.status(500).send({ message: "Invalid Role!" });

                    } else {

                        UsersRoles.destroy({
                            where: {
                                UserId: req.body.id
                            }
                        }).then(() => {

                            UsersRoles.create({
                                RoleId: role.Id,
                                UserId: req.body.id
                            }).then(() => {
                                res.send({ avtUrl: avtname });
                            });

                        });

                    }
                }).catch(err => {
                    console.log(err);
                    res.status(500).send({ message: err });
                });

            } else {
                res.send({ avtUrl: avtname });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({ message: err });
        });
};

exports.deleteUser = (req, res) => {

    if (!req.body.userId) {
        res.status(403).send({ message: "User Id is Required" });
        return;
    }

    if (req.body.avtUrl && req.body.avtUrl.indexOf('http') < 0) {
        fs.unlink(userAvtFolderPath + req.body.avtUrl, (err) => {
            console.log(err);
            if (!err)
                console.log('file is deleted: ', req.body.avtUrl);
        });
    }

    User.destroy({
        where: {
            Id: req.body.userId
        }
    }).then(() => {
        res.send({ message: "User is has been deleted!" });
        return;
    }).catch((err) => {
        res.status(500).send({ message: err });
        return;
    })

}