module.exports = (sequelize, Sequelize) => {
    const ProductsCategories = sequelize.define("products_categories", {
        ProductId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        CategoryId: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    });

    return ProductsCategories;
};