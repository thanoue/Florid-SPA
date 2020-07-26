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
};

export const IMAGE_FOLDER_PATHS = {
    user_avt: '/user/avt/',
    product_img: '/product/img/'
}

export enum ImgType {
    UserAvt = 'UserAvt',
    ProductImg = "ProductImg",
    OrderImg = "OrderImg",
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
        DisplayName: 'Đã xác nhận SP, chưa có người giao'
    },
    {
        State: OrderDetailStates.Delivering,
        DisplayName: 'Đang giao'
    },
    {
        State: OrderDetailStates.Deliveried,
        DisplayName: 'Đã giao, đang xác nhận giao'
    },
    {
        State: OrderDetailStates.Completed,
        DisplayName: 'Đã hoàn tất'
    },
    {
        State: OrderDetailStates.Canceled,
        DisplayName: 'Đã huỷ'
    },
]

export const REQUEST_TIMEOUT = 30000;
