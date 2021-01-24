
const { role } = require("../models");
const db = require("../models");
const OrderDetailSeen = db.orderDetailSeen;
const User = db.user;
const logger = require('../config/logger');
const Role = db.role;

exports.updateDetailSeen = (req, res) => {

    let userId = req.body.userId;
    let orderDetailId = req.body.orderDetailId;
    let seentTime = req.body.seenTime;

    OrderDetailSeen.findAll({
        where: {
            OrderDetailId: orderDetailId,
            UserId: userId
        }
    }).then(seens => {
        if (seens != undefined && seens.length > 0) {
            res.send({
                message: 'done'
            });
            return;
        } else {
            OrderDetailSeen.create({
                OrderDetailId: orderDetailId,
                UserId: userId,
                SeenTime: seentTime
            }).then(data => {
                res.send({
                    message: 'done'
                });
            }).catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving information."
                });
            })
        }
    }).catch(err => logger.error(err, res));
};

exports.getODSeeners = (req, res) => {
    let odId = req.body.orderDetailId;

    OrderDetailSeen.findAll({
        where: {
            OrderDetailId: odId
        },
        include: {
            model: User,
            include: Role
        }
    }).then(data => {
        res.send({ seeners: data });
    }).catch(err => logger.error(err, res));
};
