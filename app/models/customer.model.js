module.exports = (sequelize, Sequelize) => {
    const Customer = sequelize.define("customer", {
        Id: {
            type: Sequelize.STRING,
            primaryKey: true,
        },
        FullName: {
            type: Sequelize.STRING
        },
        PhoneNumber: {
            type: Sequelize.STRING
        },
        Birthday: {
            type: Sequelize.BIGINT(11)
        },
        HomeAddress: {
            type: Sequelize.STRING
        },
        WorkAddress: {
            type: Sequelize.STRING
        },
        ContactInfo_Facebook: {
            type: Sequelize.STRING
        },
        ContactInfo_Zalo: {
            type: Sequelize.STRING
        },
        ContactInfo_Skype: {
            type: Sequelize.STRING
        },
        ContactInfo_Viber: {
            type: Sequelize.STRING
        },
        ContactInfo_Instagram: {
            type: Sequelize.STRING
        },
        Sex: {
            type: Sequelize.STRING
        },
        MainContactInfo: {
            type: Sequelize.STRING
        },
        UsedScoreTotal: {
            type: Sequelize.FLOAT
        },
        AvailableScore: {
            type: Sequelize.FLOAT
        },
        AccumulatedAmount: {
            type: Sequelize.BIGINT
        },
        MembershipType: {
            type: Sequelize.STRING
        },
    });

    return Customer;
};
