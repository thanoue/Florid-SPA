const db = require("../models");
const commonService = require('../services/common.service');
const Customer = db.customer;
const CustomerReciverInfo = db.customerReceiverInfo;
const CustomerSpecialDay = db.customerSpecialDay;
const Sequelize = db.sequelize;
const sequelize = db.sequelize;
const Order = db.order;
const Op = db.Sequelize.Op;
const logger = require('../config/logger');
const guid = require('guid');
var fs = require('fs');
const MemberShipType = require('../config/app.config').MemberShipType;


exports.updateList = (req, res) => {

    let obj = [];

    req.body.forEach(item => {
        obj.push({
            Id: item.Id,
            AccumulatedAmount: item.TotalAmount,
            MembershipType: item.MemberType,
            UsedScoreTotal: item.TotalUsedScore,
            AvailableScore: item.AvailableScore
        });
    });

    let rawCommand = "";

    let exeptCustomerIds = ['KHACH_LE', 'FD-01128', 'FD-01130', 'FD-01129', 'FD-00336', 'FD-00592', 'FD-00011', 'KHACH_LE', 'FD-00168', 'FD-01114', 'FD-01113', 'KHACH_LE', 'FD-00456', 'FD-00842', 'FD-01115', 'FD-00047', 'FD-01116', 'FD-01117', 'FD-01118', 'FD-00011', 'FD-00842', 'FD-00402', 'FD-01119', 'FD-01120', 'FD-01121', 'FD-01122', 'FD-00834', 'FD-01123', 'FD-00839', 'FD-01124', 'FD-01125', 'FD-00417', 'FD-01124', 'FD-01126', 'FD-01127', 'FD-00206', 'FD-00950', 'FD-00688', 'FD-00881', 'FD-01122', 'FD-00972', 'FD-01122', 'FD-00402', 'FD-00688', 'KHACH_LE', 'FD-00118', 'FD-00855', 'FD-00610', 'FD-00875', 'FD-00895', 'KHACH_LE', 'FD-01017', 'FD-00476', 'FD-00011', 'FD-01018', 'FD-01019', 'KHACH_LE', 'FD-01020', 'FD-00011', 'KHACH_LE', 'FD-00819', 'FD-01021', 'KHACH_LE', 'FD-01022', 'FD-01026', 'KHACH_LE', 'FD-01023', 'FD-01024', 'FD-01025', 'FD-01021', 'FD-00011', 'KHACH_LE', 'FD-00310', 'FD-01028', 'FD-00037', 'FD-01029', 'KHACH_LE', 'FD-01030', 'KHACH_LE', 'FD-00834', 'FD-00675', 'FD-00165', 'FD-01033', 'FD-01034', 'FD-00213', 'FD-01017', 'FD-01017', 'FD-01017', 'FD-00655', 'FD-00629', 'FD-00834', 'FD-01035', 'FD-00688', 'FD-01036', 'FD-00151', 'FD-01037', 'FD-00675'];

    obj.forEach(item => {

        let dup = exeptCustomerIds.filter(p => p == item.Id);

        if (!dup || dup.length <= 0) {
            let command = "UPDATE `customers` SET `AccumulatedAmount` = " + item.AccumulatedAmount + " , `AvailableScore` = " + item.AvailableScore + " , `MembershipType` =\"" + item.MembershipType + "\", `UsedScoreTotal` = " + item.UsedScoreTotal + " WHERE `Id` = \"" + item.Id + "\";";
            rawCommand += command;
        }

    });

    Sequelize.query(rawCommand).then(data => {
        res.send({ message: 'updated some customer' });
    }).catch(err => logger.error(err, res));
}

