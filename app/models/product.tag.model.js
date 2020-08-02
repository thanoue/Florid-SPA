module.exports = (sequelize, Sequelize) => {
    const ProductsTags = sequelize.define("products_tags", {
        ProductId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        TagId: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    });

    return ProductsTags;
};