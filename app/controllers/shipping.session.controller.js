const { role, making } = require("../models");
const db = require("../models");
const OrderDetail = db.orderDetail;
const Op = db.Sequelize.Op;
const Shipping = db.shipping;
const appConstant = require('../config/app.config');
const Making = db.making;
const ODStatuses = appConstant.ODStatuses;
const shippingImgFolderPath = appConstant.fileFolderPath.shipppingImg;
const commonService = require("../services/common.service");
const logger = require('../config/logger');
const sequelize = db.sequelize;
const MakingTypes = appConstant.MakingTypes;

exports.assignSingleOD = function(req, res){

    var orderDetailId = req.body.orderDetailId;
    var shipperId = req.body.shipperId;
    var assignTime = req.body.assignTime;

    Shipping.findOne({
        where:{
            ShipperId: shipperId,
            OrderDetailId: orderDetailId
        }
    }).then(function(oldShipping){

        if(!oldShipping || oldShipping == null || oldShipping==undefined){

            Shipping.create({
                ShipperId: shipperId,
                AssignTime: assignTime,
                OrderDetailId: orderDetailId
            }).then(shippingSession => {
        
                OrderDetail.update({
                    State: ODStatuses.DeliverAssinged,
                }, {
                    where: {
                        Id: orderDetailId
                    }
                }).then(data => {
                    res.send(shippingSession);
        
                }).catch(err => logger.error(err, res));
        
            }).catch(err => logger.error(err, res));
        }
        else{
            Shipping.update({
                AssignTime: assignTime,
                Note:'',
                CompleteTime:0,
                StartTime:0,
                DeliveryImageUrl:''
            }).then(function(shipping){

                OrderDetail.update({
                    State: ODStatuses.DeliverAssinged,
                }, {
                    where: {
                        Id: orderDetailId
                    }
                }).then(data => {

                    res.send(shipping);
        
                }).catch(err => logger.error(err, res));

            }).catch(err => logger.error(err, res));
        }
    });
}

exports.replaceShipper = (req, res) => {

    let orderDetailId = req.body.orderDetailId;
    let newShipperId = req.body.newShipperId;
    let oldShippingId = req.body.oldShippingId;
    let newAssignTime = req.body.newAssignTime;

    Shipping.destroy({
        where: {
            Id: oldShippingId
        }
    }).then(data => {

        if (newShipperId != undefined && newShipperId != -1) {

            Shipping.create({
                ShipperId: newShipperId,
                AssignTime: newAssignTime,
                OrderDetailId: orderDetailId
            }).then(add => {
                res.send({ message: 'added new shipping!' });
            }).catch(err => logger.error(err, res));
        } else {
            res.send({ message: 'removed a shipping!' });
        }

    }).catch(err => logger.error(err, res));
}

exports.replaceFlorist = (req, res) => {

    let orderDetailId = req.body.orderDetailId;
    let newFloristId = req.body.newFloristId;
    let oldMakingId = req.body.oldMakingId;
    let newAssignTime = req.body.newAssignTime;

    Making.destroy({
        where: {
            Id: oldMakingId
        }
    }).then(data => {

        if (newFloristId != undefined && newFloristId != -1) {

            Making.create({
                ShipperId: newFloristId,
                AssignTime: newAssignTime,
                OrderDetailId: orderDetailId
            }).then(add => {
                res.send({ message: 'added new making!' });
            }).catch(err => logger.error(err, res));
        } else {
            res.send({ message: 'removed a making!' });
        }

    }).catch(err => logger.error(err, res));
}

exports.assignSingleMaking = (req, res) => {

    let orderDetailId = req.body.orderDetailId;
    let floristId = req.body.floristId;
    let assignTime = req.body.assignTime;
    let makingType = req.body.makingType;

    Making.findOne({
        where:{
            FloristId : floristId,
            OrderDetailId :orderDetailId
        }
    }).then(oldMaking => {

        if (!oldMaking || oldMaking == null) {

            Making.create({
                FloristId: floristId,
                AssignTime: assignTime,
                OrderDetailId: orderDetailId,
                MakingType: makingType
            }).then(making => {
        
                OrderDetail.update({
                    State: makingType == MakingTypes.Fixing ? ODStatuses.FixerAssigned : ODStatuses.FloristAssigned
                }, {
                    where: {
                        Id: orderDetailId
                    }
                }).then(function(){
                    res.send(making);
                }).catch(function(err){logger.error(err, res);});
        
            }).catch(function(err){logger.error(err, res);});
        }        
        else{

            Making.update({
                AssignTime: assignTime,
                MakingType: makingType,
                StartTime:0,
                CompleteTime:0,
                ResultImageUrl:''
            },{
                where:{
                    FloristId : floristId,
                    OrderDetailId :orderDetailId
                }
            }).then(making =>{
                OrderDetail.update({
                    State: makingType == MakingTypes.Fixing ? ODStatuses.FixerAssigned : ODStatuses.FloristAssigned
                }, {
                    where: {
                        Id: orderDetailId
                    }
                }).then(data => {
                    res.send(making);
                }).catch(err => logger.error(err, res));

            }).catch(err => logger.error(err, res));
        }

    });

}

