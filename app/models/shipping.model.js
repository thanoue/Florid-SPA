module.exports = (sequelize, Sequelize) => {
    const Shipping = sequelize.define('shippings', {
        Id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        ShipperId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        OrderDetailId: {
            type: Sequelize.INTEGER,
            allowNull: true
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
    }, {
        indexes: [
            {
                unique: false,
                fields: ['ShipperId', 'OrderDetailId']
            },
            {
                unique: false,
                fields: ['OrderDetailId', 'ShipperId']
            }
        ]
    });

    return Shipping;
}