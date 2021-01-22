const commonService = require('../services/common.service');
const db = require("../models");
const Op = db.Sequelize.Op;
const sequelize = db.sequelize;
const Purchase = db.purchase;
const Order = db.order;

exports.bulkAdd = (req, res) => {

    let purchases = [];

    req.body.purchases.forEach(rawPurchase => {
        purchases.push({
            OrderId: req.body.orderId == '' ? null : req.body.orderId,
            Method: rawPurchase.Method,
            Amount: +rawPurchase.Amount,
            AddingTime: rawPurchase.AddingTime,
            Note: rawPurchase.Note
        });
    });

    console.log(purchases);

    Purchase.bulkCreate(purchases, {
        returning: true
    })
        .then(data => {
            res.send({ purchases: data });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({ message: err });
        });
}

exports.bulkInsert = (req, res) => {

    let purchases = [];

    req.body.purchases.forEach(rawPurchase => {
        purchases.push({
            OrderId: rawPurchase.OrderId,
            Method: rawPurchase.Method,
            Amount: +rawPurchase.Amount,
            AddingTime: rawPurchase.AddingTime,
            Note: rawPurchase.Note
        });
    });

    Purchase.bulkCreate(purchases, {
        returning: true
    })
        .then(data => {
            res.send({ purchases: data });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({ message: err.message || err });
        });
}

exports.add = (req, res) => {

    let obj = {
        OrderId: req.body.orderId ? req.body.orderId : null,
        Amount: req.body.amount,
        Method: req.body.method,
        AddingTime: req.body.addingTime,
        Note: req.body.note ? req.body.note : '',
    };

    if (!req.body.id || req.body.id <= 0) {
        Purchase.create(obj)
            .then(purchase => {

                if (obj.OrderId != null) {

                    let command = 'UPDATE `orders` SET `TotalPaidAmount` = `TotalPaidAmount` + ' + req.body.amount + ' WHERE `Id`= \"' + obj.OrderId + '\";';


                    sequelize.query(command).then(data => {

                        res.send({ purchase: purchase });

                    }).catch(err => {
                        console.log(err);
                        res.status(500).send({
                            message:
                                err.message || err
                        });
                    });

                }
                else {

                    res.send({ purchase: purchase });
                    return;

                }
            })
            .catch((err) => {
                console.log(err);
                res.status(500).send({ message: err });
            });
    }
    else {
        Purchase.update(obj, {
            where: {
                Id: req.body.id
            }
        })
            .then(purchase => {

                if (obj.OrderId != null) {

                    let command = 'UPDATE `orders` SET `TotalPaidAmount` = ' + req.body.newtotalPaidAmount + ' WHERE `Id`= \"' + obj.OrderId + '\";';

                    sequelize.query(command).then(data => {

                        res.send({ purchase: purchase });

                    }).catch(err => {

                        console.log(err);

                        res.status(500).send({
                            message:
                                err.message || err
                        });

                    });

                }
                else {

                    res.send({ purchase: purchase });
                    return;

                }
            })
            .catch((err) => {
                console.log(err);
                res.status(500).send({ message: err });
            });
    }
}

exports.updateIds = (req, res) => {

    Order.findAll()
        .then((orders) => {
            orders.forEach(async order => {

                await Order.update({
                    Id: `20.${order.Id}`
                }, {
                    where: {
                        Id: order.Id
                    }
                }).then(data => {
                    console.info(`OrderId: ${order.Id},message: ${data}`);
                });

            });

            res.send({ message: 'done' });
        });
}

exports.addAndAsign = (req, res) => {

    let purchase = req.body;

    Purchase.create({
        OrderId: purchase.OrderId,
        Amount: purchase.Amount,
        Method: purchase.Method,
        AddingTime: purchase.AddingTime,
        Note: purchase.Note
    }).then(pur => {

        let command = 'UPDATE `orders` SET `TotalPaidAmount` = `TotalPaidAmount` + ' + purchase.Amount + ' WHERE `Id`= \"' + purchase.OrderId + '\" AND `TotalPaidAmount` + ' + purchase.Amount + ' <= `TotalAmount`;';

        sequelize.query(command).then(data => {
            res.send({ updating: data });
        }).catch(err => {
            console.log(err);
            res.status(500).send({
                message:
                    err.message || err
            });
        });

    }).catch(err => {
        console.log(err);
        res.status(500).send({
            message:
                err.message || err
        });
    });
}

