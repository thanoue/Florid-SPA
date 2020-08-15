module.exports = (sequelize, Sequelize) => {
    const ProductsCategories = sequelize.define("products_categories", {
        ProductId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        CategoryId: {
            type: Sequelize.INTEGER,
            allowNull: false
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

    return ProductsCategories;
};