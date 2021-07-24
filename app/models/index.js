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
db.trip = require('./trip.model')(sequelize,Sequelize);
db.user_trip = require('./user.trip.model')(sequelize,Sequelize);
db.milestone = require('./milestone.model')(sequelize,Sequelize);

db.trip.belongsToMany(db.user, {
    through: "users_trips",
    foreignKey: "TripId",
    otherKey: "UserId",
    onDelete: 'CASCADE',
    as: 'members'
});

db.user.belongsToMany(db.trip, {
    through: "users_trips",
    foreignKey: "UserId",
    otherKey: "TripId",
    onDelete: 'CASCADE',
    as: 'trips'
});

db.trip.belongsTo(db.user, {
    foreignKey: 'OwnerId',
    onDelete: 'SET NULL',
    as:'tripOwner'
});

db.user.hasMany(db.trip, {
    foreignKey: 'OwnerId',
    onDelete: 'SET NULL',
    as:'ownTrips'
});

module.exports = db;