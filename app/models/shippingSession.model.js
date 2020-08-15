module.exports = (sequelize, Sequelize) => {
    const ShippingSession = sequelize.define('shippingSession', {
        Id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        ShipperId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        AssignTime: {
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

    return ShippingSession;
}