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

const appConstant = require('../config/app.config');
const resultImgFolderPath = appConstant.fileFolderPath.resultImg;
const shippingImgFolderPath = appConstant.fileFolderPath.shipppingImg;

exports.resultConfirm = (req, res) => {

    let resultImgName = "";

    if (req.files) {

        resultImgName = commonService.getNewFileName(req.files.resultImg);

        req.files.resultImg.mv(resultImgFolderPath + resultImgName);
    }

    OrderDetail.findAll({
        attributes: [[Sequelize.fn('max', Sequelize.col('ShippingSortOrder')), 'maxShippingSortOrder']],
        raw: true,
    }).then(value => {

        let nextShippingOrder = value[0].maxShippingSortOrder + 1;

        let updateObj = {
            State: 'DeliveryWaiting',
            ShippingSortOrder: nextShippingOrder,
            ResultImageUrl: resultImgName
        };

        OrderDetail.update(updateObj, {
            where: {
                Id: req.body.orderDetailId
            }
        }).then(data => {
            res.send(updateObj);
        }).catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving information."
            });
        });

    }).catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving information."
        });
    });
}

exports.shippingConfirm = (req, res) => {

    let shippingImgName = "";

    if (req.files) {

        shippingImgName = commonService.getNewFileName(req.files.shippingImg);

        req.files.shippingImg.mv(shippingImgFolderPath + shippingImgName);
    }

    let updateObj = {
        State: 'Deliveried',
        ShippingSortOrder: 0,
        MakingSortOrder: 0,
        DeliveryImageUrl: shippingImgName,
        DeliveryCompletedTime: req.body.deliveryCompletedTime,
        ShippingNote: req.body.note
    };

    OrderDetail.update(updateObj, {
        where: {
            Id: req.body.orderDetailId
        }
    }).then(data => {
        res.send(updateObj);
    }).catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving information."
        });
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

exports.getByOrderId = (req, res) => {

    if (!req.body.orderId) {

        res.status(403).send({
            message: 'order Id is Required'
        });

        return;
    }

    OrderDetail.findAll({
        where: {
            OrderId: req.body.orderId
        }
    }).then(orderDetails => {
        res.status(200).send({
            orderDetails: orderDetails
        });
    });

};

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
                PercentDiscount: rawOrderDetail.PercentDiscount,
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

exports.getOrderDetailShipperAndFlorist = (req, res) => {

    let orderDetailId = req.body.orderDetailId;

    OrderDetail.findOne({
        where: {
            Id: orderDetailId
        }
    }).then(data => {

        if (!data || data == null) {
            res.status(500).send({ message: "order detail not found" });
            return;
        }

        let floristId = data.FloristId;
        let fixingFloristId = data.FixingFloristId;
        let shippingSessionId = data.ShippingSessionId;

        if (floristId && floristId != 0) {

            User.findOne({
                where: {
                    Id: floristId
                }
            }).then(florist => {

                if (!florist || florist == null) {
                    res.status(200).send({ florist: {}, shipper: {}, fixingFlorist: {} });
                    return;
                }

                if (!shippingSessionId || shippingSessionId == 0) {
                    res.status(200).send({ florist: florist, shipper: {}, fixingFlorist: {} });
                    return;
                }

                ShippingSession.findOne({
                    where: {
                        Id: shippingSessionId
                    },
                    include: [
                        {
                            model: User,
                        }
                    ]
                }).then(session => {

                    if (!session || session == null) {
                        res.status(200).send({ florist: florist, shipper: {}, fixingFlorist: {} });
                        return;
                    }

                    User.findOne({
                        where: {
                            Id: fixingFloristId
                        }
                    }).then(fixing => {

                        if (!fixing || fixing == null) {
                            res.status(200).send({ florist: florist, shipper: session.user, fixingFlorist: {} });
                            return;
                        }

                        res.status(200).send({ florist: florist, shipper: session.user, fixingFlorist: fixing });
                        return;
                    })
                })

            });
        }
        else {
            res.status(200).send({ florist: {}, shipper: {} });
            return;
        }
    })
};

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

exports.updateFields = (req, res) => {

    let obj = req.body.obj;

    OrderDetail.update(obj, {
        where: {
            Id: req.body.orderDetailId
        }
    }).then(val => {
        res.send({ result: val });
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });

}

exports.getMaxMakingSortOrder = (req, res) => {
    OrderDetail.findAll({
        attributes: [[Sequelize.fn('max', Sequelize.col('MakingSortOrder')), 'maxMakingSortOrder']],
        raw: true,
    }).then(value => {
        res.send(value[0]);
    }).catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving information."
        });
    });
};

exports.getMaxShippingSortOrder = (req, res) => {
    OrderDetail.findAll({
        attributes: [[Sequelize.fn('max', Sequelize.col('ShippingSortOrder')), 'maxShippingSortOrder']],
        raw: true,
    }).then(value => {
        res.send(value[0]);
    }).catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving information."
        });
    });
};

exports.getByState = (req, res) => {
    let state = req.body.state
    OrderDetail.findAll({
        where: {
            State: state
        }
    }).then(data => {
        res.send({ orderDetails: data });
    }).catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving information."
        });
    });
};

exports.getDetailByStateAndFloristId = (req, res) => {
    let state = req.body.state
    OrderDetail.findAll({
        where: {
            State: state,
            FloristId: req.body.floristId
        }
    }).then(data => {
        res.send({ orderDetails: data });
    }).catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving information."
        });
    });
};

exports.getDetailByStates = (req, res) => {

    let states = req.body.states

    OrderDetail.findAll({
        where: {
            State: {
                [Op.in]: states
            }
        }
    }).then(data => {
        res.send({ orderDetails: data });
    }).catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving information."
        });
    });
};

exports.getDetailByStatesAndFlorist = (req, res) => {
    let states = req.body.states
    OrderDetail.findAll({
        where: {
            [Op.and]: [{
                [Op.or]: [
                    { FloristId: req.body.floristId },
                    { FixingFloristId: req.body.floristId }
                ]
            }, {
                State: {
                    [Op.in]: states
                }
            }]
        }
    }).then(data => {
        res.send({ orderDetails: data });
    }).catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving information."
        });
    });
};

exports.updateMakingSortOrder = (req, res) => {

    try {
        var details = req.body.details;

        if (details == undefined || details.length <= 0) {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving information."
            });
            return;
        }

        details.forEach(detail => {
            OrderDetail.update({
                MakingSortOrder: detail.MarkingSortOrder
            }, {
                where: {
                    Id: detail.Id
                }
            })
        });

        res.send({ message: 'Details Order is Updated' });
    }
    catch (err) {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving information."
        });
    }
};

exports.updateShippingSortOrder = (req, res) => {

    try {
        var details = req.body.details;

        if (details == undefined || details.length <= 0) {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving information."
            });
            return;
        }

        details.forEach(detail => {
            OrderDetail.update({
                ShippingSortOrder: detail.ShippingSortOrder
            }, {
                where: {
                    Id: detail.Id
                }
            })
        });

        res.send({ message: 'Details Order is Updated' });
    }
    catch (err) {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving information."
        });
    }
};