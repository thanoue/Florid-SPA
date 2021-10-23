import { OrderDetailStates, Roles } from './models/enums';

export const LOCAL_STORAGE_VARIABLE = {
    role: 'user_role',
    user_id: 'user_id',
    is_logged_in: 'is_logged_in',
    user_name: 'user_name',
    access_token: 'access_token',
    api_access_token: 'api_access_token',
    phone_number: 'phone_number',
    user_avt_url: 'user_avt_url',
    user_email: 'user_email',
    is_printer: 'is_printer',
    firebase_config: 'firebase_config',
    config: 'config'
};

export const API_END_POINT = {
    login: '/auth/signin',
    logout: '/auth/signout',

    getAllUser: '/user/getAll',
    getByRole: '/user/getByRole',
    createUser: '/user/createUser',
    updateUser: '/user/editUser',
    deleteUser: '/user/deleteUser',

    deleteTag: '/tag/delete',
    deleteTags: '/tag/deletemany',
    createTag: '/tag/create',
    updateTag: '/tag/update',
    getTags: '/tag/getList',
    getAllTags: '/tag/getall',
    bulkAddTags: '/tag/bulkAdd',
    bulkAddProductsTags: '/tag/bulkAddProductsTags',

    deleteCategory: '/category/delete',
    deleteCategories: '/category/deletemany',
    createCategory: '/category/create',
    updateCategory: '/category/update',
    getCategories: '/category/getList',
    getAllCategories: '/category/getAll',

    deletePromotion: '/promotion/delete',
    deletePromotions: '/promotion/deletemany',
    createPromotion: '/promotion/create',
    updatePromotion: '/promotion/update',
    getPromotions: '/promotion/getList',
    getAllPromotions: '/promotion/getAll',
    getAvailable: '/promotion/getAvailable',

    deleteProduct: '/product/delete',
    deleteManyProduct: '/product/deletemany',
    createProduct: '/product/create',
    updateProduct: '/product/update',
    getProducts: '/product/getList',
    getProductsByPrice: '/product/getByPrice',
    getAllProducts: '/product/getAll',
    addBulkOneCate: '/product/addBulkOneCate',

    deleteCustomer: '/customer/delete',
    deleteManyCustomer: '/customer/deletemany',
    createCustomer: '/customer/create',
    createCustomers: '/customer/createCustomers',
    updateCustomer: '/customer/update',
    getCustomers: '/customer/getList',
    getCustomeCount: '/customer/getCount',
    getCustomeById: '/customer/getById',
    updateReciverInfo: '/customer/updateReceiverList',
    getAllCustomer: '/customer/getAll',
    updateCustomerFields: '/customer/updateFields',
    updateCustomerList: '/customer/updateList',
    updateAllCustomerMemberType: '/customer/updateAllCustomerMemberType',

    getMaxOrderNumberId: '/order/getMaxNumberId',
    addOrder: '/order/add',
    editOrder: '/order/editOrder',
    getOrdersByStates: '/order/getByStates',
    getOrdersByCustomerId: '/order/getByCustomer',
    getById: '/order/getById',
    getOrderNotLazyById: '/order/getNotLazyById',
    updateOrderFields: '/order/updateFields',
    getOrderByDayRange: '/order/getByDayRange',
    searchOrders: '/order/searchOrders',
    addBulkOrder: '/order/addBulk',
    getDebts: '/order/getDebts',
    revertUsedScore: '/order/revertUsedScore',
    deleteOrder: '/order/deleteOrder',

    getAllDistricts: '/address/getAllDistricts',
    getAllWards: '/address/getAllWards',

    getMaxShippingSortOrder: '/orderDetail/getMaxShippingSortOrder',
    updateODFields: '/orderDetail/updateFields',
    getOrderDetailByStates: '/orderDetail/getDetailByStates',
    getOrderDetailByStatesAndFloristId: '/orderDetail/getDetailByStatesAndFlorist',
    updateShippingSortOrder: '/orderDetail/updateShippingSortOrder',
    getDetailByStateAndFloristId: '/orderDetail/getDetailByStateAndFloristId',
    getOrderDetailShipperAndFlorist: '/orderDetail/getOrderDetailShipperAndFlorist',
    resultConfirm: '/orderDetail/resultConfirm',
    addOrderDetails: '/orderDetail/addOrderDetails',
    deleteOrderDetailByOrderId: '/orderDetail/deleteOrderDetailByOrderId',
    getProcessingOrderDetails: '/orderDetail/getProcessingOrderDetails',
    getOrderDetailsByOrderId: '/orderDetail/getByOrderId',
    updateOrderInfos: '/orderDetail/updateOrderInfos',
    updateStatusByOrderId: '/orderDetail/updateStatusByOrderId',
    uploadNoteImage: '/orderDetail/uploadNoteImage',

    updateDetailSeen: '/orderDetailSeener/updateDetailSeen',
    getODSeeners: '/orderDetailSeener/getODSeeners',

    assignSingleOD: '/shippingSession/assignSingleOD',
    replaceFlorist: '/shippingSession/replaceFlorist',
    replaceShipper: '/shippingSession/replaceShipper',
    assignOrderDetails: '/shippingSession/assignOrderDetails',
    getShippingOrderDetails: '/shippingSession/getShippingOrderDetails',
    shippingConfirm: '/shippingSession/shippingConfirm',
    updateShippingFields: '/shippingSession/updateFields',

    getMakingWaitOrderDetails: '/making/getMakingOrderDetails',
    assignSingleMaking: '/making/assignSingleMaking',
    updateMakingFields: '/making/updateFields',
    assignFloristForOrderDetails: '/making/assignFloristForOrderDetails',

    addPurchase: '/purchase/add',
    addAndAsign: '/purchase/addAndAsign',
    bulkAddPurchase: '/purchase/bulkAdd',
    bulkInsertPurchase: '/purchase/bulkInsert',
    getPurchaseByTerm: '/purchase/getByTerm',
    updatePurchaseOrder: '/purchase/updateOrder',
    assignPurchaseOrder: '/purchase/assignOrder',
    deletePurchase: '/purchase/deletePurchase',
    addRefund: '/purchase/addRefund',

    getCurrentConfig: '/config/get',
    updateConfig: '/config/update',
    updateMembership: '/config/updateMembership'
};

