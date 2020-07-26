const db = require("../models");
const guid = require('guid');
const commonService = require('../services/common.service');
const Product = db.product;
const Tag = db.tag;
const Category = db.category;
const ProductTag = db.product_tag;
const fs = require('fs');
const ProductCategory = db.product_category;
const Op = db.Sequelize.Op;

const appConstant = require('../config/app.config');
const proudctImgFolderPath = appConstant.fileFolderPath.productImg;

exports.getList = (req, res) => {

    const { page, size, name, categoryId } = req.query;

    var condition = name ? { Name: { [Op.like]: `%${name}%` } } : {};

    const { limit, offset } = commonService.getPagination(page, size);

    let countClause = {
        where: condition
    }

    if (categoryId && categoryId > 0) {

        ProductCategory.findAll({
            where: {
                CategoryId: categoryId
            }
        }).then(prodCates => {
            if (prodCates && prodCates.length > 0) {

                let userIds = [];

                prodCates.forEach((prodCate) => {
                    userIds.push(prodCate.ProductId);
                });

                countClause.where.Id = { [Op.in]: userIds };

                Product.count(countClause)
                    .then(data => {

                        const count = data;

                        Product.findAndCountAll({
                            where: countClause.where,
                            include: [
                                { model: Category },
                                { model: Tag },
                            ],
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
                        res.status(500).send({
                            message:
                                err.message || "Some error occurred while retrieving products."
                        });
                    });
            }
            else {
                res.send({});
            }
        });
    } else {
        Product.count(countClause)
            .then(data => {

                const count = data;

                Product.findAndCountAll({
                    where: condition,
                    include: [
                        { model: Category },
                        { model: Tag },
                    ],
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
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving products."
                });
            });
    }
}

exports.createProduct = (req, res) => {

    const body = req.body;

    console.log(body);

    if (!body.categoryIds) {

        res.status(403).send({
            message: 'Category is required'
        });
        return;
    }

    var defaultImgName = 'https://images.vexels.com/media/users/3/156051/isolated/preview/72094c4492bc9c334266dc3049c15252-flat-flower-icon-flower-by-vexels.png';

    if (req.files) {

        defaultImgName = commonService.getNewFileName(req.files.productImg);

        req.files.productImg.mv(proudctImgFolderPath + defaultImgName);
    }

    Product.create({
        Name: body.name,
        ImageUrl: defaultImgName,
        Description: body.description,
        Price: body.price,
    }).then(product => {

        if (!product) {
            res.status(500).send({
                message: "Create product err"
            });
            return;
        }

        let categories = JSON.parse(body.categoryIds);
        product.setCategories(categories).then(() => {

            if (body.tagIds) {
                let tags = JSON.parse(body.tagIds);
                product.setTags(tags).then(() => {
                    res.send({ product: product });
                });
            } else {
                res.send({ product: product });
            }

        });

    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while create product."
        });
        return;
    })
}

exports.deleteManyProduct = (req, res) => {

    let ids = req.body.productIds;

    Product.destroy({
        where: {
            Id: {
                [Op.in]: ids
            }
        }
    })
        .then(() => {

            let productImgNames = req.body.productImgNames;
            productImgNames.forEach(url => {

                if (url.indexOf('http') < 0) {
                    fs.unlink(proudctImgFolderPath + url, (err) => {
                        console.log(err);
                    });
                }

            });

            res.send({
                message: 'Tags is deleted'
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({ message: err });
        });
}

exports.deleteProduct = (req, res) => {

    if (!req.body.productId) {
        res.status(403).send({ message: "product Id is Required" });
        return;
    }

    if (req.body.productImg && req.body.productImg.indexOf('http') < 0) {
        fs.unlink(proudctImgFolderPath + req.body.productImg, (err) => {
            console.log(err);
            if (!err)
                console.log('file is deleted: ', req.body.productImg);
        });
    }

    Product.destroy({
        where: {
            Id: req.body.productId
        }
    }).then(() => {
        res.send({ message: "Product is has been deleted!" });
        return;
    }).catch((err) => {
        res.status(500).send({ message: err });
        return;
    })

}

exports.updateProduct = (req, res) => {

    const body = req.body;

    if (!body.categoryIds) {

        if (!product) {
            res.status(403).send({
                message: 'Category is required'
            });
            return;
        }
    }

    var defaultImgName = body.oldProductImg ? body.oldProductImg : '';

    if (req.files) {

        defaultImgName = commonService.getNewFileName(req.files.productImg);

        req.files.productImg.mv(proudctImgFolderPath + defaultImgName);

        if (body.oldProductImg && body.oldProductImg.indexOf('http') < 0) {
            fs.unlink(proudctImgFolderPath + body.oldProductImg, (err) => {
                console.log(err);
            });
        }
    }

    Product.update({
        Name: body.name,
        Price: body.price,
        Description: body.description,
        ImageUrl: defaultImgName
    }, {
        where: {
            Id: body.id
        }
    }).then(() => {

        Product.findByPk(body.id).then((product) => {

            ProductCategory.destroy({
                where: {
                    ProductId: body.id
                }
            }).then(() => {
                let categories = JSON.parse(body.categoryIds);
                product.setCategories(categories).then(() => {

                    ProductTag.destroy({
                        where: {
                            ProductId: body.id
                        }
                    }).then(() => {

                        if (body.tagIds && body.tagIds.length > 0) {
                            let tags = JSON.parse(body.tagIds);
                            product.setTags(tags).then(() => {
                                console.log('tags are updated');

                                res.send({
                                    message: 'Product is updated'
                                });
                            });

                        } else {

                            res.send({
                                message: 'Product is updated'
                            });
                        }
                    });
                });
            });

        });

    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while create product."
        });
        return;
    });

}
