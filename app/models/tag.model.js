module.exports = (sequelize, Sequelize) => {
    const Tag = sequelize.define("tags", {
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
        Alias: {
            type: Sequelize.STRING
        }
    });

    return Tag;
};