function shippingConfirmation(req, res, shippingImgName) {

    let shippingId = req.body.shippingId;
    let orderrDetailId = req.body.orderrDetailId;

    let updateObj = {
        DeliveryImageUrl: shippingImgName,
        CompleteTime: req.body.deliveryCompletedTime,
        Note: req.body.note
    };

    Shipping.update(updateObj, {
        where: {
            Id: shippingId
        }
    }).then(() => {

        OrderDetail.update({
            State: ODStatuses.Deliveried
        }, {
            where: {
                Id: orderrDetailId
            }
        }).then(data => {

            res.send(updateObj);

        }).catch(err => logger.error(err, res));

    }).catch(err => logger.error(err, res));
}

exports.shippingConfirm = (req, res) => {

    let shippingImgName = "";

    if (req.files) {

        shippingImgName = commonService.getNewFileName(req.files.shippingImg);

        req.files.shippingImg.mv(shippingImgFolderPath + shippingImgName, (err => {

            if (err) {
                logger.error(err, res);
                return;
            }

            shippingConfirmation(req, res, shippingImgName);

        }));

    } else {
        shippingConfirmation(req, res, '');
    }

}

exports.updateShippingFields = (req, res) => {

    Shipping.update(req.body.obj, {
        where: {
            Id: req.body.id
        }
    }).then(data => {
        res.send({ message: data });
    }).catch(err => logger.error(err, res));
}

exports.updateMakingFields = (req, res) => {

    Making.update(req.body.obj, {
        where: {
            Id: req.body.id
        }
    }).then(data => {
        res.send({ message: data });
    }).catch(err => logger.error(err, res));
}

exports.getMakingOrderDetails = (req, res) => {

    let floristId = req.body.floristId;

    OrderDetail.findAll({
        where: {
            State: {
                [Op.in]: [ODStatuses.FloristAssigned, ODStatuses.Making, ODStatuses.FixerAssigned, ODStatuses.Fixing]
            }
        },
        order: [['MakingRequestTime', 'ASC']],
        include: [
            {
                model: Making,
                as: 'orderDetailMakings',
                where: {
                    FloristId: floristId
                },
            }
        ]
    }).then(orderDetails => {
        res.send(orderDetails)
    }).catch(err => logger.error(err, res));
}

exports.getShippingOrderDetails = (req, res) => {

    let shipperId = req.body.shipperId;

    OrderDetail.findAll({
        where: {
            State: {
                [Op.in]: [ODStatuses.DeliverAssinged, ODStatuses.OnTheWay]
            }
        },
        order: [['ReceivingTime', 'ASC']],
        include: [
            {
                model: Shipping,
                as: 'orderDedailShippings',
                where: {
                    ShipperId: shipperId
                },
            }
        ]
    }).then(orderDetails => {
        res.send(orderDetails)
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

exports.assignFloristForOrderDetails = (req, res) => {

    let makings = req.body.makings;

    Making.bulkCreate(makings, {
        returning: true
    }).then(data => {

        var command = "";

        makings.forEach(mak => {

            let status = mak.MakingType == MakingTypes.Fixing ? ODStatuses.FixerAssigned : ODStatuses.FloristAssigned;

            let item = "UPDATE  `orderdetails` set `State` = \'" + status + "\'  WHERE  `Id`=" + mak.OrderDetailId + ";";

            console.log(item);

            command += item;

        });

        console.log('command is:', command);

        sequelize.query(command).then(data => {
            res.send({ message: 'updated some data' });
        }).catch(err => logger.error(err, res));

    }).catch(err => logger.error(err, res));
}