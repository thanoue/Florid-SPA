module.exports = (sequelize, Sequelize) => {
    const CustomerSpecialDay = sequelize.define("customerSpecialDays", {
        Id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        Date: {
            type: Sequelize.BIGINT(11),
        },
        Description: {
            type: Sequelize.STRING,
        },
        CustomerId: {
            type: Sequelize.STRING,
            allowNull: false
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
    return CustomerSpecialDay;
}