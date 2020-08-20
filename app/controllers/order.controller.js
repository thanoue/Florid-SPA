const db = require("../models");
const commonService = require("../services/common.service");
const Order = db.order;
const OrderDetail = db.orderDetail;
const Op = db.Sequelize.Op;
const Customer = db.Customer;

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

exports.deleteOrderDetailByOrderId = (req, res) => {

    if (!req.body.orderId) {

        res.status(403).send({
            message: 'order Id is Required'
        });

        return;
    }

    OrderDetail.destroy({
        where: {
            OrderId: req.body.orderId
        }
    }).then(data => {
        res.send({ message: 'deleted some orderDetails' });
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });

}

exports.addOrderDetails = (req, res) => {
    try {
        let rawOrderDetails = req.body.orderDetails;
        let orderDetails = [];

        rawOrderDetails.forEach(rawOrderDetail => {
            orderDetails.push({
                Id: rawOrderDetail.Id,
                OrderId: rawOrderDetail.OrderId,
                ProductId: rawOrderDetail.ProductId ? rawOrderDetail.ProductId : 0,
                ProductName: rawOrderDetail.ProductName ? rawOrderDetail.ProductName : '',
                ProductImageUrl: rawOrderDetail.ProductImageUrl ? rawOrderDetail.ProductImageUrl : '',
                ProductPrice: rawOrderDetail.ProductPrice ? rawOrderDetail.ProductPrice : 0,
                AdditionalFee: rawOrderDetail.AdditionalFee ? rawOrderDetail.AdditionalFee : 0,
                ReceivingTime: rawOrderDetail.DeliveryInfo ? rawOrderDetail.DeliveryInfo.ReceivingTime : 0,
                ReceiverName: rawOrderDetail.DeliveryInfo ? rawOrderDetail.DeliveryInfo.ReceiverDetail.FullName : '',
                ReceiverPhoneNumber: rawOrderDetail.DeliveryInfo ? rawOrderDetail.DeliveryInfo.ReceiverDetail.PhoneNumber : '',
                ReceivingAddress: rawOrderDetail.DeliveryInfo ? rawOrderDetail.DeliveryInfo.ReceiverDetail.Address : '',
                Description: rawOrderDetail.Description,
                State: rawOrderDetail.State,
                MakingSortOrder: 0,
                ShippingSortOrder: 0,
                IsVATIncluded: rawOrderDetail.IsVATIncluded,
                PurposeOf: rawOrderDetail.PurposeOf,
                IsHardcodeProduct: rawOrderDetail.IsHardcodeProduct,
                HardcodeProductImageName: rawOrderDetail.HardcodeProductImageName ? rawOrderDetail.HardcodeProductImageName : '',
                CustomerName: rawOrderDetail.CustomerName ? rawOrderDetail.CustomerName : '',
                CustomerPhoneNumber: rawOrderDetail.CustomerPhoneNumber ? rawOrderDetail.CustomerPhoneNumber : '',
                Index: rawOrderDetail.Index,
                AmountDiscount: rawOrderDetail.AmountDiscount,
                PercentDiscount: rawOrderDetail.PercentDiscount
            });
        });

        OrderDetail.bulkCreate(orderDetails, {
            returning: true
        }).then(data => {
            res.send({ orderDetails: orderDetails });
        });
    }
    catch (err) {
        res.status(500).send({ message: err.message });
    }
};

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
        CreatedDate: body.createdDate
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
        CreatedDate: body.createdDate
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
            }]
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


exports.getProcessingOrderDetails = (req, res) => {

    let states = ['Completed', 'Canceled'];

    OrderDetail.findAll({
        where: {
            State: {
                [Op.notIn]: states
            }
        }
    }).then(orderDetails => {

        if (!orderDetails || orderDetails.length <= 0) {
            res.send({ orderDetails: [] });
            return;
        }

        let orderIds = [];
        orderDetails.forEach(orderDetail => {
            if (orderIds.indexOf(orderDetail.OrderId) < 0) {
                orderIds.push(orderDetail.OrderId);
            }
        });

        Order.findAll({
            where: {
                Id: {
                    [Op.in]: orderIds
                }
            },
            include: [
                { model: OrderDetail },
            ]
        }).then(orders => {
            res.send({
                orders: orders
            });
        }).catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving customer counting."
            });
        });

    }).catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving customer counting."
        });
    });;
};
