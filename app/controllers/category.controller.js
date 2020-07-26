const db = require("../models");
const commonService = require("../services/common.service");
const Category = db.category;
const Op = db.Sequelize.Op;

exports.getList = (req, res) => {

    const { page, size, name } = req.query;

    var condition = name ? { Name: { [Op.like]: `%${name}%` } } : null;

    const { limit, offset } = commonService.getPagination(page, size);

    Category.findAndCountAll({ where: condition, limit, offset })
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
    Category.findAll()
        .then(categories => {
            res.send(categories);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving categories."
            });
        })
}

exports.update = (req, res) => {

    Category.update({
        Description: req.body.description ? req.body.description : ' ',
        Name: req.body.name ? req.body.name : ' ',
    }, {
        where: {
            Id: req.body.id
        }
    }).then(() => {
        Z
        res.status(200).send({
            message: 'Category are updated'
        })
    }).catch((err) => {
        console.log(err);
        res.status(500).send({ message: err });
    });
}

exports.deleteMany = (req, res) => {

    let ids = req.body.categoryIds;

    Category.destroy({
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

    Category.destroy({
        where: {
            Id: req.body.id
        }
    }).then(() => {
        res.send({
            message: 'Category is deleted'
        })
    }).catch((err) => {
        console.log(err);
        res.status(500).send({ message: err });
    });
}

exports.create = (req, res) => {

    Category.create({
        Description: req.body.description ? req.body.description : ' ',
        Name: req.body.name ? req.body.name : ' ',
    }).
        then(category => {
            res.send({ category: category });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({ message: err });
        });
}