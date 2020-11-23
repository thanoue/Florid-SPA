const middlewares = require("../middlewares");
const productController = require("../controllers/product.controller");
const tagController = require("../controllers/tag.controller");
const categoryController = require("../controllers/category.controller");
const promotionController = require("../controllers/promotion.controller");
const authController = require("../controllers/authentication.controller");
const userController = require("../controllers/user.controller");
const customerController = require("../controllers/customer.controller");
const addressController = require("../controllers/address.controller");
const orderController = require('../controllers/order.controller');
const orderDetailController = require('../controllers/order.detail.controller');
const shippingSessionController = require('../controllers/shipping.session.controller')
const orderDetailSeenerController = require('../controllers/order.detail.seener.controller');
const purchaseController = require('../controllers/purchase.controller');

const authJwt = middlewares.authJwt;
const verifySignUp = middlewares.verifySignUp;
const tableValidation = middlewares.tableValidation;

module.exports = function (app) {

    const authPrefix = "/api/auth/";
    const productPrefix = "/api/product/";
    const tagPrefix = "/api/tag/";
    const categoryPrefix = "/api/category/";
    const promotionPrefix = "/api/promotion/";
    const userPrefix = "/api/user/";
    const customerPrefix = "/api/customer/";
    const addressPrefix = "/api/address/";
    const orderPrefix = "/api/order/";
    const orderDetailPrefix = "/api/orderDetail/";
    const orderDetailSeenerPrefix = "/api/orderDetailSeener/";
    const shippingSessionPrefix = "/api/shippingSession/";
    const purchasePrefix = '/api/purchase/';

    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    //purchase
    app.post(`${purchasePrefix}add`,
        [authJwt.verifyToken, authJwt.isAccountOrAdmin, tableValidation.purchaseAmountValidation, tableValidation.orderIdValidation],
        purchaseController.add
    );
    app.post(`${purchasePrefix}updateStatus`,
        [authJwt.verifyToken, authJwt.isAccountOrAdmin],
        purchaseController.updateStatus
    );
    app.post(`${purchasePrefix}bulkAdd`,
        [authJwt.verifyToken, authJwt.isAccountOrAdmin, tableValidation.orderIdValidation],
        purchaseController.bulkAdd
    );

    //promotion
    app.get(`${promotionPrefix}getList`,
        [authJwt.verifyToken, authJwt.isAccountOrAdmin],
        promotionController.getList
    )
    app.get(`${promotionPrefix}getAll`,
        [authJwt.verifyToken, authJwt.isAccountOrAdmin],
        promotionController.getAll
    )
    app.post(`${promotionPrefix}create`,
        [authJwt.verifyToken, authJwt.isAdmin],
        promotionController.create
    )
    app.post(`${promotionPrefix}update`,
        [authJwt.verifyToken, authJwt.isAdmin],
        promotionController.update
    )
    app.post(`${promotionPrefix}delete`,
        [authJwt.verifyToken, authJwt.isAdmin],
        promotionController.delete
    )
    app.post(`${promotionPrefix}deletemany`,
        [authJwt.verifyToken, authJwt.isAdmin],
        promotionController.deleteMany
    )
    app.post(`${promotionPrefix}getAvailable`,
        [authJwt.verifyToken, authJwt.isAccountOrAdmin],
        promotionController.getAvailable
    )

    //order
    app.get(`${orderPrefix}getNormalDayOrdersCount`,
        [authJwt.verifyToken, authJwt.isAccountOrAdmin],
        orderController.getNormalDayOrdersCount
    )
    app.post(`${orderPrefix}add`,
        [authJwt.verifyToken, authJwt.isAccountOrAdmin],
        orderController.addOrder
    )
    app.post(`${orderPrefix}editOrder`,
        [authJwt.verifyToken, authJwt.isAccountOrAdmin],
        orderController.editOrder
    )
    app.post(`${orderPrefix}getByStates`,
        [authJwt.verifyToken, authJwt.isAccountOrAdmin],
        orderController.getByStates
    )
    app.post(`${orderPrefix}getByCustomer`,
        [authJwt.verifyToken, authJwt.isAccountOrAdmin],
        orderController.getByCustomer
    )
    app.post(`${orderPrefix}getById`,
        [authJwt.verifyToken],
        orderController.getById
    )
    app.post(`${orderPrefix}updateFields`,
        [authJwt.verifyToken], orderController.updateOrderFields)
    app.post(`${orderPrefix}searchOrders`,
        [authJwt.verifyToken], orderController.searchOrders)
    app.post(`${orderPrefix}getByDayRange`,
        [authJwt.verifyToken, authJwt.isAdmin], orderController.getByDayRange)
    app.post(`${orderPrefix}addBulk`,
        [authJwt.verifyToken, authJwt.isAdmin], orderController.addBulk)

    //order detail
    app.get(`${orderDetailPrefix}getMaxMakingSortOrder`,
        [authJwt.verifyToken], orderDetailController.getMaxMakingSortOrder);
    app.get(`${orderDetailPrefix}getMaxShippingSortOrder`,
        [authJwt.verifyToken], orderDetailController.getMaxShippingSortOrder);
    app.post(`${orderDetailPrefix}updateFields`,
        [authJwt.verifyToken], orderDetailController.updateFields);
    app.post(`${orderDetailPrefix}getByState`,
        [authJwt.verifyToken], orderDetailController.getByState);
    app.post(`${orderDetailPrefix}updateShippingSortOrder`,
        [authJwt.verifyToken], orderDetailController.updateShippingSortOrder);
    app.post(`${orderDetailPrefix}updateMakingSortOrder`,
        [authJwt.verifyToken], orderDetailController.updateMakingSortOrder);
    app.post(`${orderDetailPrefix}getDetailByStateAndFloristId`,
        [authJwt.verifyToken], orderDetailController.getDetailByStateAndFloristId);
    app.post(`${orderDetailPrefix}getDetailByStates`,
        [authJwt.verifyToken], orderDetailController.getDetailByStates);
    app.post(`${orderDetailPrefix}getDetailByStatesAndFlorist`,
        [authJwt.verifyToken], orderDetailController.getDetailByStatesAndFlorist);
    app.post(`${orderDetailPrefix}getOrderDetailShipperAndFlorist`,
        [authJwt.verifyToken], orderDetailController.getOrderDetailShipperAndFlorist);
    app.post(`${orderDetailPrefix}resultConfirm`,
        [authJwt.verifyToken, authJwt.isAccountOrAdmin], orderDetailController.resultConfirm)
    app.post(`${orderDetailPrefix}shippingConfirm`,
        [authJwt.verifyToken, authJwt.isShipper], orderDetailController.shippingConfirm)
    app.post(`${orderDetailPrefix}addOrderDetails`,
        [authJwt.verifyToken, authJwt.isAccountOrAdmin], orderDetailController.addOrderDetails)
    app.post(`${orderDetailPrefix}deleteOrderDetailByOrderId`,
        [authJwt.verifyToken, authJwt.isAccountOrAdmin], orderDetailController.deleteOrderDetailByOrderId)
    app.post(`${orderDetailPrefix}getProcessingOrderDetails`,
        [authJwt.verifyToken, authJwt.isAccountOrAdmin], orderDetailController.getProcessingOrderDetails)
    app.post(`${orderDetailPrefix}getByOrderId`,
        [authJwt.verifyToken], orderDetailController.getByOrderId)


    //shipping session
    app.post(`${shippingSessionPrefix}assignSingleOD`,
        [authJwt.verifyToken], shippingSessionController.assignSingleOD)
    app.post(`${shippingSessionPrefix}assignOrderDetails`,
        [authJwt.verifyToken], shippingSessionController.assignOrderDetails)
    app.post(`${shippingSessionPrefix}getShippingOrderDetails`,
        [authJwt.verifyToken], shippingSessionController.getShippingOrderDetails)


    //od seener
    app.post(`${orderDetailSeenerPrefix}getODSeeners`,
        [authJwt.verifyToken, authJwt.isAccountOrAdmin], orderDetailSeenerController.getODSeeners);
    app.post(`${orderDetailSeenerPrefix}updateDetailSeen`,
        [authJwt.verifyToken], orderDetailSeenerController.updateDetailSeen);

    //address
    app.post(`${addressPrefix}addBulkDistrict`,
        [authJwt.verifyToken, authJwt.isAccountOrAdmin],
        addressController.addBulkDistrict
    )
    app.post(`${addressPrefix}addBulkWard`,
        [authJwt.verifyToken, authJwt.isAccountOrAdmin],
        addressController.addBulkWard
    )
    app.get(`${addressPrefix}getAllDistricts`,
        [authJwt.verifyToken, authJwt.isAccountOrAdmin],
        addressController.getAllDistricts
    )
    app.get(`${addressPrefix}getAllWards`,
        [authJwt.verifyToken, authJwt.isAccountOrAdmin],
        addressController.getAllWards
    )

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
        [authJwt.verifyToken],
        customerController.getById
    )
    app.post(`${customerPrefix}update`,
        [authJwt.verifyToken, authJwt.isAdmin],
        customerController.updateCustomer
    )
    app.post(`${customerPrefix}delete`,
        [authJwt.verifyToken, authJwt.isAdmin],
        customerController.delete
    )
    app.post(`${customerPrefix}deleteMany`,
        [authJwt.verifyToken, authJwt.isAdmin],
        customerController.deleteMany
    )
    app.post(`${customerPrefix}updateReceiverList`,
        [authJwt.verifyToken, authJwt.isAccountOrAdmin],
        customerController.updateReceiverList
    )
    app.get(`${customerPrefix}getAll`,
        [authJwt.verifyToken, authJwt.isAccountOrAdmin],
        customerController.getAll
    )
    app.post(`${customerPrefix}updateFields`,
        [authJwt.verifyToken, authJwt.isAccountOrAdmin],
        customerController.updateFields
    )
    app.post(`${customerPrefix}createCustomers`,
        [authJwt.verifyToken, authJwt.isAccountOrAdmin],
        customerController.createCustomers
    )
    app.post(`${customerPrefix}updateList`,
        [authJwt.verifyToken, authJwt.isAccountOrAdmin],
        customerController.updateList
    )

    //product
    app.post(`${productPrefix}getList`,
        [authJwt.verifyToken, authJwt.isAccountOrAdmin],
        productController.getList
    )
    app.post(`${productPrefix}getAll`,
        [authJwt.verifyToken, authJwt.isAccountOrAdmin],
        productController.getAll
    )
    app.post(`${productPrefix}getByPrice`,
        [authJwt.verifyToken, authJwt.isAccountOrAdmin],
        productController.getByPrice
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
    app.post(`${productPrefix}addBulk`,
        [authJwt.verifyToken, authJwt.isAdmin],
        productController.addBulk
    )
    app.post(`${productPrefix}addBulkFromFiles`,
        [authJwt.verifyToken, authJwt.isAdmin],
        productController.addBulkFromFiles
    )

    //tag
    app.get(`${tagPrefix}getList`,
        [authJwt.verifyToken, authJwt.isAccountOrAdmin],
        tagController.getList
    )
    app.get(`${tagPrefix}getall`,
        [authJwt.verifyToken, authJwt.isAccountOrAdmin],
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
        [authJwt.verifyToken, authJwt.isAccountOrAdmin],
        categoryController.getList
    )
    app.get(`${categoryPrefix}getAll`,
        [authJwt.verifyToken, authJwt.isAccountOrAdmin],
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
    app.post(
        `${userPrefix}getByRole`,
        [authJwt.verifyToken, authJwt.isAccountOrAdmin],
        userController.getByRole
    )
};