module.exports = (sequelize, Sequelize) => {
    const ProductsTags = sequelize.define("products_tags", {
        ProductId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        TagId: {
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

    return ProductsTags;
};