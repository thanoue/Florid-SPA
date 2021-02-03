const db = require("../models");
const Order = db.order;
const OrderDetail = db.orderDetail;
const Op = db.Sequelize.Op;
const Shipping = db.shipping;
const sequelize = db.sequelize;
const Sequelize = sequelize;
const Making = db.making;
const User = db.user;
const ODStatuses = require('../config/app.config').ODStatuses;
const commonService = require("../services/common.service");
const appConstant = require('../config/app.config');
const resultImgFolderPath = appConstant.fileFolderPath.resultImg;
const shippingImgFolderPath = appConstant.fileFolderPath.shipppingImg;
const orderDetailNoteImg = appConstant.fileFolderPath.orderDetailNoteImg;
const logger = require('../config/logger');

let KhachLeId = 'KHACH_LE';

exports.resultConfirm = (req, res) => {

    let resultImgName = "";

    if (req.files) {

        resultImgName = commonService.getNewFileName(req.files.resultImg);

        req.files.resultImg.mv(resultImgFolderPath + resultImgName);
    }
    let updateObj = {
        State: ODStatuses.DeliveryWaiting,
        ResultImageUrl: resultImgName
    };

    OrderDetail.update(updateObj, {
        where: {
            Id: req.body.orderDetailId
        }
    }).then(data => {
        res.send(updateObj);
    }).catch(err => logger.error(err, res));

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
    }).catch(err => logger.error(err, res));

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
    }).catch(err => { logger.error(err, res); });

};

exports.uploadNoteImage = (req, res) => {

    try {
        let noteImg = '';

        if (req.files) {

            noteImg = commonService.getNewFileName(req.files.noteImg);

            req.files.noteImg.mv(orderDetailNoteImg + noteImg);
        }

        res.send({
            imgName: noteImg
        });
    }
    catch (err) {
        logger.error(err, res);
    }
}

exports.updateStatusByOrderId = (req, res) => {

    let orderId = req.body.orderId;
    let status = req.body.status;
    let doneTime = req.body.doneTime;

    OrderDetail.update({
        State: status
    }, {
        where: {
            OrderId: orderId
        }
    }).then(data => {
        Order.update({
            DoneTime: doneTime
        }, {
            where: {
                Id: orderId
            }
        }).then(() => {
            res.send({ data });
        }).catch(err => logger.error(err, res));
    }).catch(err => logger.error(err, res));
}



exports.updateOrderInfos = (req, res) => {

    let rawOrderDetails = req.body.orderDetails;
    let orderId = req.body.orderId;
    let totalPaidAmount = req.body.totalPaidAmount;
    let customerId = req.body.customerId;
    let orderDetails = [];

    rawOrderDetails.forEach(rawOrderDetail => {
        orderDetails.push({
            Id: rawOrderDetail.Id,
            OrderId: rawOrderDetail.OrderId,
            ReceivingTime: rawOrderDetail.DeliveryInfo ? rawOrderDetail.DeliveryInfo.ReceivingTime : 0,
            ReceiverName: rawOrderDetail.DeliveryInfo ? rawOrderDetail.DeliveryInfo.ReceiverDetail.FullName : '',
            ReceiverPhoneNumber: rawOrderDetail.DeliveryInfo ? rawOrderDetail.DeliveryInfo.ReceiverDetail.PhoneNumber : '',
            ReceivingAddress: rawOrderDetail.DeliveryInfo ? rawOrderDetail.DeliveryInfo.ReceiverDetail.Address : '',
            CustomerName: rawOrderDetail.CustomerName ? rawOrderDetail.CustomerName : '',
            CustomerPhoneNumber: rawOrderDetail.CustomerPhoneNumber ? rawOrderDetail.CustomerPhoneNumber : '',
            State: rawOrderDetail.State
        });
    });

    Order.findOne({
        where: {
            Id: orderId
        }
    }).then(order => {

        let command = '';

        if (order.CustomerId != KhachLeId) {

            command += "UPDATE `customers` SET `AccumulatedAmount` =  `AccumulatedAmount` - " + order.GainedScore * 100000 +
                " , `AvailableScore` =  `AvailableScore` - " + order.GainedScore + " WHERE `Id` = \"" + order.CustomerId + "\";";

        }

        if (customerId != KhachLeId) {

            command += "UPDATE `customers` SET `AccumulatedAmount` =  `AccumulatedAmount` + " + order.GainedScore * 100000 +
                " , `AvailableScore` =  `AvailableScore`+" + order.GainedScore + " WHERE `Id` = \"" + customerId + "\";";
        }

        if (command != '') {

            sequelize.query(command).then(data => {

            }).catch(err => { logger.error(err); });
        }


        Order.update({
            CustomerId: customerId,
            TotalPaidAmount: totalPaidAmount
        }, {
            where: {
                Id: orderId
            }
        }).then(() => {

            let rawCommand = "";

            orderDetails.forEach(item => {

                let command = "UPDATE `orderdetails` SET `ReceivingTime` = " + item.ReceivingTime +
                    " , `ReceiverName` = \"" + item.ReceiverName + "\" , `ReceiverPhoneNumber` =\"" + item.ReceiverPhoneNumber +
                    "\", `ReceivingAddress` = \"" + item.ReceivingAddress + "\", `CustomerName` = \"" +
                    item.CustomerName + "\" , `CustomerPhoneNumber` = \"" + item.CustomerPhoneNumber + "\" WHERE `Id` = \"" + item.Id + "\";";

                rawCommand += command;
            });

            sequelize.query(rawCommand).then(data => {
                res.send({ message: 'updated some data' });
            }).catch(err => logger.error(err, res));

        }).catch(err => logger.error(err, res));

    }).catch(err => logger.error(err, res));
}

