const config = require("../config/db.config.js");
const RoleTypes = require('../config/app.config').Roles;

const Sequelize = require("sequelize");
console.log('user: ', config.USER);
const sequelize = new Sequelize(
    config.DB,
    config.USER,
    config.PASSWORD,
    {
        host: config.HOST,
        dialect: config.dialect,
        operatorsAliases: false,
        dialectOptions: {
            multipleStatements: true
        },
        pool: {
            max: config.pool.max,
            min: config.pool.min,
            acquire: config.pool.acquire,
            idle: config.pool.idle
        }
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user.model.js")(sequelize, Sequelize);
db.role = require("./role.model.js")(sequelize, Sequelize);
db.user_role = require("./user.role.model.js")(sequelize, Sequelize);
db.tag = require('./tag.model.js')(sequelize, Sequelize);
db.product = require('./product.model.js')(sequelize, Sequelize);
db.product_tag = require('./product.tag.model.js')(sequelize, Sequelize);
db.product_category = require('./product.category.model.js')(sequelize, Sequelize);
db.category = require('./category.model.js')(sequelize, Sequelize);
db.customer = require('./customer.model')(sequelize, Sequelize);
db.customerReceiverInfo = require('./customer.receiverInfo.model')(sequelize, Sequelize);
db.customerSpecialDay = require('./customer.specialDay.model')(sequelize, Sequelize);
db.order = require('./order.model')(sequelize, Sequelize);
db.orderDetail = require('./orderDetail.model')(sequelize, Sequelize);
db.orderDetailSeen = require('./orderDetailseen.model')(sequelize, Sequelize);
db.districtAddress = require('./district.address.model')(sequelize, Sequelize);
db.wardAddress = require('./ward.address.model')(sequelize, Sequelize);
db.promotion = require('./promotion.model')(sequelize, Sequelize);
db.shipping = require('./shipping.model')(sequelize, Sequelize);
db.making = require('./making.model')(sequelize, Sequelize);
db.purchase = require('./purchase.model')(sequelize, Sequelize);
db.config = require('./config.model')(sequelize, Sequelize);

db.order.hasMany(db.purchase, {
    foreignKey: 'OrderId',
    onDelete: 'CASCADE'
});
db.purchase.belongsTo(db.order, {
    foreignKey: 'OrderId',
    onDelete: 'CASCADE'
})

db.order.hasMany(db.orderDetail, {
    foreignKey: 'OrderId',
    onDelete: 'SET NULL'
});

db.customer.hasMany(db.order, {
    foreignKey: 'CustomerId',
    onDelete: 'SET NULL'
});

db.order.belongsTo(db.customer, {
    foreignKey: 'CustomerId',
    onDelete: 'SET NULL'
})

db.districtAddress.hasMany(db.wardAddress, {
    foreignKey: 'DistrictId',
    onDelete: 'CASCADE'
});

db.product.hasMany(db.orderDetail, {
    foreignKey: 'ProductId',
    onDelete: 'SET NULL',
});

db.orderDetail.belongsToMany(db.user, {
    through: "shippings",
    foreignKey: "OrderDetailId",
    otherKey: "ShipperId",
    onDelete: 'CASCADE',
    as: 'shippers'
});
db.orderDetail.hasMany(db.shipping, {
    foreignKey: 'OrderDetailId',
    onDelete: 'CASCADE',
    as: 'orderDedailShippings'
});
db.shipping.belongsTo(db.orderDetail, {
    foreignKey: 'OrderDetailId',
    onDelete: 'CASCADE',
    as: 'shippingOrderDetail'
});

db.user.belongsToMany(db.orderDetail, {
    through: "shippings",
    foreignKey: "ShipperId",
    otherKey: "OrderDetailId",
    onDelete: 'CASCADE',
    as: 'shippingOrderDetails'
});
db.user.hasMany(db.shipping, {
    foreignKey: 'ShipperId',
    onDelete: 'CASCADE',
    as: 'userShippings'
});
db.shipping.belongsTo(db.user, {
    foreignKey: 'ShipperId',
    onDelete: 'CASCADE',
    as: 'shipper'
});

db.orderDetail.belongsToMany(db.user, {
    through: "makings",
    foreignKey: "OrderDetailId",
    otherKey: "FloristId",
    onDelete: 'CASCADE',
    as: 'florists'
});
db.orderDetail.hasMany(db.making, {
    foreignKey: 'OrderDetailId',
    onDelete: 'CASCADE',
    as: 'orderDetailMakings'
});
db.making.belongsTo(db.orderDetail, {
    foreignKey: 'OrderDetailId',
    onDelete: 'CASCADE',
    as: 'makingOrderDetail'
});

db.user.belongsToMany(db.orderDetail, {
    through: "makings",
    foreignKey: "FloristId",
    otherKey: "OrderDetailId",
    onDelete: 'CASCADE',
    as: 'makingOrderDetails'
});
db.user.hasMany(db.making, {
    foreignKey: 'FloristId',
    onDelete: 'CASCADE',
    as: 'userMakings'
});
db.making.belongsTo(db.user, {
    foreignKey: 'FloristId',
    onDelete: 'CASCADE',
    as: 'florist'
});

db.user.hasMany(db.orderDetailSeen, {
    foreignKey: 'UserId',
    onDelete: 'CASCADE',
});

db.orderDetailSeen.belongsTo(db.user, {
    foreignKey: 'UserId',
    onDelete: 'CASCADE'
});

db.orderDetailSeen.belongsTo(db.orderDetail, {
    foreignKey: 'OrderDetailId',
    onDelete: 'CASCADE'
});
db.orderDetail.hasMany(db.orderDetailSeen, {
    foreignKey: 'OrderDetailId',
    onDelete: 'CASCADE',
});

db.customer.hasMany(db.customerReceiverInfo, {
    foreignKey: 'CustomerId',
    onDelete: 'CASCADE',
    as: 'receivers',
});

db.customerReceiverInfo.belongsTo(db.customer, {
    foreignKey: 'CustomerId',
    onDelete: 'CASCADE',
    as: 'customer',
});

db.customer.hasMany(db.customerSpecialDay, {
    foreignKey: 'CustomerId',
    onDelete: 'CASCADE',
    as: 'specialDays'
});

db.customerSpecialDay.belongsTo(db.customer, {
    foreignKey: 'CustomerId',
    onDelete: 'CASCADE',
    as: 'customer'
});

db.tag.belongsToMany(db.product, {
    through: "products_tags",
    foreignKey: "TagId",
    otherKey: "ProductId",
    onDelete: 'CASCADE'
});

db.product.belongsToMany(db.tag, {
    through: "products_tags",
    foreignKey: "ProductId",
    otherKey: "TagId",
    onDelete: 'CASCADE'
});

db.category.belongsToMany(db.product, {
    through: "products_categories",
    foreignKey: "CategoryId",
    otherKey: "ProductId",
    onDelete: 'CASCADE'
});

db.product.belongsToMany(db.category, {
    through: "products_categories",
    foreignKey: "ProductId",
    otherKey: "CategoryId",
    onDelete: 'CASCADE'
});

db.role.belongsToMany(db.user, {
    through: "users_roles",
    foreignKey: "RoleId",
    otherKey: "UserId",
    onDelete: 'CASCADE'
});

db.user.belongsToMany(db.role, {
    through: "users_roles",
    foreignKey: "UserId",
    otherKey: "RoleId",
    onDelete: 'CASCADE'
});

db.ROLES = [RoleTypes.Admin, RoleTypes.Account, RoleTypes.Florist, RoleTypes.Shipper, RoleTypes.User];

module.exports = db;