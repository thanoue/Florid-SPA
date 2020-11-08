const db = require("../models");
const commonService = require("../services/common.service");
const Promotion = db.promotion;
const Op = db.Sequelize.Op;

exports.getAvailable = (req, res) => {

    let currentDate = req.body.currentDate;

    Promotion.findAll({
        where: {
            IsEnable: true,
            StartTime: {
                [Op.lte]: currentDate
            },
            EndTime: {
                [Op.gte]: currentDate
            },
        }
    })
        .then(promotions => {
            res.send({ promotions: promotions });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving categories."
            });
        })
}

exports.getList = (req, res) => {

    const { page, size, name } = req.query;

    var condition = name ? { Name: { [Op.like]: `%${name}%` } } : null;

    const { limit, offset } = commonService.getPagination(page, size);

    Promotion.findAndCountAll({ where: condition, limit, offset })
        .then(data => {
            const response = commonService.getPagingData(data, page, limit);
            res.send(response);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving categories."
            });
        });
}

exports.getAll = (req, res) => {

    Promotion.findAll()
        .then(promotions => {
            res.send(promotions);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving categories."
            });
        });
}

exports.update = (req, res) => {

    Promotion.update({
        Amount: req.body.amount,
        PromotionType: req.body.promotionType,
        Name: req.body.name,
        StartTime: req.body.startTime,
        EndTime: req.body.endTime,
        IsEnable: req.body.isEnable
    }, {
        where: {
            Id: req.body.id
        }
    }).then(() => {
        res.status(200).send({
            message: 'promotion are updated'
        })
    }).catch((err) => {
        res.status(500).send({ message: err });
    });
}

exports.deleteMany = (req, res) => {

    let ids = req.body.promotionIds;

    if (!ids || ids.length <= 0)
        res.status(401).send({ message: 'No Promotion to Delete' });

    Promotion.destroy({
        where: {
            Id: {
                [Op.in]: ids
            }
        }
    })
        .then(() => {
            res.send({
                message: 'Categories are deleted'
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({ message: err });
        });
}

exports.delete = (req, res) => {

    Promotion.destroy({
        where: {
            Id: req.body.id
        }
    }).then(() => {
        res.send({
            message: 'a promtion is deleted'
        })
    }).catch((err) => {
        console.log(err);
        res.status(500).send({ message: err });
    });
}

exports.create = (req, res) => {

    Promotion.create({
        Amount: req.body.amount,
        PromotionType: req.body.promotionType,
        Name: req.body.name,
        StartTime: req.body.startTime,
        EndTime: req.body.endTime,
        IsEnable: req.body.isEnable
    }).
        then(promtion => {
            res.send({ promtion: promtion });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({ message: err });
        });
}