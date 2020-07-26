module.exports = (sequelize, Sequelize) => {
    const ProductsTags = sequelize.define("products_tags", {
        ProductId: {
            type: Sequelize.INTEGER,
        },
        TagId: {
            type: Sequelize.INTEGER
        }
    });

    return ProductsTags;
};