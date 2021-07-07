const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;

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

        next();

    });
};

const authJwt = {
    verifyToken: verifyToken,

};
module.exports = authJwt;