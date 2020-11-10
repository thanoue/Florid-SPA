const db = require("../models");
const commonService = require('../services/common.service');
const Customer = db.customer;
const CustomerReciverInfo = db.customerReceiverInfo;
const CustomerSpecialDay = db.customerSpecialDay;
const Sequelize = db.sequelize;
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
        });
    });

    let rawCommand = "";

    obj.forEach(item => {
        let command = "UPDATE `customers` SET `AccumulatedAmount` = " + item.AccumulatedAmount + " , `MembershipType` =\"" + item.MembershipType + "\", `UsedScoreTotal` = " + item.UsedScoreTotal + " WHERE `Id` = \"" + item.Id + "\";";
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
            Id: cus.id
        });
    })

    Customer.bulkCreate(customers, {
        returning: true
    }).then(data => {
        res.send({ customers: customers });
    });
}

exports.bulkAdd = (req, res) => {

    try {

        let specialDays = [];
        let customers = [];

        fs.readFile('hardcodes/customers.json', { encoding: 'utf8' }, (err, data) => {

            let rawCustomers = JSON.parse(data);

            rawCustomers.forEach(rawCustomer => {

                let customer = {
                    Id: rawCustomer.Id,
                    FullName: rawCustomer.FullName,
                    PhoneNumber: rawCustomer.PhoneNumber ? rawCustomer.PhoneNumber : '',
                    Birthday: rawCustomer.Birthday ? rawCustomer.Birthday : 0,
                    HomeAddress: rawCustomer.Address && rawCustomer.Address.Home ? rawCustomer.Address.Home : '',
                    WorkAddress: rawCustomer.Address && rawCustomer.Address.Work ? rawCustomer.Address.Work : '',
                    ContactInfo_Facebook: rawCustomer.ContactInfo && rawCustomer.ContactInfo.Facebook ? rawCustomer.ContactInfo.Facebook : '',
                    ContactInfo_Zalo: rawCustomer.ContactInfo && rawCustomer.ContactInfo.Zalo ? rawCustomer.ContactInfo.Zalo : '',
                    ContactInfo_Skype: rawCustomer.ContactInfo && rawCustomer.ContactInfo.Skype ? rawCustomer.ContactInfo.Skype : '',
                    ContactInfo_Viber: rawCustomer.ContactInfo && rawCustomer.ContactInfo.Viber ? rawCustomer.ContactInfo.Viber : '',
                    ContactInfo_Instagram: rawCustomer.ContactInfo && rawCustomer.ContactInfo.Instagram ? rawCustomer.ContactInfo.Instagram : '',
                    Sex: rawCustomer.Sex ? rawCustomer.Sex : 'Male',
                    MainContactInfo: rawCustomer.MainContactInfo,
                    UsedScoreTotal: rawCustomer.MembershipInfo.UsedScoreTotal,
                    AvailableScore: rawCustomer.MembershipInfo.AvailableScore,
                    AccumulatedAmount: rawCustomer.MembershipInfo.AccumulatedAmount,
                    MembershipType: rawCustomer.MembershipInfo.MembershipType
                };

                customers.push(customer);

                if (rawCustomer.SpecialDays && rawCustomer.SpecialDays.length > 0) {

                    rawCustomer.SpecialDays.forEach(rawSpecialDay => {

                        specialDays.push({
                            Date: rawSpecialDay.Date,
                            Description: rawSpecialDay.Description,
                            CustomerId: rawCustomer.Id
                        });

                    });
                }

            });


            Customer.bulkCreate(customers, {
                returning: true
            }).then(result => {
                CustomerSpecialDay.bulkCreate(specialDays, {
                    returning: true
                }).then(done => {
                    res.send({ customers: customers });
                });
            });

        });

    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while create bulk customer."
        });
        return;
    }
}

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

    if (page == -1 && size == -1) {

        Customer.findAll({
            where: condition
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