exports.createCustomers = (req, res) => {

    let rawCuses = req.body.customers;

    let customers = [];

    let exeptCustomerIds = ['KHACH_LE', 'FD-01128', 'FD-01130', 'FD-01129', 'FD-00336', 'FD-00592', 'FD-00011', 'KHACH_LE', 'FD-00168', 'FD-01114', 'FD-01113', 'KHACH_LE', 'FD-00456', 'FD-00842', 'FD-01115', 'FD-00047', 'FD-01116', 'FD-01117', 'FD-01118', 'FD-00011', 'FD-00842', 'FD-00402', 'FD-01119', 'FD-01120', 'FD-01121', 'FD-01122', 'FD-00834', 'FD-01123', 'FD-00839', 'FD-01124', 'FD-01125', 'FD-00417', 'FD-01124', 'FD-01126', 'FD-01127', 'FD-00206', 'FD-00950', 'FD-00688', 'FD-00881', 'FD-01122', 'FD-00972', 'FD-01122', 'FD-00402', 'FD-00688', 'KHACH_LE', 'FD-00118', 'FD-00855', 'FD-00610', 'FD-00875', 'FD-00895', 'KHACH_LE', 'FD-01017', 'FD-00476', 'FD-00011', 'FD-01018', 'FD-01019', 'KHACH_LE', 'FD-01020', 'FD-00011', 'KHACH_LE', 'FD-00819', 'FD-01021', 'KHACH_LE', 'FD-01022', 'FD-01026', 'KHACH_LE', 'FD-01023', 'FD-01024', 'FD-01025', 'FD-01021', 'FD-00011', 'KHACH_LE', 'FD-00310', 'FD-01028', 'FD-00037', 'FD-01029', 'KHACH_LE', 'FD-01030', 'KHACH_LE', 'FD-00834', 'FD-00675', 'FD-00165', 'FD-01033', 'FD-01034', 'FD-00213', 'FD-01017', 'FD-01017', 'FD-01017', 'FD-00655', 'FD-00629', 'FD-00834', 'FD-01035', 'FD-00688', 'FD-01036', 'FD-00151', 'FD-01037', 'FD-00675'];

    rawCuses.forEach(cus => {

        let dup = exeptCustomerIds.filter(p => p == cus.id);

        if (!dup || dup.length <= 0) {

            var idParts = cus.id.split('-');

            var numberId = idParts.length > 1 ? parseInt(idParts[1]) : -1;

            customers.push({
                FullName: cus.fullName,
                PhoneNumber: cus.phoneNumber,
                Birthday: cus.birthday,
                Sex: cus.sex,
                HomeAddress: cus.homeAddress,
                WorkAddress: cus.workAddress,
                UsedScoreTotal: cus.usedScoreTotal,
                AvailableScore: cus.availableScore,
                AccumulatedAmount: cus.accumulatedAmount,
                MembershipType: cus.membershipType,
                ContactInfo_Facebook: cus.facebook,
                ContactInfo_Zalo: cus.zalo,
                ContactInfo_Skype: cus.skype,
                ContactInfo_Viberviber: cus.viber,
                ContactInfo_Instagram: cus.instagram,
                MainContactInfo: cus.mainContactInfo,
                Id: cus.id,
                NumberId: numberId
            });

        }
    })

    Customer.bulkCreate(customers, {
        returning: true
    }).then(data => {
        res.send({ customers: customers });
    }).catch(err => logger.error(err, res));
}

