const db = require("../models");
const commonService = require('../services/common.service');
const Customer = db.customer;
const CustomerReciverInfo = db.customerReceiverInfo;
const CustomerSpecialDay = db.customerSpecialDay;
const Op = db.Sequelize.Op;
const guid = require('guid');

exports.updateCustomer = (req, res) => {

}

exports.getById = (req, res) => {

    Customer.findByPk(req.query.id, {
        include: [
            { model: CustomerReciverInfo },
            { model: CustomerSpecialDay },
        ],
    })
        .then(customer => {
            res.send({ customer: customer });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving customers."
            });
        });

}

exports.getList = (req, res) => {

    const { page, size, term } = req.query;

    var condition = term ? {
        [Op.or]: [
            {
                FullName: {
                    [Op.like]: `%${term}%`
                }
            },
            {
                PhoneNumber: {
                    [Op.like]: `${term}%`
                }
            }
        ]

    } : {};

    const { limit, offset } = commonService.getPagination(page, size);

    let countClause = {
        where: condition
    }

    Customer.count(countClause)
        .then(data => {

            const count = data;

            Customer.findAndCountAll({
                where: condition,
                include: [
                    { model: CustomerReciverInfo },
                    { model: CustomerSpecialDay },
                ],
                limit: limit,
                offset: offset
            }).then(newData => {

                newData.count = count;

                const newResponse = commonService.getPagingData(newData, page, limit);

                res.send(newResponse);
            })

        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving customers."
            });
        });
}



exports.getCount = (req, res) => {
    Customer.count()
        .then(count => {
            res.send({
                count: count
            });
        }).catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving customer counting."
            });
        });
}

exports.create = (req, res) => {

    const body = req.body;

    if (!body) {

        res.status(403).send({
            message: 'Body is required'
        });
        return;
    }

    let id = body.id ? body.id : guid.create().toString();

    Customer.create({
        Id: id,
        FullName: body.fullName,
        PhoneNumber: body.phoneNumber,
        Birthday: body.birthday,
        Sex: body.sex,
        UsedScoreTotal: body.usedScoreTotal,
        AvailableScore: body.availableScore,
        AccumulatedAmount: body.accumulatedAmount,
        MembershipType: body.membershipType,
        ContactInfo_Facebook: body.facebook,
        ContactInfo_Zalo: body.zalo,
        ContactInfo_Skype: body.skype,
        ContactInfo_Viber: body.viber,
        ContactInfo_Instagram: body.instagram,
        MainContactInfo: body.mainContactInfo,

    }).then(customer => {

        if (!customer) {
            res.status(500).send({
                message: "Create customer err"
            });
            return;
        }

        res.send({
            customer: customer
        });

    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while create product."
        });
        return;
    })
}