module.exports = (sequelize, Sequelize) => {
    const Category = sequelize.define("categories", {
        Id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        Description: {
            type: Sequelize.STRING
        },
        Name: {
            type: Sequelize.STRING
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

    return Category;
};
