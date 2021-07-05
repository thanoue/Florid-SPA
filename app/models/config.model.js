module.exports = (sequelize, Sequelize) => {
    const Category = sequelize.define("configs", {
        Id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        MemberValue: {
            type: Sequelize.BIGINT(11)
        },
        MemberDiscount: {
            type: Sequelize.FLOAT
        },
        VipValue: {
            type: Sequelize.BIGINT(11)
        },
        VipDiscount: {
            type: Sequelize.FLOAT
        },
        VVipValue: {
            type: Sequelize.BIGINT(11)
        },
        VVipDiscount: {
            type: Sequelize.FLOAT
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

    return Category;
};
