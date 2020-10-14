const { role } = require("../models");
const db = require("../models");
const commonService = require("../services/common.service");
const Order = db.order;
const OrderDetail = db.orderDetail;
const Op = db.Sequelize.Op;
const Sequelize = db.Sequelize;
const ShippingSession = db.shippingSession;
const OrderDetailSeen = db.orderDetailSeen;
const User = db.user;
const Role = db.role;

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
        ]

    }).then(order => {
        res.send({ order: order });
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
}

exports.addOrder = (req, res) => {

    let body = req.body;
    let order = {
        CustomerId: body.customerId,
        Id: body.id,
        VATIncluded: body.vatIncluded,
        TotalAmount: body.totalAmount,
        TotalPaidAmount: body.totalPaidAmount,
        GainedScore: body.gaindedScore,
        ScoreUsed: body.scoreUsed,
        OrderType: body.orderType,
        CreatedDate: body.createdDate,
        PercentDiscount: body.percentDiscount ? body.percentDiscount : 0,
        AmountDiscount: body.amountDiscount ? body.amountDiscount : 0
    }

    try {
        Order.create(order)
            .then(orderRes => {
                res.send({ order: orderRes });
            }).catch(err => {
                res.status(500).send({ message: err.message });
            });
    } catch (err) {
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
        OrderType: body.orderType,
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

exports.getNormalDayOrdersCount = (req, res) => {

    Order.count({
        where: {
            OrderType: 'NormalDay'
        }
    })
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
        ],
        order: [
            ['CreatedDate', 'DESC'],
        ]
    }).then(orders => {
        res.send({
            orders: orders
        });
    }).catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving orders"
        });
    });

}

exports.searchByPhoneNumberOrCustomerName = (req, res) => {

    let term = req.body.term;

    var condition = term ? {
        [Op.or]: [
            {
                CustomerName: {
                    [Op.like]: `%${term}%`
                }
            },
            {
                CustomerPhoneNumber: {
                    [Op.like]: `%${term}%`
                }
            }
        ]

    } : {};

    Order.findAll({
        include: [
            {
                model: OrderDetail,
                where: condition
            },
        ],
        order: [
            ['CreatedDate', 'DESC'],
        ]
    }).then(orders => {
        res.send({
            orders: orders
        });
    }).catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving orders"
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
