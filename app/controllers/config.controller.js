const db = require("../models");
const Config = db.config;
const Customer = db.customer;
const logger = require('../config/logger');
const Op = db.Sequelize.Op;
const MemberTyepes = require('../config/app.config').MemberShipType;
exports.getCurrent = (req, res) => {

    Config.findAll()
        .then(data => {
            res.send({ config: data && data.length > 0 ? data[0] : {} });
        })
        .catch(err => logger.error(err, res));
}

exports.updateMembership = (req, res) => {

    Config.findOne().then(config => {

        Customer.update({
            MembershipType: MemberTyepes.NewCustomer
        }, {
            where: {
                AccumulatedAmount: {
                    [Op.lt]: config.MemberValue
                }
            }
        }).then(() => {

            Customer.update({
                MembershipType: MemberTyepes.Member
            }, {
                where: {
                    AccumulatedAmount: {
                        [Op.between]: [config.MemberValue, config.VipValue - 1]
                    }
                }
            }).then(() => {

                Customer.update({
                    MembershipType: MemberTyepes.Vip
                }, {
                    where: {
                        AccumulatedAmount: {
                            [Op.between]: [config.VipValue, config.VVipValue - 1]
                        }
                    }
                }).then(() => {

                    Customer.update({
                        MembershipType: MemberTyepes.VVip
                    }, {
                        where: {
                            AccumulatedAmount: {
                                [Op.gte]: config.VVipValue
                            }
                        }
                    }).then(() => {
                        res.send({ message: 'updated' });
                    });

                });

            });

        });

    });
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

