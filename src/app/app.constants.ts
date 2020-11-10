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
    firebase_config: 'firebase_config'
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

    deleteCustomer: '/customer/delete',
    deleteManyCustomer: '/customer/deletemany',
    createCustomer: '/customer/create',
    updateCustomer: '/customer/update',
    getCustomers: '/customer/getList',
    getCustomeCount: '/customer/getCount',
    getCustomeById: '/customer/getById',
    updateReciverInfo: '/customer/updateReceiverList',
    getAllCustomer: '/customer/getAll',
    updateCustomerFields: '/customer/updateFields',

    getNormalDayOrdersCount: '/order/getNormalDayOrdersCount',
    addOrder: '/order/add',
    editOrder: '/order/editOrder',
    getOrdersByStates: '/order/getByStates',
    getOrdersByCustomerId: '/order/getByCustomer',
    getById: '/order/getById',
    updateOrderFields: '/order/updateFields',
    searchByPhoneNumberOrCustomerName: '/order/searchByPhoneNumberOrCustomerName',

    getAllDistricts: '/address/getAllDistricts',
    getAllWards: '/address/getAllWards',

    getMaxMakingSortOrder: '/orderDetail/getMaxMakingSortOrder',
    getMaxShippingSortOrder: '/orderDetail/getMaxShippingSortOrder',
    updateODFields: '/orderDetail/updateFields',
    getOrderDetailByState: '/orderDetail/getByState',
    getOrderDetailByStates: '/orderDetail/getDetailByStates',
    getOrderDetailByStatesAndFloristId: '/orderDetail/getDetailByStatesAndFlorist',
    updateMakingSortOrder: '/orderDetail/updateMakingSortOrder',
    updateShippingSortOrder: '/orderDetail/updateShippingSortOrder',
    getDetailByStateAndFloristId: '/orderDetail/getDetailByStateAndFloristId',
    getOrderDetailShipperAndFlorist: '/orderDetail/getOrderDetailShipperAndFlorist',
    shippingConfirm: '/orderDetail/shippingConfirm',
    resultConfirm: '/orderDetail/resultConfirm',
    addOrderDetails: '/orderDetail/addOrderDetails',
    deleteOrderDetailByOrderId: '/orderDetail/deleteOrderDetailByOrderId',
    getProcessingOrderDetails: '/orderDetail/getProcessingOrderDetails',
    getOrderDetailsByOrderId: '/orderDetail/getByOrderId',

    updateDetailSeen: '/orderDetailSeener/updateDetailSeen',
    getODSeeners: '/orderDetailSeener/getODSeeners',

    assignSingleOD: '/shippingSession/assignSingleOD',
    assignOrderDetails: '/shippingSession/assignOrderDetails',
    getShippingOrderDetails: '/shippingSession/getShippingOrderDetails',

    addPurchase: '/purchase/add',
    updatePurchaseStatus: '/purchase/updateStatus',
    bulkAddPurchase: '/purchase/bulkAdd'
};

export const IMAGE_FOLDER_PATHS = {
    user_avt: '/user/avt/',
    product_img: '/product/img/',
    result_img: '/orderDetail/resultImg/',
    shipping_img: '/orderDetail/shippingImg/'
}

export enum ImgType {
    UserAvt = 'UserAvt',
    ProductImg = "ProductImg",
    OrderImg = "OrderImg",
    ResultImg = "ResultImg",
    ShippingImg = "ShippingImg",
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
]

export const ORDER_DETAIL_STATES = [
    {
        State: OrderDetailStates.Added,
        DisplayName: 'Đã chốt đơn'
    },
    {
        State: OrderDetailStates.Waiting,
        DisplayName: 'Đang chờ cắm'
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
        DisplayName: 'Đã chọn được Shipper'
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
]

export const REQUEST_TIMEOUT = 30000;
