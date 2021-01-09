const { user } = require("../models");
const db = require("../models");
const Order = db.order;
const OrderDetail = db.orderDetail;
const Customer = db.customer;
const Op = db.Sequelize.Op;
const sequelize = db.sequelize;
const commonService = require('../services/common.service');
const Purchase = db.purchase;

exports.getByCustomer = (req, res) => {

    if (!req.body.customerId) {

        res.status(403).send({
            message: 'Customer Id is Required'
        });

        return;
    }

    Order.findAll({
        where: {
            CustomerId: req.body.customerId
        },
        include: [
            { model: OrderDetail },
            { model: Customer },
            { model: Purchase }
        ]

    }).then(orders => {
        res.send({ orders: orders });
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
}

exports.getByDayRange = (req, res) => {

    var startTime = req.body.startDate;
    var endTime = req.body.endDate;

    Order.findAll({
        where: {
            CreatedDate: {
                [Op.between]: [startTime, endTime]
            },
            TotalPaidAmount: {
                [Op.gte]: sequelize.col('TotalAmount')
            }
        },
        include: [
            { model: Customer },
            { model: OrderDetail },
            { model: Purchase }
        ]
    }).then(orders => {
        res.send({ orders: orders });
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
}

exports.getById = (req, res) => {

    if (!req.body.id) {

        res.status(403).send({
            message: 'Id is Required'
        });

        return;
    }

    Order.findOne({
        where: {
            Id: req.body.id
        },
        include: [
            { model: OrderDetail },
            { model: Customer },
            { model: Purchase }
        ]

    }).then(order => {
        res.send({ order: order });
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
}

exports.getNotLazyById = (req, res) => {

    if (!req.body.id) {

        res.status(403).send({
            message: 'Id is Required'
        });

        return;
    }

    Order.findOne({
        where: {
            Id: req.body.id
        },
    }).then(order => {
        res.send({ order: order });
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
}

exports.addBulk = (req, res) => {

    let orders = req.body;
    let obj = [];
    orders.forEach(order => {

        if (order.Id) {

            obj.push({
                CustomerId: order.CustomerId,
                Id: order.Id,
                VATIncluded: order.VATIncluded,
                TotalAmount: order.TotalAmount,
                TotalPaidAmount: order.TotalPaidAmount,
                GainedScore: order.GainedScore,
                ScoreUsed: order.ScoreUsed,
                CreatedDate: order.Created,
                PercentDiscount: 0,
                AmountDiscount: 0,
                NumberId: order.NumberId
            });
        }

    });
    Order.bulkCreate(obj, {
        returning: true
    }).then(orderRes => {
        res.send({ message: "Some order are added" });
    }).catch(err => {
        console.log(err);
        res.status(500).send({ message: err.message });
    });
}

exports.updateMemberDiscountApplies = (req, res) => {

    Order.findAll({
        include: [
            {
                model: Customer,
                where: {
                    MembershipType: {
                        [Op.ne]: 'NewCustomer'
                    }
                }
            }
        ]
    }).then(data => {

        let ids = [];

        data.forEach(order => {
            ids.push(order.Id);
        });

        Order.update({
            IsMemberDiscountApply: true
        }, {
            where: {
                Id: {
                    [Op.in]: ids
                }
            }
        }).then(updateData => {
            res.send({ data: updateData });
        })
    }).catch(err => {
        console.log(err);
        res.status(500).send({ message: err.message | err });
    });

}

exports.addOrder = (req, res) => {

    let body = req.body;

    let numberId = 0;

    let id = body.id.split('.')[1];

    if (parseInt(id) != undefined && parseInt(id) != NaN) {
        numberId = parseInt(id);
    } else {
        numberId = -1;
    }

    let order = {
        CustomerId: body.customerId,
        Id: body.id,
        VATIncluded: body.vatIncluded,
        TotalAmount: body.totalAmount,
        TotalPaidAmount: body.totalPaidAmount,
        GainedScore: body.gaindedScore,
        ScoreUsed: body.scoreUsed,
        CreatedDate: body.createdDate,
        PercentDiscount: body.percentDiscount ? body.percentDiscount : 0,
        AmountDiscount: body.amountDiscount ? body.amountDiscount : 0,
        NumberId: numberId,
        IsMemberDiscountApply: body.isMemberDiscountApply ? body.isMemberDiscountApply : false,
        DoneTime: body.doneTime
    }

    try {
        Order.create(order)
            .then(orderRes => {
                res.send({ order: orderRes });
            }).catch(err => {
                console.log(err);
                res.status(500).send({ message: err.message });
            });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: err.message });
    }
}

exports.editOrder = (req, res) => {

    let body = req.body;

    let order = {
        CustomerId: body.customerId,
        VATIncluded: body.vatIncluded,
        TotalAmount: body.totalAmount,
        TotalPaidAmount: body.totalPaidAmount,
        GainedScore: body.gaindedScore,
        ScoreUsed: body.scoreUsed,
        CreatedDate: body.createdDate,
        PercentDiscount: body.percentDiscount,
        AmountDiscount: body.amountDiscount
    }

    try {

        Order.update(order, {
            where: {
                Id: req.body.id
            }
        })
            .then(orderRes => {
                res.send({ order: orderRes });
            }).catch(err => {
                res.status(500).send({ message: err.message });
            });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}

exports.getMaxNumberByYearId = (req, res) => {

    let year = req.body.year;

    var command = "select MAX(`NumberId`) as `max` from `orders` where `NumberId` > -1 AND EXTRACT(YEAR FROM `createdAt`) = " + year + ";";

    sequelize.query(command).then(data => {

        res.send(data[0][0]);

    }).catch(err => {

        console.log(err);

        res.status(500).send({
            message:
                err.message || err
        });
    });
};

exports.getByStates = (req, res) => {

    let states = req.body.states;

    Order.findAll({
        include: [
            {
                model: OrderDetail,
                where: {
                    State: {
                        [Op.in]: states
                    }
                }
            },
            { model: Customer },
            { model: Purchase }

        ],
        order: [
            ['CreatedDate', 'DESC'],
        ]
    }).then(orders => {
        res.send({
            orders: orders
        });
    }).catch(err => {
        console.log(err);
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving orders"
        });
    });

}

exports.getDebts = (req, res) => {

    const page = req.body.page;
    const size = req.body.size;
    const startTime = req.body.startTime ? req.body.startTime : 0;
    const endTime = req.body.endTime ? req.body.endTime : Number.MAX_VALUE;

    var condition = {
        TotalPaidAmount: { [Op.lt]: sequelize.col('TotalAmount') },
        DoneTime: {
            [Op.between]: [startTime, endTime]
        }
    };

    const { limit, offset } = commonService.getPagination(page, size);

    let countClause = {
        where: condition
    }

    Order.count(countClause)
        .then(data => {

            const count = data;

            Order.findAndCountAll({
                where: countClause.where,
                include: [
                    { model: OrderDetail },
                    { model: Customer }
                ],
                limit: limit,
                offset: offset
            }).then(newData => {

                newData.count = count;

                const newResponse = commonService.getPagingData(newData, page, limit);
                newResponse.totalItemCount = count;
                res.send(newResponse);
            })

        })
        .catch(err => {
            console.log(err);
            res.status(500).send({
                message:
                    err.message || err
            });
        });
}

exports.searchOrders = (req, res) => {

    let term = req.body.term;
    let page = req.body.page;
    let size = req.body.size;
    let statuses = req.body.statuses;

    if (!page || page < 0)
        page = 0;

    if (!size || size < 0)
        size = 20;

    var orderDetailCond = {
        State: {
            [Op.in]: statuses
        }
    }

    var cusCondition = term ? {
        [Op.or]: [
            {
                FullName: {
                    [Op.like]: `%${term}%`
                }
            },
            {
                PhoneNumber: {
                    [Op.like]: `%${term}%`
                }
            }
        ]

    } : {};

    const { limit, offset } = commonService.getPagination(page, size);

    Order.count({
        include: [
            {
                model: OrderDetail,
                where: orderDetailCond
            },
            {
                model: Customer,
                where: cusCondition
            }
        ]
    }).then(count => {

        Order.findAndCountAll({
            subQuery: false,
            order: [['CreatedDate', 'DESC']],
            include: [
                { model: Purchase },
                {
                    model: OrderDetail,
                    where: orderDetailCond
                },
                {
                    model: Customer,
                    where: cusCondition
                }
            ],
            limit: limit,
            offset: offset

        }).then(newData => {

            newData.count = count;

            const newResponse = commonService.getPagingData(newData, page, limit);

            res.send(newResponse);

        }).catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving orders"
            });
        });
    });
}

exports.updateOrderFields = (req, res) => {

    let obj = req.body.obj;

    Order.update(obj, {
        where: {
            Id: req.body.orderId
        }
    }).then(val => {
        res.send({ result: val });
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });

}
