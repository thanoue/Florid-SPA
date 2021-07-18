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
db.districtAddress = require('./district.address.model')(sequelize, Sequelize);
db.wardAddress = require('./ward.address.model')(sequelize, Sequelize);
db.provinceAddress = require('./province.address.model')(sequelize, Sequelize);
db.house = require('./house.model')(sequelize,Sequelize);
db.user_house = require('./user.house.model')(sequelize,Sequelize);

db.house.belongsToMany(db.user, {
    through: "users_houses",
    foreignKey: "HouseId",
    otherKey: "UserId",
    onDelete: 'CASCADE',
    as: 'houseMembers'
});

db.user.belongsToMany(db.house, {
    through: "users_houses",
    foreignKey: "UserId",
    otherKey: "HouseId",
    onDelete: 'CASCADE',
    as: 'userHouses'
});

db.house.belongsTo(db.user, {
    foreignKey: 'OwnerId',
    onDelete: 'SET NULL',
    as:'houseOwner'
});

db.user.hasMany(db.house, {
    foreignKey: 'OwnerId',
    onDelete: 'SET NULL',
    as:'ownHouses'
});

module.exports = db;