exports.assignOrder = (req, res) => {

    const orderId = req.body.orderId;
    const purchaseId = req.body.purchaseId;
    const amount = req.body.amount;

    Purchase.update({
        OrderId: orderId
    }, {
        where: {
            Id: purchaseId
        }
    }).then(data => {

        let command = 'UPDATE `orders` SET `TotalPaidAmount` = `TotalPaidAmount` + ' + amount + ' WHERE `Id`= \"' + orderId + '\" AND `TotalPaidAmount` + ' + amount + ' <= `TotalAmount`;';

        sequelize.query(command).then(data => {
            res.send({ updating: data });
        }).catch(err => {
            console.log(err);
            res.status(500).send({
                message:
                    err.message || err
            });
        });

    }).catch(err => {
        console.log(err);
        res.status(500).send({
            message:
                err.message || err
        });
    });
}

exports.updateOrder = (req, res) => {

    const orderId = req.body.orderId ? req.body.orderId : null;
    const id = req.body.id;
    const amount = req.body.amount;
    const oldOrderId = req.body.oldOrderId ? req.body.oldOrderId : '';
    const oldAmount = req.body.oldAmount ? req.body.oldAmount : 0;
    const method = req.body.method;
    const note = req.body.note ? req.body.note : '';
    const addingTime = req.body.addingTime;

    Purchase.update({
        OrderId: orderId,
        Method: method,
        AddingTime: addingTime,
        Amount: amount,
        Note: note
    }, {
        where: {
            Id: id
        }
    }).then(() => {

        let command = '';

        if (orderId != null && orderId == oldOrderId) {

            command += 'UPDATE `orders` SET `TotalPaidAmount` = `TotalPaidAmount` - ' + oldAmount + ' + ' + amount + ' WHERE`Id` = \"' + orderId + '\";';

        } else {

            if (orderId != null) {

                command += 'UPDATE `orders` SET `TotalPaidAmount` = `TotalPaidAmount` + ' + amount + ' WHERE `Id`= \"' + orderId + '\";';

            }

            if (oldOrderId != '') {

                command += 'UPDATE `orders` SET `TotalPaidAmount` = `TotalPaidAmount` - ' + oldAmount + ' WHERE `Id`= \"' + oldOrderId + '\";';

            }
        }

        sequelize.query(command).then(data => {
            res.send({ updating: data });
        }).catch(err => {
            console.log(err);
            res.status(500).send({
                message:
                    err.message || err
            });
        });

    }).catch(err => {
        console.log(err);
        res.status(500).send({
            message:
                err.message || err
        });
    });
}

exports.deletePurchase = (req, res) => {
    const purchaseId = req.body.purchaseId;

    Purchase.findAll({
        where: {
            Id: purchaseId
        }
    }).then(purchases => {

        if (purchases == null || purchases.length <= 0) {
            res.status(403).send({ message: 'Cannot find any purchase!' });
            return;
        }

        if (purchases[0].OrderId && purchases[0].OrderId != '') {

            let command = 'UPDATE `orders` SET `TotalPaidAmount` = `TotalPaidAmount` - ' + purchases[0].Amount + ' WHERE`Id` = \"' + purchases[0].OrderId + '\";';

            sequelize.query(command).then(data => {
                res.send({ updating: data });
            }).catch(err => {
                console.log(err);
                res.status(500).send({
                    message:
                        err.message || err
                });
            });

        } else {
            res.send({ message: 'a purchase is deleted' })
        }

    }).catch(err => {
        console.log(err);
        res.status(500).send({
            message:
                err.message || err
        });
    });
}

exports.getByTerm = (req, res) => {

    const page = req.body.page;
    const size = req.body.size;
    const startTime = req.body.startTime ? req.body.startTime : 0;
    const endTime = req.body.endTime ? req.body.endTime : Number.MAX_VALUE;
    const term = req.body.term;

    const isUnknownOnly = req.body.isUnknownOnly ? req.body.isUnknownOnly : false;

    var condition = isUnknownOnly ?
        {
            OrderId: null,
            AddingTime: {
                [Op.between]: [startTime, endTime]
            }
        } :
        {
            AddingTime: {
                [Op.between]: [startTime, endTime]
            }
        };

    const { limit, offset } = commonService.getPagination(page, size);

    let countClause = {
        where: condition
    }

    Purchase.count(countClause)
        .then(data => {

            const count = data;

            Purchase.findAndCountAll({
                where: countClause.where,
                order: [['AddingTime', 'DESC']],
                limit: limit,
                offset: offset
            }).then(newData => {

                newData.count = count;

                const newResponse = commonService.getPagingData(newData, page, limit);
                newResponse.totalItemCount = count;
                res.send(newResponse);
            })

        })
        .catch(err => {
            console.log(err);
            res.status(500).send({
                message:
                    err.message || err
            });
        });

}