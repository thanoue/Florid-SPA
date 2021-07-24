module.exports = (sequelize, Sequelize) => {
    const Trip = sequelize.define("trips", {
        Id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        Name: {
            type: Sequelize.STRING
        },
        OwnerId:{
            type: Sequelize.INTEGER,
            allowNull: true
        },
        StartPointName:{
            type: Sequelize.STRING,
        },   
        StartPointAddress:{
            type: Sequelize.STRING,
        },
        StartPointLatitude:{
            type: Sequelize.DOUBLE
        },
        StartPointLongitute:{
            type: Sequelize.DOUBLE
        },
        EndPointName:{
            type: Sequelize.STRING,
        },
        EndPointAddress:{
            type: Sequelize.STRING,
        },
        EndPointLatitude:{
            type: Sequelize.DOUBLE
        },
        EndPointLongitute:{
            type: Sequelize.DOUBLE
        },
        ImgUrl: {
            type: Sequelize.STRING
        },
        Description: {
            type: Sequelize.STRING
        },
        Status: {
            type: Sequelize.INTEGER
        }, 
        EndTimeMilisecond: {
            type: Sequelize.DOUBLE
        }, 
        StartTimeMilisecond: {
            type: Sequelize.DOUBLE
        }, 
        ExecuteTimeMilisecond: {
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

    return Trip;
};
