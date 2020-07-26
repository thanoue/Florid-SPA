const authJwt = require("./authJwt");
const verifySignUp = require("./verifySignUp");
const tableValidation = require("./validate.middleware");

module.exports = {
    authJwt,
    verifySignUp,
    tableValidation
};