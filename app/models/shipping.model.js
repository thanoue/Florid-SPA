module.exports = (sequelize, Sequelize) => {
    const Shipping = sequelize.define('shippings', {
        Id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        ShipperId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        OrderDetailId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        AssignTime: {
            type: Sequelize.BIGINT(11)
        },
        StartTime: {
            type: Sequelize.BIGINT(11)
        },
        CompleteTime: {
            type: Sequelize.BIGINT(11)
        },
        Note: {
            type: Sequelize.STRING
        },
        DeliveryImageUrl: {
            type: Sequelize.STRING
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

    return Shipping;
}