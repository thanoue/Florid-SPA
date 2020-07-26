module.exports = (sequelize, Sequelize) => {
    const Role = sequelize.define("roles", {
        Id: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        Name: {
            type: Sequelize.STRING
        }
    });

    return Role;
};