module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users_houses", {
        Id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        UserId: {
            type: Sequelize.INTEGER
        },
        HouseId:{
            type: Sequelize.INTEGER
        }
    });

    return User;
};
