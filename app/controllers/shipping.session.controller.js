const { role } = require("../models");
const db = require("../models");
const OrderDetail = db.orderDetail;
const Op = db.Sequelize.Op;
const Shipping = db.shipping;
const ODStatuses = require('../config/app.config').ODStatuses;
const logger = require('../config/logger');

exports.assignSingleOD = (req, res) => {

    let orderDetailId = req.body.orderDetailId;
    let shipperId = req.body.shipperId;
    let assignTime = req.body.assignTime;

    Shipping.create({
        ShipperId: shipperId,
        AssignTime: assignTime,
        OrderDetailId: orderDetailId
    }).then(shippingSession => {
        if (shippingSession) {

            OrderDetail.update({
                State: ODStatuses.DeliverAssinged
            }, {
                where: {
                    Id: orderDetailId
                }
            }).then(data => {
                res.send(shippingSession);
            }).catch(err => logger.error(err, res));

        }
    }).catch(err => logger.error(err, res));
}

exports.getShippingOrderDetails = (req, res) => {

    let shipperId = req.body.shipperId;

    Shipping.findAll({
        where: {
            ShipperId: shipperId,
        },
        include: [
            {
                model: OrderDetail,
                as: 'orderDetail',
                where: {
                    State: {
                        [Op.in]: [ODStatuses.DeliverAssinged, ODStatuses.OnTheWay]
                    }
                }
            }
        ]
    }).then(sessions => {
        res.send(sessions)
    }).catch(err => logger.error(err, res));
}

exports.assignOrderDetails = (req, res) => {

    let orderDetailIds = req.body.orderDetailIds;
    let shipperId = req.body.shipperId;
    let assignTime = req.body.assignTime;

    let obj = [];
    orderDetailIds.forEach(orderDetailId => {
        obj.push({
            ShipperId: shipperId,
            AssignTime: assignTime,
            OrderDetailId: orderDetailId
        });
    });

    Shipping.bulkCreate(obj, {
        returning: true
    }).then(shippingSession => {
        if (shippingSession) {

            OrderDetail.update({
                State: ODStatuses.DeliverAssinged
            }, {
                where: {
                    Id: {
                        [Op.in]: orderDetailIds
                    }
                }
            }).then(data => {
                res.send(shippingSession);
            }).catch(err => {
                console.log(err);
                res.status(500).send({ message: err });
            });

        }
    }).catch(err => logger.error(err, res));
}