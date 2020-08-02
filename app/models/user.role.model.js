module.exports = (sequelize, Sequelize) => {
    const UsersRoles = sequelize.define("users_roles", {
        RoleId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        UserId: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    });

    return UsersRoles;
};