exports.addOrderDetails = (req, res) => {

    try {

        let rawOrderDetails = req.body.orderDetails;
        let orderDetails = [];

        console.log(rawOrderDetails);

        rawOrderDetails.forEach(rawOrderDetail => {

            let noteimg = rawOrderDetail.NoteImagesBlobbed;

            orderDetails.push({
                Id: rawOrderDetail.Id,
                OrderId: rawOrderDetail.OrderId,
                ProductId: rawOrderDetail.ProductId ? rawOrderDetail.ProductId : null,
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
                IsVATIncluded: rawOrderDetail.IsVATIncluded,
                PurposeOf: rawOrderDetail.PurposeOf,
                IsHardcodeProduct: rawOrderDetail.IsHardcodeProduct,
                HardcodeProductImageName: rawOrderDetail.HardcodeProductImageName ? rawOrderDetail.HardcodeProductImageName : '',
                CustomerName: rawOrderDetail.CustomerName ? rawOrderDetail.CustomerName : '',
                CustomerPhoneNumber: rawOrderDetail.CustomerPhoneNumber ? rawOrderDetail.CustomerPhoneNumber : '',
                Index: rawOrderDetail.Index,
                AmountDiscount: rawOrderDetail.AmountDiscount,
                PercentDiscount: rawOrderDetail.PercentDiscount,
                Quantity: rawOrderDetail.Quantity,
                NoteImages: noteimg
            });

        });

        OrderDetail.bulkCreate(orderDetails, {
            returning: true
        }).then(data => {
            res.send({ orderDetails: orderDetails });
        }).catch(err => logger.error(err, res))
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
        },
        include: [
            {
                model: User,
                as: 'shippers'
            },
            {
                model: User,
                as: 'fixingFlorist'
            },
            {
                model: User,
                as: 'makingFlorist'
            },
            {
                model: Shipping,
                as: 'shippings'
            }
        ]
    }).then(data => {

        if (!data || data == null) {
            res.status(500).send({ message: "order detail not found" });
            return;
        }

        let makingFlorist = data.makingFlorist ? data.makingFlorist : {};
        let fixingFlorist = data.fixingFlorist ? data.fixingFlorist : {};

        let shippers = data.shippers ? data.shippers : [];

        if (shippers.length <= 0) {
            res.status(200).send({ florist: makingFlorist, shipper: {}, fixingFlorist: fixingFlorist });
            return;
        }

        let lastShipping = undefined;

        data.shippings.forEach(shipping => {

            if (lastShipping == undefined || lastShipping.AssignTime < shipping.AssignTime) {
                lastShipping = shipping;
            }

        });


        res.status(200).send({ florist: makingFlorist, shipper: shippers.filter(p => p.Id == lastShipping.ShipperId)[0], fixingFlorist: fixingFlorist });

    }).catch(err => logger.error(err, res));
};

exports.getProcessingOrderDetails = (req, res) => {

    let states = [ODStatuses.Completed, ODStatuses.Canceled];

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
        }).catch(err => logger.error(err, res));

    }).catch(err => logger.error(err, res));
};

exports.updateFields = (req, res) => {

    let obj = req.body.obj;

    OrderDetail.update(obj, {
        where: {
            Id: req.body.orderDetailId
        }
    }).then(val => {
        res.send({ result: val });
    }).catch(err => logger.error(err, res));
}


exports.getByState = (req, res) => {
    let state = req.body.state
    OrderDetail.findAll({
        where: {
            State: state
        }
    }).then(data => {
        res.send({ orderDetails: data });
    }).catch(err => logger.error(err, res));
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
    }).catch(err => logger.error(err, res));
};

exports.getDetailByStates = (req, res) => {

    let states = req.body.states

    let orderColumn = req.body.orderColumn;
    let direction = req.body.direction;

    OrderDetail.findAll({
        where: {
            State: {
                [Op.in]: states
            }
        },
        order: [
            [orderColumn, direction],
        ],
        include: [
            {
                model: Making,
                as: 'makings',
            },
            {
                model: Shipping,
                as: 'shippings',
            }
        ]
    }).then(data => {
        res.send({ orderDetails: data });
    }).catch(err => logger.error(err, res));
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
            },]
        },
        order: [
            ['MakingRequestTime', 'ASC'],
        ]
    }).then(data => {
        res.send({ orderDetails: data });
    }).catch(err => logger.error(err, res));
};

