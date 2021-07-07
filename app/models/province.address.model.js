module.exports = (sequelize, Sequelize) => {
    const DistrictAddress = sequelize.define("address_provinces", {
        Id: {
            type: Sequelize.STRING,
            primaryKey: true,
        },
        Name: {
            type: Sequelize.STRING,
        },
        Type: {
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
    return DistrictAddress;
}