exports.updateTotalAmount = (req, res) => {
    Customer.findAll({
        include: [
            {
                model: Order,
                as: 'orders'
            }
        ]
    }).then(customers => {

        let updateCommand = '';

        customers.forEach(customer => {

            let totalAmount = 0;

            if (customer.orders && customer.orders.length > 0 && customer.Id != 'KHACH_LE') {

                customer.orders.forEach(order => {
                    totalAmount += order.TotalAmount;
                });

                let score = totalAmount / 100000;

                let memberShipType = MemberShipType.NewCustomer;

                if (totalAmount < 5000000) {
                    memberShipType = MemberShipType.NewCustomer;
                }

                if (totalAmount >= 5000000 && totalAmount < 10000000) {
                    memberShipType = MemberShipType.Member;
                }

                if (totalAmount >= 10000000 && totalAmount < 30000000) {
                    memberShipType = MemberShipType.Vip;
                }

                if (totalAmount >= 30000000) {
                    memberShipType = MemberShipType.VVip;
                }

                let command = " update `customers` set `AccumulatedAmount` = " + totalAmount + ", `MembershipType` = \"" + memberShipType + "\" , `AvailableScore` = " + score +
                    " where `Id` = \"" + customer.Id + "\";";

                updateCommand += command;

            }

        });

        Sequelize.query(updateCommand).then(data => {
            res.send({ message: data });
        }).catch(err => logger.error(err, res));

    }).catch(err => logger.error(err, res));
}

exports.updateCustomerIds = (req, res) => {

    Customer.findAll({
        where: {
            NumberId: {
                [Op.gt]: 875
            }
        }
    }).then(customers => {
        let numberId = 1017;

        let orderCommand = ''
        customers.forEach(customer => {
            let id = `FD-0${numberId.toString()}`;

            let conmmand = "UPDATE `customers` SET `Id` = \"" + id + "\" WHERE `Id` = \"" + customer.Id + "\";" +
                "UPDATE `orders` SET `CustomerId` = \"" + id + "\" WHERE `CustomerId` = \"" + customer.Id + "\";";
            orderCommand += conmmand;
            numberId += 1;
        });


        Sequelize.query(orderCommand).then(data => {
            res.send({ message: 'updated some customer' });
        }).catch(err => logger.error(err, res));

    }).catch(err => logger.error(err, res));
};

exports.updateReceiverList = (req, res) => {

    if (!req.body.customerId) {

        res.status(403).send({
            message: 'customer Id is Required'
        });

        return;
    }

    CustomerReciverInfo.destroy({
        where: {
            CustomerId: req.body.customerId
        }
    }).then(data => {

        if (req.body.receiverList && req.body.receiverList.length > 0) {

            let entities = [];

            req.body.receiverList.forEach(receiverInfo => {
                entities.push({
                    CustomerId: req.body.customerId,
                    FullName: receiverInfo.FullName,
                    PhoneNumber: receiverInfo.PhoneNumber,
                    Address: receiverInfo.Address
                });
            });

            CustomerReciverInfo.bulkCreate(entities, {
                returning: true
            }).then(final => {

                res.send({ message: 'Customer Receiver info updated' });

            }).catch(err => logger.error(err, res));

        } else {
            res.send({ message: 'Deleted some customer receiver information' });
        }

    }).catch(err => logger.error(err, res));
};

exports.getById = (req, res) => {

    Customer.findByPk(req.query.id, {
        include: [
            { model: CustomerReciverInfo, as: 'receivers' },
            { model: CustomerSpecialDay, as: 'specialDays' },
        ],
    }).then(customer => {
        res.send({ customer: customer });
    }).catch(err => logger.error(err, res));
}

exports.getAll = (req, res) => {
    Customer.findAll()
        .then(customers => {
            res.send({ customers: customers });
        }).catch(err => logger.error(err, res));
}

exports.getList = (req, res) => {

    const { page, size, term, memberShipType } = req.query;

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

    if (memberShipType !== 'All') {
        condition['MembershipType'] = memberShipType;
    }

    if (page == -1 || size == -1) {

        Customer.findAll({
            where: condition,
            subQuery: false,
            order: [['createdAt', 'DESC']],
            include: [
                { model: CustomerReciverInfo, as: 'receivers' },
                { model: CustomerSpecialDay, as: 'specialDays' },
            ],
        })
            .then(customers => {
                res.send({
                    totalItemCount: -1,
                    items: customers,
                    totalPages: -1,
                    currentPage: -1
                });
            })
            .catch(err => logger.error(err, res));

    } else {

        const { limit, offset } = commonService.getPagination(page, size);

        Customer.count({
            where: condition
        }).then(data => {

            const count = data;

            Customer.findAndCountAll({
                subQuery: false,
                order: [['createdAt', 'DESC']],
                where: condition,
                limit: limit,
                offset: offset
            }).then(newData => {

                newData.count = count;

                const newResponse = commonService.getPagingData(newData, page, limit);

                console.log('count:', count);
                console.log('items:', newResponse.items.length);

                res.send(newResponse);
            })

        }).catch(err => logger.error(err, res));
    }

}

