const db = require("../models");
const Config = db.config;
const logger = require('../config/logger');
const Op = db.Sequelize.Op;

exports.getCurrent = (req, res) => {

    Config.findAll()
        .then(data => {
            res.send({ config: data && data.length > 0 ? data[0] : {} });
        })
        .catch(err => logger.error(err, res));
}

function addConfig(config, res) {

    if (config.id && config.id > 0) {
        Config.update({
            MemberValue: config.memberValue,
            MemberDiscount: config.memberDiscount,
            VipValue: config.vipValue,
            VipDiscount: config.vipDiscount,
            VVipValue: config.vVipValue,
            VVipDiscount: config.vVipDiscount,
        }, {
            where: {
                Id: config.id
            }
        }).then(update => {
            res.send({ update: update });
        });
    } else {
        Config.create({
            MemberValue: config.memberValue,
            MemberDiscount: config.memberDiscount,
            VipValue: config.vipValue,
            VipDiscount: config.vipDiscount,
            VVipValue: config.vVipValue,
            VVipDiscount: config.vVipDiscount,
        }).
            then(newConfig => {

                res.send({ newConfig: newConfig });
            })
            .catch((err) => logger.error(err, res));
    }
}

exports.updateConfig = (req, res) => {

    addConfig(req.body, res);

}

