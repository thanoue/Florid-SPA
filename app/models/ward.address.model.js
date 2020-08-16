module.exports = (sequelize, Sequelize) => {
    const WardAddress = sequelize.define("address_wards", {
        Id: {
            type: Sequelize.STRING,
            primaryKey: true,
        },
        DistrictId: {
            type: Sequelize.STRING,
        },
        Name: {
            type: Sequelize.STRING,
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
    return WardAddress;
}