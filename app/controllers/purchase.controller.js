const db = require("../models");
const Purchase = db.purchase;
const PurchaseStatuses = require('../config/app.config').PurchaseStatus;
const PurchaseMethods = require('../config/app.config').PurchaseMethods;

exports.getByOrderId = (req, res) => {

}

exports.bulkAdd = (req, res) => {

    let purchases = [];
    req.body.purchases.forEach(rawPurchase => {
        purchases.push({
            OrderId: req.body.orderId,
            Method: rawPurchase.Method,
            Status: rawPurchase.Status,
            Amount: rawPurchase.Amount
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
            res.status(500).send({ message: err });
        });
}

exports.add = (req, res) => {

    let obj = {
        OrderId: req.body.orderId,
        Amount: req.body.amount,
        Method: req.body.method,
        Status: req.body.status
    };

    Purchase.create(obj)
        .then(purchase => {
            res.send({ purchase: purchase });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({ message: err });
        });
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