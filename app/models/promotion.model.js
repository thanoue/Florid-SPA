module.exports = (sequelize, Sequelize) => {
    const Promotion = sequelize.define("promotions", {
        Id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        Name: {
            type: Sequelize.STRING,
        },
        Amount: {
            type: Sequelize.LONG,
        },
        PromotionType: {
            type: Sequelize.STRING
        },
        StartTime: {
            type: Sequelize.BIGINT(11)
        },
        EndTime: {
            type: Sequelize.BIGINT(11)
        }
    });
    return Order;
};