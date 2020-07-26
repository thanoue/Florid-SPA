module.exports = (sequelize, Sequelize) => {
    const UsersRoles = sequelize.define("users_roles", {
        RoleId: {
            type: Sequelize.INTEGER,
        },
        UserId: {
            type: Sequelize.INTEGER
        }
    });

    return UsersRoles;
};