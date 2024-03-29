module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
        Id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        FullName: {
            type: Sequelize.STRING
        },
        LoginName: {
            type: Sequelize.STRING
        },
        Email: {
            type: Sequelize.STRING
        },
        Password: {
            type: Sequelize.STRING
        },
        PhoneNumber: {
            type: Sequelize.STRING
        },
        AvtUrl: {
            type: Sequelize.STRING
        },
        IsPrinter: {
            type: Sequelize.BOOLEAN
        },
        IsExternalShipper: {
            type: Sequelize.BOOLEAN
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

    return User;
};
