module.exports = (sequelize, Sequelize) => {
    const Making = sequelize.define('makings', {
        Id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        FloristId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        OrderDetailId: {
            type: Sequelize.INTEGER,
            allowNull: true
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
    }, {
        indexes: [
            {
                unique: false,
                fields: ['FloristId', 'OrderDetailId']
            },
            {
                unique: false,
                fields: ['OrderDetailId', 'FloristId']
            }
        ]
    });

    return Making;
}