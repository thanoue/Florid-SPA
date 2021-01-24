const db = require("../models");
const guid = require('guid');
const commonService = require("../services/common.service");
const Tag = db.tag;
const logger = require('../config/logger');
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
        .catch(err => logger.error(err, res));
}

exports.getAll = (req, res) => {
    Tag.findAll()
        .then(tags => {
            res.send(tags);
        })
        .catch(err => logger.error(err, res));
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
    }).catch(err => logger.error(err, res));
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
                message: 'Tags are deleted'
            });
        })
        .catch(err => logger.error(err, res));
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
    }).catch(err => logger.error(err, res));
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
        .catch(err => logger.error(err, res));
}