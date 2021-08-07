const middlewares = require("../middlewares");
const authController = require("../controllers/authentication.controller");
const userController = require("../controllers/user.controller");
const addressController = require("../controllers/address.controller");
const youtubeController = require("../controllers/youtube.controller");
const soundCloudController = require("../controllers/soundcloud.controller");

const authJwt = middlewares.authJwt;
const verifySignUp = middlewares.verifySignUp;

module.exports = function (app) {

    const youtubePrefix = "/api/youtube/";
    const soundCloudPrefix = "/api/soundCloud/";
    const authPrefix = "/api/auth/";
    const userPrefix = "/api/user/";
    const addressPrefix = "/api/address/";
    const tripPrefix = "/api/trip/";

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
        [verifySignUp.checkDuplicateLoginName],
        authController.signup
    );
    app.post(
        `${authPrefix}signout`,
        [authJwt.verifyToken],
        authController.signout
    );
    app.post(
        `${authPrefix}updateUserLoginInfo`,
        [authJwt.verifyToken],
        authController.updateUserLoginInfo
    );
    app.post(`${authPrefix}loginByLoginName`, authController.loginByLoginName);
    app.post(`${authPrefix}loginByFacebook`, authController.loginByFacebook);
    app.post(`${authPrefix}loginByGoogle`, authController.loginByGoogle);

    app.post(`${youtubePrefix}get`, youtubeController.getDownloadUrls);
    app.post(`${youtubePrefix}searchVideos`, youtubeController.searchVideos);

    app.post(`${soundCloudPrefix}searchSongs`, soundCloudController.searchSong);
    app.get(`${soundCloudPrefix}getFile`, soundCloudController.getFile);
    app.post(`${soundCloudPrefix}getRelativedSongs`, soundCloudController.getRelativedSongs);

    // //user
    // app.post(
    //     `${userPrefix}editUser`,
    //     [authJwt.verifyToken,
    //     verifySignUp.checkDuplicatePhoneNumber],
    //     userController.editUser
    // );

    // app.post(
    //     `${userPrefix}deleteUser`,
    //     [authJwt.verifyToken],
    //     userController.deleteUser
    // ) 

};