
module.exports = (sequelize, Sequelize) => {
    const Order = sequelize.define("purchases", {
        Id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        OrderId: {
            type: Sequelize.STRING,
            allowNull: true
        },
        Amount: {
            type: Sequelize.BIGINT(11)
        },
        Method: {
            type: Sequelize.STRING
        },
        Status: {
            type: Sequelize.STRING
        },
        AddingTime: {
            type: Sequelize.BIGINT(11),
        },
        createdAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        updatedAt: {
            type: Sequelize.DATE,
            allowNull: true
        }
    });

    return Order;
};