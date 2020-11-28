const db = require("../models");
const Purchase = db.purchase;
const Order = db.order;

exports.bulkAdd = (req, res) => {

    let purchases = [];

    req.body.purchases.forEach(rawPurchase => {
        purchases.push({
            OrderId: req.body.orderId == '' ? null : req.body.orderId,
            Method: rawPurchase.Method,
            Status: rawPurchase.Status,
            Amount: +rawPurchase.Amount,
            AddingTime: rawPurchase.AddingTime
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

exports.add = (req, res) => {

    let obj = {
        OrderId: req.body.orderId,
        Amount: req.body.amount,
        Method: req.body.method,
        Status: req.body.status,
        AddingTime: req.body.addingTime
    };

    if (!req.body.id || req.body.id <= 0) {
        Purchase.create(obj)
            .then(purchase => {
                Order.update({
                    TotalPaidAmount: req.body.newtotalPaidAmount
                }, {
                    where: {
                        Id: req.body.orderId
                    }
                }).then(() => {
                    res.send({ purchase: purchase });
                })
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
                Order.update({
                    TotalPaidAmount: req.body.newtotalPaidAmount
                }, {
                    where: {
                        Id: req.body.orderId
                    }
                }).then(() => {
                    res.send({ purchase: purchase });
                })
            })
            .catch((err) => {
                console.log(err);
                res.status(500).send({ message: err });
            });
    }
}

exports.updateStatus = (req, res) => {

    Purchase.update({
        Status: req.body.status
    }, {
        where: {
            Id: req.body.id
        }
    }).then(data => {

        res.send({ message: 'purchase is updated' });

    }).catch((err) => {

        console.log(err);

        res.status(500).send({ message: err });

    });

}