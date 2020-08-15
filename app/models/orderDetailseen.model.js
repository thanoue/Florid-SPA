module.exports = (sequelize, Sequelize) => {
    const OrderDetailSeen = sequelize.define('orderDetailSeens', {
        UserId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        OrderDetailId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        SeenTime: {
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
    return OrderDetailSeen;
}