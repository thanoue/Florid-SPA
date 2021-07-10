const middlewares = require("../middlewares");
const authController = require("../controllers/authentication.controller");
const userController = require("../controllers/user.controller");
const addressController = require("../controllers/address.controller");

const authJwt = middlewares.authJwt;
const verifySignUp = middlewares.verifySignUp;

module.exports = function (app) {

    const authPrefix = "/api/auth/";
    const userPrefix = "/api/user/";
    const addressPrefix = "/api/address/";

    app.use(function (req, res, next) {

        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );

        next();
    });

    //address
    app.get(`${addressPrefix}getAllDistricts`,
        addressController.getAllDistricts
    )
    app.get(`${addressPrefix}getAllWards`,
        addressController.getAllWards
    ) 
    app.get(`${addressPrefix}getAllProvinces`,
        addressController.getAllProvinces
    )  
    app.post(`${addressPrefix}getDistrictsByProvinceId`,
        addressController.getDistrictsByProvinceId
    )
    app.post(`${addressPrefix}getWardsByDistrictId`,
        addressController.getWardsByDistrictId
    )

    //authen
    app.post(
        `${authPrefix}signup`,
        [verifySignUp.checkDuplicatePhoneNumber],
        authController.signup
    );
    app.post(
        `${authPrefix}signout`,
        [authJwt.verifyToken],
        authController.signout
    );
    app.post(`${authPrefix}loginByEmail`, authController.loginByEmail);
    app.post(`${authPrefix}loginByFacebook`, authController.loginByFacebook);
    app.post(`${authPrefix}loginByGoogle`, authController.loginByGoogle);

    //user

    app.post(
        `${userPrefix}editUser`,
        [authJwt.verifyToken,
        verifySignUp.checkDuplicatePhoneNumber],
        userController.editUser
    )
    app.post(
        `${userPrefix}deleteUser`,
        [authJwt.verifyToken],
        userController.deleteUser
    )
};