const db = require("../models");
const commonService = require('../services/common.service');
const Customer = db.customer;
const CustomerReciverInfo = db.customerReceiverInfo;
const CustomerSpecialDay = db.customerSpecialDay;
const Sequelize = db.sequelize;
const sequelize = db.sequelize;
const Op = db.Sequelize.Op;
const guid = require('guid');
var fs = require('fs');

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

    obj.forEach(item => {
        let command = "UPDATE `customers` SET `AccumulatedAmount` = " + item.AccumulatedAmount + " , `AvailableScore` = " + item.AvailableScore + " , `MembershipType` =\"" + item.MembershipType + "\", `UsedScoreTotal` = " + item.UsedScoreTotal + " WHERE `Id` = \"" + item.Id + "\";";
        rawCommand += command;
    });

    Sequelize.query(rawCommand).then(data => {
        res.send({ message: 'updated some customer' });
    }).catch(err => {
        console.log(err);
    });
}

exports.createCustomers = (req, res) => {

    let rawCuses = req.body.customers;

    let customers = [];

    rawCuses.forEach(cus => {

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
    })

    Customer.bulkCreate(customers, {
        returning: true
    }).then(data => {
        res.send({ customers: customers });
    });
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
        }).catch(err => {
            console.log(err);
            res.status(500).send({ message: 'updated some customer' });
        });

    });
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

            }).catch(err => {

                res.status(500).send({
                    message: err.message || "Some error occurred while update receiver."
                });

            });

        } else {
            res.send({ message: 'Deleted some customer receiver information' });
        }

    })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while update receiver."
            });
        });
};

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

exports.getAll = (req, res) => {
    Customer.findAll()
        .then(customers => {
            res.send({ customers: customers });
        }).catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving customers."
            });
        });
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

    } : memberShipType == 'All' ? {} : {
        MembershipType: memberShipType
    };

    if (page == -1 || size == -1) {

        Customer.findAll({
            where: condition,
            subQuery: false,
            order: [['createdAt', 'DESC']],
            include: [
                { model: CustomerReciverInfo },
                { model: CustomerSpecialDay },
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
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving customers."
                });
            })

    } else {

        const { limit, offset } = commonService.getPagination(page, size);

        let countClause = {
            where: condition
        }

        Customer.count(countClause)
            .then(data => {

                const count = data;

                Customer.findAndCountAll({
                    subQuery: false,
                    order: [['createdAt', 'DESC']],
                    include: [
                        { model: CustomerReciverInfo },
                        { model: CustomerSpecialDay },
                    ],
                    where: condition,
                    limit: limit,
                    offset: offset
                }).then(newData => {

                    newData.count = count;

                    const newResponse = commonService.getPagingData(newData, page, limit);

                    res.send(newResponse);
                })

            })
            .catch(err => {
                console.log(err);
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving customers."
                });
            });
    }

}

exports.getCount = (req, res) => {
    Customer.findAll({
        attributes: [
            [sequelize.fn('MAX', sequelize.col('NumberId')), 'max']
        ],
    })
        .then(count => {
            console.log('value is:', count[0].dataValues);
            res.send(count[0].dataValues);
        }).catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving customer counting."
            });
        });
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
                });
            } else {
                res.send({
                    message: 'a Custoner is Updated'
                });
            }
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while create product."
            });
            return;
        })
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while create product."
        });
        return;
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

    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while create product."
        });
        return;
    })
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
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while delete product."
        });
        return;
    });
}

exports.deleteMany = (req, res) => {

    let ids = req.body.ids;

    Customer.destroy({
        where: {
            Id: {
                [Op.in]: ids
            }
        }
    })
        .then(() => {
            res.send({
                message: 'Customers are  deleted'
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({ message: err });
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
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
}
