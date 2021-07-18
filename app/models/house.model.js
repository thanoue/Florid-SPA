module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("houses", {
        Id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        FullName: {
            type: Sequelize.STRING
        },
        Address:{
            type: Sequelize.STRING
        },
        PhoneNumber:{
            type: Sequelize.STRING
        }, 
        OwnerId:{
            type: Sequelize.INTEGER
        },
        ImgUrl: {
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

    return User;
};
