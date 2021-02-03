module.exports = (sequelize, Sequelize) => {
    const Making = sequelize.define('makings', {
        Id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        FloristId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        OrderDetailId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        AssignTime: {
            type: Sequelize.BIGINT(11)
        },
        StartTime: {
            type: Sequelize.BIGINT(11)
        },
        CompleteTime: {
            type: Sequelize.BIGINT(11)
        },
        ResultImageUrl: {
            type: Sequelize.STRING
        },
        MakingType: {
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

    return Making;
}