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
const configController = require('../controllers/config.controller');

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
    const makingPrefix = "/api/making/";
    const purchasePrefix = '/api/purchase/';
    const configPrefix = '/api/config/'

    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    //config
    app.post(`${configPrefix}update`,
        [authJwt.verifyToken, authJwt.isAdmin],
        configController.updateConfig
    );
    app.post(`${configPrefix}get`,
        [authJwt.verifyToken, authJwt.isAdmin],
        configController.getCurrent
    );
    app.post(`${configPrefix}updateMembership`,
        [authJwt.verifyToken, authJwt.isAdmin],
        configController.updateMembership
    );

    //purchase
    app.post(`${purchasePrefix}add`,
        [authJwt.verifyToken, authJwt.isAccountOrAdmin, tableValidation.purchaseAmountValidation],
        purchaseController.add
    );
    app.post(`${purchasePrefix}bulkAdd`,
        [authJwt.verifyToken, authJwt.isAccountOrAdmin],
        purchaseController.bulkAdd
    );
    app.post(`${purchasePrefix}getByTerm`,
        [authJwt.verifyToken, authJwt.isAdmin],
        purchaseController.getByTerm
    );
    app.post(`${purchasePrefix}updateOrder`,
        [authJwt.verifyToken, authJwt.isAdmin],
        purchaseController.updateOrder
    );
    app.post(`${purchasePrefix}assignOrder`,
        [authJwt.verifyToken, authJwt.isAdmin],
        purchaseController.assignOrder
    );
    app.post(`${purchasePrefix}bulkInsert`,
        [authJwt.verifyToken, authJwt.isAdmin],
        purchaseController.bulkInsert
    );
    app.post(`${purchasePrefix}addAndAsign`,
        [authJwt.verifyToken, authJwt.isAdmin],
        purchaseController.addAndAsign
    );
    app.post(`${purchasePrefix}deletePurchase`,
        [authJwt.verifyToken, authJwt.isAdmin],
        purchaseController.deletePurchase
    );
    app.post(`${purchasePrefix}addRefund`,
        [authJwt.verifyToken, authJwt.isAccountOrAdmin],
        purchaseController.addRefund
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
    app.post(`${orderPrefix}getMaxNumberId`,
        [authJwt.verifyToken, authJwt.isAccountOrAdmin],
        orderController.getMaxNumberByYearId
    )
    app.get(`${orderPrefix}updateCustomerTotalAmount`,
        orderController.updateCustomerTotalAmount
    )
    app.get(`${orderPrefix}updateMemberDiscountApplies`,
        [authJwt.verifyToken, authJwt.isAccountOrAdmin],
        orderController.updateMemberDiscountApplies
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
    app.post(`${orderPrefix}getNotLazyById`,
        [authJwt.verifyToken],
        orderController.getNotLazyById
    )
    app.post(`${orderPrefix}updateFields`,
        [authJwt.verifyToken], orderController.updateOrderFields)
    app.post(`${orderPrefix}searchOrders`,
        [authJwt.verifyToken], orderController.searchOrders)
    app.post(`${orderPrefix}getByDayRange`,
        [authJwt.verifyToken, authJwt.isAdmin], orderController.getByDayRange)
    app.post(`${orderPrefix}addBulk`,
        [authJwt.verifyToken, authJwt.isAdmin], orderController.addBulk)
    app.post(`${orderPrefix}getDebts`,
        [authJwt.verifyToken, authJwt.isAdmin], orderController.getDebts)
    app.post(`${orderPrefix}getOrders`,
        orderController.getOrders)
    app.post(`${orderPrefix}removeOrders`,
        orderController.removeOrders)
    app.post(`${orderPrefix}updateOldOrders`,
        orderController.updateOldOrders
    );
    app.post(`${orderPrefix}getNullOrder`,
        orderController.getNullOrder
    );
    app.post(`${orderPrefix}getMissingCustomers`,
        orderController.getMissingCustomers
    );
    app.post(`${orderPrefix}insertMissingCustomer`,
        orderController.insertMissingCustomer
    );
    app.post(`${orderPrefix}revertUsedScore`, [authJwt.verifyToken, authJwt.isAccountOrAdmin],
        orderController.revertUsedScore
    );
    app.post(`${orderPrefix}deleteOrder`, [authJwt.verifyToken, authJwt.isAccountOrAdmin],
        orderController.deleteOrder
    );
    app.post(`${orderPrefix}finishOrders`, [authJwt.verifyToken, authJwt.isAccountOrAdmin],
        orderController.finishOrders
    );

    //order detail
    app.post(`${orderDetailPrefix}updateFields`,
        [authJwt.verifyToken], orderDetailController.updateFields);
    app.post(`${orderDetailPrefix}getByState`,
        [authJwt.verifyToken], orderDetailController.getByState);
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
    app.post(`${orderDetailPrefix}addOrderDetails`,
        [authJwt.verifyToken, authJwt.isAccountOrAdmin], orderDetailController.addOrderDetails)
    app.post(`${orderDetailPrefix}deleteOrderDetailByOrderId`,
        [authJwt.verifyToken, authJwt.isAccountOrAdmin], orderDetailController.deleteOrderDetailByOrderId)
    app.post(`${orderDetailPrefix}getProcessingOrderDetails`,
        [authJwt.verifyToken, authJwt.isAccountOrAdmin], orderDetailController.getProcessingOrderDetails)
    app.post(`${orderDetailPrefix}getByOrderId`,
        [authJwt.verifyToken], orderDetailController.getByOrderId)
    app.post(`${orderDetailPrefix}updateOrderInfos`,
        [authJwt.verifyToken], orderDetailController.updateOrderInfos)
    app.post(`${orderDetailPrefix}completeOrder`,
        [authJwt.verifyToken, authJwt.isAccountOrAdmin], orderDetailController.completeOrder)
    app.post(`${orderDetailPrefix}uploadNoteImage`,
        [authJwt.verifyToken, authJwt.isAccountOrAdmin], orderDetailController.uploadNoteImage)
    app.post(`${orderDetailPrefix}completeOD`,
        [authJwt.verifyToken, authJwt.isAccountOrAdmin], orderDetailController.completeOD)
    app.post(`${orderDetailPrefix}getFinishedOrderIds`,
        [authJwt.verifyToken, authJwt.isAccountOrAdmin], orderDetailController.getFinishedOrderIds)

    //shipping session
    app.post(`${shippingSessionPrefix}assignSingleShipper`,
        [authJwt.verifyToken], shippingSessionController.assignSingleShipper)
    app.post(`${shippingSessionPrefix}assignShipperForOrderDetails`,
        [authJwt.verifyToken], shippingSessionController.assignShipperForOrderDetails)
    app.post(`${shippingSessionPrefix}getShippingOrderDetails`,
        [authJwt.verifyToken], shippingSessionController.getShippingOrderDetails)
    app.post(`${shippingSessionPrefix}updateFields`,
        [authJwt.verifyToken], shippingSessionController.updateShippingFields)
    app.post(`${shippingSessionPrefix}shippingConfirm`,
        [authJwt.verifyToken], shippingSessionController.shippingConfirm)
    app.post(`${shippingSessionPrefix}replaceShipper`,
        [authJwt.verifyToken], shippingSessionController.replaceShipper)
    app.post(`${shippingSessionPrefix}replaceFlorist`,
        [authJwt.verifyToken], shippingSessionController.replaceFlorist)

    app.post(`${makingPrefix}getMakingOrderDetails`,
        [authJwt.verifyToken], shippingSessionController.getMakingOrderDetails)
    app.post(`${makingPrefix}assignSingleMaking`,
        [authJwt.verifyToken], shippingSessionController.assignSingleMaking)
    app.post(`${makingPrefix}updateFields`,
        [authJwt.verifyToken], shippingSessionController.updateMakingFields)
    app.post(`${makingPrefix}assignFloristForOrderDetails`,
        [authJwt.verifyToken, authJwt.isAccountOrAdmin], shippingSessionController.assignFloristForOrderDetails);

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
    app.post(`${customerPrefix}updateAllCustomerMemberType`,
        [authJwt.verifyToken, authJwt.isAccountOrAdmin],
        customerController.updateAllCustomerMemberType
    )
    app.get(`${customerPrefix}updateTotalAmount`,
        customerController.updateTotalAmount
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
    app.post(`${customerPrefix}updateCustomerIds`,
        [authJwt.verifyToken, authJwt.isAccountOrAdmin],
        customerController.updateCustomerIds
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
    app.post(`${productPrefix}addBulkOneCate`,
        [authJwt.verifyToken, authJwt.isAdmin],
        productController.addBulkOneCate
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
    app.post(`${tagPrefix}bulkAdd`,
        [authJwt.verifyToken, authJwt.isAdmin],
        tagController.bulkAdd
    )
    app.post(`${tagPrefix}bulkAddProductsTags`,
        [authJwt.verifyToken, authJwt.isAdmin],
        tagController.bulkAddProductsTags
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