exports.getCount = (req, res) => {
    Customer.findAll({
        attributes: [
            [sequelize.fn('MAX', sequelize.col('NumberId')), 'max']
        ],
    }).then(count => {
        res.send(count[0].dataValues);
    }).catch(err => logger.error(err, res));
}

exports.updateCustomer = (req, res) => {
    const body = req.body;

    let updates = {
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
        HomeAddress: body.homeAddress,
        WorkAddress: body.workAddress,
    }

    Customer.update(updates, {
        where: {
            Id: req.body.id
        }
    }).then(result => {

        CustomerSpecialDay.destroy({
            where: {
                CustomerId: body.id
            }
        }).then(() => {
            if (body.specialDays) {

                let specialDays = [];

                body.specialDays.forEach(specialDate => {
                    specialDays.push({
                        Date: specialDate.date,
                        Description: specialDate.description,
                        CustomerId: body.id
                    });
                });

                CustomerSpecialDay.bulkCreate(specialDays, {
                    returning: false
                }).then(() => {
                    res.send({
                        message: 'a Custoner is Updated'
                    });
                }).catch(err => logger.error(err, res));

            } else {
                res.send({
                    message: 'a Custoner is Updated'
                });
            }
        }).catch(err => logger.error(err, res));

    }).catch(err => logger.error(err, res));
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

    var idParts = id.split('-');

    var numberId = idParts.length > 1 ? parseInt(idParts[1]) : -1;

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
        NumberId: numberId

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

    }).catch(err => logger.error(err, res));
}

exports.delete = (req, res) => {
    Customer.destroy({
        where: {
            Id: req.body.id
        }
    }).then(() => {
        res.send({
            message: 'a customer is deleted'
        });
    }).catch(err => logger.error(err, res));
}

exports.deleteMany = (req, res) => {

    let ids = req.body.ids;

    Customer.destroy({
        where: {
            Id: {
                [Op.in]: ids
            }
        }
    }).then(() => {
        res.send({
            message: 'Customers are  deleted'
        });
    }).catch((err) => logger.error(err, res));
}

function getMemberType(amount, config) {

    if (amount < config.MemberValue) {
        return MemberShipType.NewCustomer;
    }

    if (amount >= config.MemberValue && amount < config.VipValue) {
        return MemberShipType.Member;
    }

    if (amount >= config.VipValue && amount < config.VVipValue) {
        return MemberShipType.Vip;
    }

    if (amount >= config.VVipValue) {
        return MemberShipType.VVip;
    }
}

exports.updateAllCustomerMemberType = (req, res) => {

    let config = req.body.config;

    Customer.findAll({
        where: {
            Id: {
                [Op.ne]: 'KHACH_LE'
            }
        }
    }).then(customers => {

        let command = '';

        customers.forEach(customer => {

            command += "UPDATE `customers` SET `MembershipType` = \'" + getMemberType(customer.AccumulatedAmount, config) + "\' WHERE `Id` = \'" + customer.Id + "\';";

        });

        sequelize.query(command).then(data => {

            res.send({ update: data });

        }).catch(err => logger.error(err, res));

    });
}

exports.updateFields = (req, res) => {

    let obj = req.body.obj;

    Customer.update(obj, {
        where: {
            Id: req.body.customerId
        }
    }).then(val => {
        res.send({ result: val });
    }).catch(err => logger.error(err, res));
}
