module.exports = (sequelize, Sequelize) => {
    const Session = sequelize.define("session", {
        UserId: {
            type: Sequelize.INTEGER,
        },
        Token: {
            type: Sequelize.STRING
        },
        ExpireTime: {
            type: Sequelize.DATE,
        },
        IsExpired: {
            type: Sequelize.BOOLEAN
        }
    });

    return Session;
};