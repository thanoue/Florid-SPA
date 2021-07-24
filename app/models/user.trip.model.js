module.exports = (sequelize, Sequelize) => {
    const UserTrip = sequelize.define("users_trips", {
        Id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        UserId: {
            type: Sequelize.INTEGER,
            allowNull:false
        },
        TripId:{
            type: Sequelize.INTEGER,
            allowNull:false
        }
    });

    return UserTrip;
};