export const IMAGE_FOLDER_PATHS = {
    user_avt: '/user/avt/',
    product_img: '/product/img/',
    result_img: '/orderDetail/resultImg/',
    shipping_img: '/orderDetail/shippingImg/',
    order_detail_note: '/orderDetail/orderDetailNotes/'
};

export enum ImgType {
    UserAvt = 'UserAvt',
    ProductImg = 'ProductImg',
    OrderImg = 'OrderImg',
    ResultImg = 'ResultImg',
    ShippingImg = 'ShippingImg',
    NoteImg = 'NoteImg'
}

export const ROLES = [
    {
        Role: Roles.Account,
        DisplayName: 'Chăm sóc khách hàng'
    },
    {
        Role: Roles.Admin,
        DisplayName: 'Quản trị viên'
    },
    {
        Role: Roles.Florist,
        DisplayName: 'Thợ cắm hoa'
    },
    {
        Role: Roles.Shipper,
        DisplayName: 'Người giao hàng'
    },
    {
        Role: Roles.User,
        DisplayName: 'Khác'
    }
];

export const ORDER_DETAIL_STATES = [
    {
        State: OrderDetailStates.Added,
        DisplayName: 'Đã chốt đơn'
    },
    {
        State: OrderDetailStates.Waiting,
        DisplayName: 'Chưa chọn thợ cắm'
    },
    {
        State: OrderDetailStates.FloristAssigned,
        DisplayName: 'Đã chọn thợ cắm'
    },
    {
        State: OrderDetailStates.Making,
        DisplayName: 'Đang cắm'
    },
    {
        State: OrderDetailStates.Comfirming,
        DisplayName: 'Đang xác nhận thành phẩm'
    },
    {
        State: OrderDetailStates.DeliveryWaiting,
        DisplayName: 'Đã xác nhận SP, chưa có Shipper'
    },
    {
        State: OrderDetailStates.DeliverAssinged,
        DisplayName: 'Đã chọn Shipper'
    },
    {
        State: OrderDetailStates.OnTheWay,
        DisplayName: 'Đang giao'
    },
    {
        State: OrderDetailStates.Deliveried,
        DisplayName: 'Đã giao, đang xác nhận giao'
    },
    {
        State: OrderDetailStates.SentBack,
        DisplayName: 'Đã trả đơn về'
    },
    {
        State: OrderDetailStates.FixingRequest,
        DisplayName: 'Đang yêu cầu sửa'
    },
    {
        State: OrderDetailStates.FixerAssigned,
        DisplayName: 'Đã chọn thợ sửa'
    },
    {
        State: OrderDetailStates.Fixing,
        DisplayName: 'Đang sửa'
    },
    {
        State: OrderDetailStates.Completed,
        DisplayName: 'Đã hoàn tất'
    },
    {
        State: OrderDetailStates.Canceled,
        DisplayName: 'Đã huỷ'
    }
];

export const REQUEST_TIMEOUT = 30000;
