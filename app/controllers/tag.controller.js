const db = require("../models");
const guid = require('guid');
var bcrypt = require("bcryptjs");
const commonService = require("../services/common.service");
const Tag = db.tag;
const Op = db.Sequelize.Op;


exports.getList = (req, res) => {

    const { page, size, description } = req.query;
    var condition = description ? { Description: { [Op.like]: `%${description}%` } } : null;

    const { limit, offset } = commonService.getPagination(page, size);

    Tag.findAndCountAll({ where: condition, limit: limit, offset: offset })
        .then(data => {
            const response = commonService.getPagingData(data, page, limit);
            res.send(response);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tags."
            });
        });
}

exports.getAll = (req, res) => {
    Tag.findAll()
        .then(tags => {
            res.send(tags);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving categories."
            });
        })
}


exports.update = (req, res) => {

    Tag.update({
        Alias: req.body.alias,
        Description: req.body.description ? req.body.description : ' ',
        Name: req.body.name ? req.body.name : ' ',
    }, {
        where: {
            Id: req.body.id
        }
    }).then(() => {
        res.status(200).send({
            message: 'Tag is updated'
        })
    }).catch((err) => {
        console.log(err);
        res.status(500).send({ message: err });
    });
}

exports.deleteMany = (req, res) => {

    let ids = req.body.tagIds;

    Tag.destroy({
        where: {
            Id: {
                [Op.in]: ids
            }
        }
    })
        .then(() => {
            res.send({
                message: 'Tags is deleted'
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({ message: err });
        });
}

exports.delete = (req, res) => {

    Tag.destroy({
        where: {
            Id: req.body.id
        }
    }).then(() => {
        res.send({
            message: 'Tag is deleted'
        })
    }).catch((err) => {
        console.log(err);
        res.status(500).send({ message: err });
    });
}

exports.create = (req, res) => {

    Tag.create({
        Alias: req.body.alias,
        Description: req.body.description ? req.body.description : ' ',
        Name: req.body.name ? req.body.name : ' ',
    }).
        then(tag => {
            res.send({ tag: tag });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({ message: err });
        });
}