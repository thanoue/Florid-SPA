module.exports = (sequelize, Sequelize) => {
    const OrderDetail = sequelize.define("orderDetails", {
        Id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        OrderId: {
            type: Sequelize.STRING,
        },
        ProductId: {
            type: Sequelize.INTEGER,
        },
        ProductName: {
            type: Sequelize.STRING,
        },
        ProductImageUrl: {
            type: Sequelize.STRING,
        },
        ProductPrice: {
            type: Sequelize.BIGINT,
        },
        CustomerName: {
            type: Sequelize.STRING
        },
        CustomerPhoneNumber: {
            type: Sequelize.STRING
        },
        AdditionalFee: {
            type: Sequelize.BIGINT,
        },
        ReceivingTime: {
            type: Sequelize.BIGINT(11)
        },
        ReceiverName: {
            type: Sequelize.STRING
        },
        ReceiverPhoneNumber: {
            type: Sequelize.STRING
        },
        ReceivingAddress: {
            type: Sequelize.STRING
        },
        Description: {
            type: Sequelize.STRING
        },
        State: {
            type: Sequelize.STRING
        },
        MakingSortOrder: {
            type: Sequelize.INTEGER
        },
        ShippingSortOrder: {
            type: Sequelize.INTEGER
        },
        IsVATIncluded: {
            type: Sequelize.BOOLEAN
        },
        PurposeOf: {
            type: Sequelize.STRING
        },
        IsHardcodeProduct: {
            type: Sequelize.BOOLEAN
        },
        HardcodeProductImageName: {
            type: Sequelize.STRING
        },
        FloristId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        MakingRequestTime: {
            type: Sequelize.BIGINT(11)
        },
        CompletedTime: {
            type: Sequelize.BIGINT(11)
        },
        ShippingSessionId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        ResultImageUrl: {
            type: Sequelize.STRING
        },
        DeliveryImageUrl: {
            type: Sequelize.STRING
        },
        Index: {
            type: Sequelize.INTEGER
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

    return OrderDetail;
};