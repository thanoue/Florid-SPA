const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;
const Op = db.Sequelize.Op;

checkDuplicateUsernameOrEmail = (req, res, next) => {
    // Username
    User.findOne({
        where: {
            LoginName: req.body.loginName
        }
    }).then(user => {

        if (user) {
            res.status(400).send({
                message: "Failed! Username is already in use!"
            });
            return;
        }

        // Email
        User.findOne({
            where: {
                Email: req.body.email
            }
        }).then(user => {
            if (user) {
                res.status(400).send({
                    message: "Failed! Email is already in use!"
                });
                return;
            }

            next();
        });
    });
};


checkDuplicateOtherUserLoginName = (req, res, next) => {
    // Username
    User.findOne({
        where: {
            LoginName: req.body.loginName,
            Id: {
                [Op.ne]: req.body.id
            }
        }
    }).then(user => {

        if (user) {
            res.status(400).send({
                message: "Failed! Login Name is already in use by another User!"
            });

            return;

        } else {
            next();
        }
    });
};


checkRolesExisted = (req, res, next) => {

    if (req.body.roles) {
        for (let i = 0; i < req.body.roles.length; i++) {
            if (!ROLES.includes(req.body.roles[i])) {
                res.status(400).send({
                    message: "Failed! Role does not exist = " + req.body.roles[i]
                });
                return;
            }
        }
    }

    next();
};

const verifySignUp = {
    checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
    checkRolesExisted: checkRolesExisted,
    checkDuplicateOtherUserLoginName: checkDuplicateOtherUserLoginName
};

module.exports = verifySignUp;