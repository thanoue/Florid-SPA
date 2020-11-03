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
            type: Sequelize.BIGINT,
        },
        PromotionType: {
            type: Sequelize.STRING
        },
        StartTime: {
            type: Sequelize.BIGINT(11)
        },
        EndTime: {
            type: Sequelize.BIGINT(11)
        },
        IsEnable: {
            type: Sequelize.BOOLEAN
        }
    });
    return Promotion;
};