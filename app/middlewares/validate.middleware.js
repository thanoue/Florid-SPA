const db = require("../models");
const Op = db.Sequelize.Op;
const Tag = db.tag;
const Category = db.category;

checkIfAliasIsDuplicate = (req, res, next) => {

    if (!req.body.alias || req.body.alias == '' || req.body.alias.indexOf(' ') > 0) {
        res.status(400).send({
            message: 'Tag không hợp lệ!'
        });
        return;
    }

    let clause = {
        Alias: req.body.alias
    };

    if (req.body.id) {
        clause.Id = {
            [Op.not]: req.body.id
        }
    }

    Tag.findOne({
        where: clause
    }).then((tag) => {

        if (tag) {
            res.status(400).send({
                message: 'Tag bị trùng tên!'
            });
            return;
        }

        next();

    }).catch(() => {
        console.log(err);
        res.status(500).send({ message: err });
    });
}

purchaseAmountValidation = (req, res, next) => {

    if (!req.body.amount || req.body.amount <= 0) {
        res.status(400).send({
            message: 'Amount is not valid'
        });

        return;
    }

    next();
}

orderIdValidation = (req, res, next) => {

    if (!req.body.orderId || req.body.orderId == '') {

        res.status(403).send({
            message: 'Order id is required'
        });

        return;
    }

    next();
}

checkIfCategoryNameIsDuplicate = (req, res, next) => {

    if (!req.body.name || req.body.name == '') {
        res.status(403).send({
            message: 'Category name is missing!'
        });
        return;
    }

    let clause = {
        Name: req.body.name
    };

    if (req.body.id) {
        clause.Id = {
            [Op.not]: req.body.id
        }
    }

    Category.findOne({
        where: clause
    }).then((category) => {

        if (category) {
            console.log('duplicate:', category);
            res.status(403).send({
                message: 'Category name is duplicated!'
            });
            return;
        }

        next();

    }).catch(() => {
        console.log(err);
        res.status(500).send({ message: err });
    });
}

const tableValidation = {
    checkIfAliasIsDuplicate: checkIfAliasIsDuplicate,
    checkIfCategoryNameIsDuplicate: checkIfCategoryNameIsDuplicate,
    purchaseAmountValidation, purchaseAmountValidation,
    orderIdValidation, orderIdValidation
};

module.exports = tableValidation;
