module.exports = (sequelize, Sequelize) => {
    const DistrictAddress = sequelize.define("address_districts", {
        Id: {
            type: Sequelize.STRING,
            primaryKey: true,
        },
        Name: {
            type: Sequelize.STRING,
        }
    });
    return DistrictAddress;
}