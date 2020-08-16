module.exports = (sequelize, Sequelize) => {
    const Order = sequelize.define("orders", {
        Id: {
            type: Sequelize.STRING,
            primaryKey: true,
        },
        CustomerId: {
            type: Sequelize.STRING,
        },
        VATIncluded: {
            type: Sequelize.BOOLEAN
        },
        TotalAmount: {
            type: Sequelize.BIGINT
        },
        TotalPaidAmount: {
            type: Sequelize.BIGINT
        },
        GainedScore: {
            type: Sequelize.FLOAT
        },
        ScoreUsed: {
            type: Sequelize.INTEGER
        },
        OrderType: {
            type: Sequelize.STRING
        },
        CreatedDate: {
            type: Sequelize.BIGINT(11)
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