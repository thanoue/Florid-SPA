const middlewares = require("../middlewares");
const productController = require("../controllers/product.controller");
const tagController = require("../controllers/tag.controller");
const categoryController = require("../controllers/category.controller");
const authController = require("../controllers/authentication.controller");
const userController = require("../controllers/user.controller");
const customerController = require("../controllers/customer.controller");

const authJwt = middlewares.authJwt;
const verifySignUp = middlewares.verifySignUp;
const tableValidation = middlewares.tableValidation;

module.exports = function (app) {

    const authPrefix = "/api/auth/";
    const productPrefix = "/api/product/";
    const tagPrefix = "/api/tag/";
    const categoryPrefix = "/api/category/";
    const userPrefix = "/api/user/";
    const customerPrefix = "/api/customer/";

    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    //customer
    app.get(`${customerPrefix}getList`,
        [authJwt.verifyToken, authJwt.isAccountOrAdmin],
        customerController.getList
    )
    app.post(`${customerPrefix}create`,
        [authJwt.verifyToken, authJwt.isAccountOrAdmin],
        customerController.create
    )
    app.get(`${customerPrefix}getCount`,
        [authJwt.verifyToken, authJwt.isAccountOrAdmin],
        customerController.getCount
    )
    app.get(`${customerPrefix}getById`,
        [authJwt.verifyToken, authJwt.isAccountOrAdmin],
        customerController.getById
    )

    //product
    app.get(`${productPrefix}getList`,
        [authJwt.verifyToken, authJwt.isAccountOrAdmin],
        productController.getList
    )

    app.post(`${productPrefix}create`,
        [authJwt.verifyToken, authJwt.isAdmin],
        productController.createProduct
    )

    app.post(`${productPrefix}update`,
        [authJwt.verifyToken, authJwt.isAdmin],
        productController.updateProduct
    )

    app.post(`${productPrefix}delete`,
        [authJwt.verifyToken, authJwt.isAdmin],
        productController.deleteProduct
    )

    app.post(`${productPrefix}deleteMany`,
        [authJwt.verifyToken, authJwt.isAdmin],
        productController.deleteManyProduct
    )

    //tag
    app.get(`${tagPrefix}getList`,
        [authJwt.verifyToken, authJwt.isAdmin],
        tagController.getList
    )
    app.get(`${tagPrefix}getall`,
        [authJwt.verifyToken, authJwt.isAdmin],
        tagController.getAll
    )
    app.post(`${tagPrefix}create`,
        [authJwt.verifyToken, authJwt.isAdmin, tableValidation.checkIfAliasIsDuplicate],
        tagController.create
    )
    app.post(`${tagPrefix}update`,
        [authJwt.verifyToken, authJwt.isAdmin, tableValidation.checkIfAliasIsDuplicate],
        tagController.update
    )
    app.post(`${tagPrefix}delete`,
        [authJwt.verifyToken, authJwt.isAdmin],
        tagController.delete
    )
    app.post(`${tagPrefix}deletemany`,
        [authJwt.verifyToken, authJwt.isAdmin],
        tagController.deleteMany
    )

    //category
    app.get(`${categoryPrefix}getList`,
        [authJwt.verifyToken, authJwt.isAdmin],
        categoryController.getList
    )
    app.get(`${categoryPrefix}getAll`,
        [authJwt.verifyToken, authJwt.isAdmin],
        categoryController.getAll
    )
    app.post(`${categoryPrefix}create`,
        [authJwt.verifyToken, authJwt.isAdmin, tableValidation.checkIfCategoryNameIsDuplicate],
        categoryController.create
    )
    app.post(`${categoryPrefix}update`,
        [authJwt.verifyToken, authJwt.isAdmin, tableValidation.checkIfCategoryNameIsDuplicate],
        categoryController.update
    )
    app.post(`${categoryPrefix}delete`,
        [authJwt.verifyToken, authJwt.isAdmin],
        categoryController.delete
    )
    app.post(`${categoryPrefix}deletemany`,
        [authJwt.verifyToken, authJwt.isAdmin],
        categoryController.deleteMany
    )

    //authen
    app.post(
        `${authPrefix}signup`,
        [
            verifySignUp.checkDuplicateUsernameOrEmail,
            verifySignUp.checkRolesExisted
        ],
        authController.signup
    );
    app.post(
        `${authPrefix}signout`,
        [authJwt.verifyToken],
        authController.signout
    );
    app.post(`${authPrefix}signin`, authController.signin);

    //user
    app.get(`${userPrefix}getAll`,
        [authJwt.verifyToken, authJwt.isAdmin],
        userController.getAll
    )
    app.post(
        `${userPrefix}createUser`,
        [authJwt.verifyToken, authJwt.isAdmin,
        verifySignUp.checkDuplicateUsernameOrEmail,
        verifySignUp.checkRolesExisted],
        userController.createUser
    )
    app.post(
        `${userPrefix}editUser`,
        [authJwt.verifyToken, authJwt.isAdmin,
        verifySignUp.checkDuplicateOtherUserLoginName,
        verifySignUp.checkRolesExisted],
        userController.editUser
    )
    app.post(
        `${userPrefix}deleteUser`,
        [authJwt.verifyToken, authJwt.isAdmin],
        userController.deleteUser
    )
};