const db = require("../models");
const commonService = require("../services/common.service");
const Order = db.order;
const OrderDetail = db.orderDetail;
const Op = db.Sequelize.Op;

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
            });
        });

        OrderDetail.bulkCreate(orderDetail, {
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
        OrderType: body.orderType
    }

    try {
        Order.create(order)
            .then(orderRes => {
                res.send({ order: orderRes });
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