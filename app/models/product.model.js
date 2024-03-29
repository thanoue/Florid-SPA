module.exports = (sequelize, Sequelize) => {
    const Product = sequelize.define("products", {
        Id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        Name: {
            type: Sequelize.STRING
        },
        Price: {
            type: Sequelize.STRING
        },
        ImageUrl: {
            type: Sequelize.STRING
        },
        Description: {
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

    return Product;
};
