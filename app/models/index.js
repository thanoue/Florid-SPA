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