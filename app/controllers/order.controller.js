const { user } = require("../models");
const db = require("../models");
const Order = db.order;
const OrderDetail = db.orderDetail;
const Customer = db.customer;
const Op = db.Sequelize.Op;
const sequelize = db.sequelize;
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

exports.addBulk = (req, res) => {
    let orders = req.body;
    let obj = [];
    orders.forEach(order => {

        let numberId = 0;;
        let orderType = 'NormalDay';

        if (parseInt(order.Id) != undefined && parseInt(order.Id) != NaN) {
            numberId = parseInt(order.Id);
        } else {
            numberId = -1;
            orderType = 'SpecialDay';
        }

        obj.push({
            CustomerId: order.CustomerId,
            Id: order.Id,
            VATIncluded: order.VATIncluded,
            TotalAmount: order.TotalAmount,
            TotalPaidAmount: order.TotalPaidAmount,
            GainedScore: order.GainedScore,
            ScoreUsed: order.ScoreUsed,
            OrderType: orderType,
            CreatedDate: order.Created,
            PercentDiscount: 0,
            AmountDiscount: 0,
            NumberId: numberId
        });
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

exports.addOrder = (req, res) => {

    let body = req.body;

    let numberId = 0;;
    let orderType = '';

    if (parseInt(body.id) != undefined && parseInt(body.id) != NaN) {
        numberId = parseInt(body.id);
    } else {
        numberId = -1;
        orderType = 'SpecialDay';
    }

    let order = {
        CustomerId: body.customerId,
        Id: body.id,
        VATIncluded: body.vatIncluded,
        TotalAmount: body.totalAmount,
        TotalPaidAmount: body.totalPaidAmount,
        GainedScore: body.gaindedScore,
        ScoreUsed: body.scoreUsed,
        OrderType: orderType,
        CreatedDate: body.createdDate,
        PercentDiscount: body.percentDiscount ? body.percentDiscount : 0,
        AmountDiscount: body.amountDiscount ? body.amountDiscount : 0,
        NumberId: numberId
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

    Order.findAll({
        attributes: [
            [sequelize.fn('MAX', sequelize.col('NumberId')), 'max']
        ],
        where: {
            NumberId: {
                [Op.gt]: -1
            }
        }
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
