const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const Session = db.session;

verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send({
            message: "No token provided!"
        });
    }

    jwt.verify(token, config.secret, async (err, decoded) => {

        if (err) {
            res.status(401).send({
                message: "Unauthorized!"
            });
            return;
        }

        req.userId = decoded.id;
        req.token = token;

        Session.findOne({
            where: {
                UserId: req.userId,
                Token: token,
                IsExpired: true
            }
        }).then(expiredSess => {

            if (!expiredSess) {
                next();
                return;
            }

            res.status(401).send({
                message: "Unauthorized!"
            });

            return;
        });

    });
};

isAdmin = (req, res, next) => {

    User.findByPk(req.userId).then(user => {

        user.getRoles().then(roles => {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].Name === "Admin") {
                    next();
                    return;
                }
            }

            res.status(403).send({
                message: "Require Admin Role!"
            });
            return;
        });

    });
};

isAccount = (req, res, next) => {

    User.findByPk(req.userId).then(user => {

        user.getRoles().then(roles => {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].Name === "Account") {
                    next();
                    return;
                }
            }

            res.status(403).send({
                message: "Require Account Role!"
            });
            return;
        });

    });
};

isFlorist = (req, res, next) => {

    User.findByPk(req.userId).then(user => {

        user.getRoles().then(roles => {
            for (let i = 0; i < roles.length; i++) {

                if (roles[i].Name === "Florist") {
                    next();
                    return;
                }

            }

            res.status(403).send({
                message: "Require Florist Role!"
            });
            return;
        });

    });
};

isShipper = (req, res, next) => {

    User.findByPk(req.userId).then(user => {

        user.getRoles().then(roles => {
            for (let i = 0; i < roles.length; i++) {

                if (roles[i].Name === "Shipper") {
                    next();
                    return;
                }

            }

            res.status(403).send({
                message: "Require Shipper Role!"
            });
            return;
        });

    });
};

isAccountOrAdmin = (req, res, next) => {
    User.findByPk(req.userId).then(user => {
        user.getRoles().then(roles => {

            for (let i = 0; i < roles.length; i++) {

                if (roles[i].Name === "Account") {
                    next();
                    return;
                }

                if (roles[i].Name === "Admin") {
                    next();
                    return;
                }

            }

            res.status(403).send({
                message: "Require Account or Admin Role!"
            });
        });
    });
};


const authJwt = {
    verifyToken: verifyToken,
    isAdmin: isAdmin,
    isAccount: isAccount,
    isAccountOrAdmin: isAccountOrAdmin,
    isShipper: isShipper,
    isFlorist: isFlorist,

};
module.exports = authJwt;