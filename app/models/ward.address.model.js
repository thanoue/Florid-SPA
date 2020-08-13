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
        }
    });
    return WardAddress;
}