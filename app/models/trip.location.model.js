module.exports = (sequelize, Sequelize) => {
    const TripLocation = sequelize.define("tripLocations", {
        Id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        UserId :{
            type: Sequelize.INTEGER,
            allowNull:false
        },
        Name: {
            type: Sequelize.STRING
        },
        Address:{
            type: Sequelize.STRING
        },
        Description: {
            type: Sequelize.STRING
        },
        DisplayImgUrl:{
            type: Sequelize.STRING
        },
        Latitude:{
            type: Sequelize.DOUBLE
        }, 
        Longitude:{
            type: Sequelize.DOUBLE
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

    return TripLocation;
};
