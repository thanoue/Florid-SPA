const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    config.DB,
    config.USER,
    config.PASSWORD,
    {
        host: config.HOST,
        dialect: config.dialect,
        operatorsAliases: false,

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
db.session = require("./session.model.js")(sequelize, Sequelize);
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
db.shippingSession = require('./shippingSession.model')(sequelize, Sequelize);
db.orderDetailSeen = require('./orderDetailseen.model')(sequelize, Sequelize);
db.districtAddress = require('./district.address.model')(sequelize, Sequelize);
db.wardAddress = require('./ward.address.model')(sequelize, Sequelize);
db.promotion = require('./promotion.model')(sequelize, Sequelize);

db.order.hasMany(db.orderDetail, {
    foreignKey: 'OrderId',
    onDelete: 'SET NULL'
})

db.customer.hasMany(db.order, {
    foreignKey: 'CustomerId',
    onDelete: 'SET NULL'
});

db.districtAddress.hasMany(db.wardAddress, {
    foreignKey: 'DistrictId',
    onDelete: 'CASCADE'
});

db.user.hasMany(db.shippingSession, {
    foreignKey: 'ShipperId',
    onDelete: 'CASCADE',
});
db.shippingSession.belongsTo(db.user, {
    foreignKey: 'ShipperId',
    onDelete: 'CASCADE',
});


db.product.hasMany(db.orderDetail, {
    foreignKey: 'ProductId',
    onDelete: 'SET NULL'
})

db.user.hasMany(db.orderDetail, {
    foreignKey: 'FloristId',
    onDelete: 'SET NULL',
});

db.shippingSession.hasMany(db.orderDetail, {
    foreignKey: 'ShippingSessionId',
    onDelete: 'SET NULL',
});

db.user.hasMany(db.orderDetailSeen, {
    foreignKey: 'UserId',
    onDelete: 'CASCADE',
});
db.orderDetailSeen.belongsTo(db.user, {
    foreignKey: 'UserId',
    onDelete: 'CASCADE',
});

db.orderDetail.hasMany(db.orderDetailSeen, {
    foreignKey: 'OrderDetailId',
    onDelete: 'CASCADE',
});
db.orderDetailSeen.belongsTo(db.orderDetail, {
    foreignKey: 'OrderDetailId',
    onDelete: 'CASCADE',
});

// db.user.belongsToMany(db.orderDetail, {
//     through: "orderDetailSeens",
//     foreignKey: "UserId",
//     otherKey: "OrderDetailId",
//     onDelete: 'CASCADE'
// });

// db.orderDetail.belongsToMany(db.user, {
//     through: "orderDetailSeens",
//     foreignKey: "OrderDetailId",
//     otherKey: "UserId",
//     onDelete: 'CASCADE'
// });

db.customer.hasMany(db.customerReceiverInfo, {
    foreignKey: 'CustomerId',
    onDelete: 'CASCADE',
});

db.customer.hasMany(db.customerSpecialDay, {
    foreignKey: 'CustomerId',
    onDelete: 'CASCADE',
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

db.ROLES = ["Admin", "Account", "Florist", "Shipper", "User"];

module.exports = db;