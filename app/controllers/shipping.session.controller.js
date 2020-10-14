const { role } = require("../models");
const db = require("../models");
const Order = db.order;
const OrderDetail = db.orderDetail;
const Op = db.Sequelize.Op;
const Sequelize = db.Sequelize;
const ShippingSession = db.shippingSession;
const User = db.user;
const fs = require('fs');
const commonService = require("../services/common.service");

exports.assignSingleOD = (req, res) => {

    let orderDetailId = req.body.orderDetailId;
    let shipperId = req.body.shipperId;
    let assignTime = req.body.assignTime;

    ShippingSession.create({
        ShipperId: shipperId,
        AssignTime: assignTime
    }).then(shippingSession => {
        if (shippingSession) {
            OrderDetail.update({
                ShippingSessionId: shippingSession.Id,
                State: 'Delivering'
            }, {
                where: {
                    Id: orderDetailId
                }
            }).then(data => {
                res.send(shippingSession);
            }).catch(err => {
                res.status(500).send({ message: err.message });
            });
        }
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
}

exports.getShippingOrderDetails = (req, res) => {
    let shipperId = req.body.shipperId;

    ShippingSession.findAll({
        where: {
            ShipperId: shipperId
        },
        include: [
            {
                model: OrderDetail,
                as: 'orderDetails',
                where: {
                    State: 'Delivering'
                }
            }
        ]
    }).then(sessions => {
        res.send(sessions)
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
}

exports.assignOrderDetails = (req, res) => {

    let orderDetailIds = req.body.orderDetailIds;
    let shipperId = req.body.shipperId;
    let assignTime = req.body.assignTime;

    ShippingSession.create({
        ShipperId: shipperId,
        AssignTime: assignTime
    }).then(shippingSession => {
        if (shippingSession) {
            OrderDetail.update({
                ShippingSessionId: shippingSession.Id,
                State: 'Delivering'
            }, {
                where: {
                    Id: {
                        [Op.in]: orderDetailIds
                    }
                }
            }).then(data => {
                res.send(shippingSession);
            }).catch(err => {
                res.status(500).send({ message: err.message });
            });
        }
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
}