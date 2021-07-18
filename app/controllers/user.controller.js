const db = require("../models");
const guid = require('guid');
var bcrypt = require("bcryptjs");
const User = db.user;
const fs = require('fs');
const commonService = require("../services/common.service");
const appConstant = require('../config/app.config');
const userAvtFolderPath = appConstant.fileFolderPath.userAvt;
const logger = require('../config/logger');

exports.getAll = (req, res) => {
    User.findAll().then(users => {
        res.send({ users: users });
    }).catch(err => logger.error(err, res));
}

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
    }

    if (req.body.password && req.body.password != '') {
        updates.Password = bcrypt.hashSync(req.body.password, 8);
    }

    // Save User to Database
    User.update(updates, {
        where: {
            Id: req.body.id
        }
    }).then(user => {
        res.send({ user: user });
    }).catch(err => logger.error(err, res));
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
    }).catch(err => logger.error(err, res));
};