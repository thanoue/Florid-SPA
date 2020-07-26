module.exports = (sequelize, Sequelize) => {
    const ProductsCategories = sequelize.define("products_categories", {
        ProductId: {
            type: Sequelize.INTEGER,
        },
        CategoryId: {
            type: Sequelize.INTEGER
        }
    });

    return ProductsCategories;
};