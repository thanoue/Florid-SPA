module.exports = (sequelize, Sequelize) => {
    const CustomerReceiverInfo = sequelize.define("customerReceivers", {
        Id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        FullName: {
            type: Sequelize.STRING,
        },
        PhoneNumber: {
            type: Sequelize.STRING,
        },
        CustomerId: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });
    return CustomerReceiverInfo;
}