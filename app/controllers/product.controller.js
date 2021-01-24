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
const sequelize = db.sequelize;
const logger = require('../config/logger');

const appConstant = require('../config/app.config');
const proudctImgFolderPath = appConstant.fileFolderPath.productImg;

exports.addBulkFromFiles = (req, res) => {
    try {

        let rawProducts = req.body;
        let products = [];

        rawProducts.forEach(raw => {
            products.push({
                Name: raw.Name,
                Price: raw.Price > 10 ? raw.Price * 1000 : 0,
                ImageUrl: `https://drive.google.com/uc?export=view&id=${raw.ImageName}`,
                Description: raw.Description,
                Size: raw.Size,
            });
        });


        Product.bulkCreate(products, {
            returning: true
        }).then(result => {
            res.send({ products: result });
        });

    } catch (err) {
        logger.error(err, res);
    }
}

exports.addBulkOneCate = (req, res) => {

    let products = [];

    let productCateRawQuery = '';
    let productRawQuery = '';

    Product.findAll({
        attributes: [
            [sequelize.fn('MAX', sequelize.col('Id')), 'max']
        ]
    })
        .then(pr => {

            console.log("max la:", pr[0].dataValues.max);

            let max = pr[0].dataValues.max;

            let id = max + 1;

            req.body.products.forEach(rawProduct => {

                // products.push({
                //     Id: id,
                //     Name: rawProduct.Name,
                //     Price: rawProduct.Price,
                //     Unit: rawProduct.Unit,
                //     PriceList: JSON.stringify([rawProduct.Price]),
                //     Description: rawProduct.Description,
                //     ImageUrl: rawProduct.ImageUrl
                // });

                productRawQuery += "INSERT into `products` (`Id`,`Name`,`Price`,`Unit`,`PriceList`,`Description`,`ImageUrl`)" +
                    " values (" + id + ",\"" + rawProduct.Name + "\"," + rawProduct.Price + ",\"" + rawProduct.Unit + "\"," +
                    "\"" + JSON.stringify([rawProduct.Price]) + "\",\"" + rawProduct.Description + "\",\"" + rawProduct.ImageUrl + "\");";

                id += 1;

            });

            sequelize.query(productRawQuery).then(data => {

                let prodCates = [];

                let productId = max + 1;

                req.body.products.forEach(prod => {

                    prodCates.push({
                        ProductId: productId,
                        CategoryId: req.body.categoryId
                    });

                    productId += 1;

                    // let command = "INSERT into `products_categories` (`ProductId`,`CategoryId`) values (" + prod.Id + "," + req.body.categoryId + ");";

                    // productCateRawQuery += command;
                });

                ProductCategory.bulkCreate(prodCates, {
                    returning: true
                }).then(data => {
                    res.send({ message: 'updated some data' });
                }).catch(err => {

                    logger.error(err, res);

                });

            }).catch(err => {

                logger.error(err, res);

            });


            // Product.bulkCreate(products, {
            //     returning: true
            // }).then(prods => {

            //     let prodCates = [];

            //     let productId = count + 1;

            //     prods.forEach(prod => {

            //         prodCates.push({
            //             ProductId: productId,
            //             CategoryId: req.body.categoryId
            //         });

            //         productId += 1;

            //         // let command = "INSERT into `products_categories` (`ProductId`,`CategoryId`) values (" + prod.Id + "," + req.body.categoryId + ");";

            //         // productCateRawQuery += command;
            //     });

            //     ProductCategory.bulkCreate(prodCates, {
            //         returning: true
            //     }).then(data => {
            //         res.send({ message: 'updated some data' });
            //     }).catch(err => {

            //         console.log(err);
            //         res.status(500).send({ message: err.message || err });

            //     });

            //     // sequelize.query(productCateRawQuery).then(data => {
            //     //     res.send({ message: 'updated some data' });
            //     // }).catch(err => {

            //     //     console.log(err);
            //     //     res.status(500).send({ message: err.message || err });

            //     // });

            // }).catch(err => {
            //     res.status(500).send({
            //         message: err.message || err
            //     });
            // })

        }).catch(err => {
            logger.error(err, res);
        });

}

exports.addBulk = (req, res) => {
    try {
        let rawProducts = req.body;
        let prodCates = [];
        let products = [];

        let id = 1;
        rawProducts.forEach(rawProduct => {

            products.push({
                Id: id,
                Name: rawProduct.Name,
                Price: rawProduct.Price,
                ImageUrl: rawProduct.Id + ".jpg",
            });

            prodCates.push({
                ProductId: id,
                CategoryId: rawProduct.Category + 1
            });

            id += 1;
        });

        Product.bulkCreate(products, {
            returning: true
        }).then(result => {
            ProductCategory.bulkCreate(prodCates, {
                returning: true
            }).then(done => {
                res.send({ products: prodCates });
            });
        });

    } catch (err) {
        logger.error(err, res);
    }
}

function getProducts(countClause, page, limit, offset, res) {

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
        .catch(err => logger.error(err, res));
}

exports.getAll = (req, res) => {

    Product.findAll({
        include: [
            { model: Category },
            { model: Tag },
        ],
    }).then(products => {
        res.send({ products: products });
    }).catch(err => logger.error(err, res));

}

exports.getByPrice = (req, res) => {

    const page = req.body.page;
    const size = req.body.size;
    const price = req.body.price;
    const categoryId = req.body.categoryId ? req.body.categoryId : -1;

    var condition = price ? { Price: { [Op.eq]: price } } : {};

    const { limit, offset } = commonService.getPagination(page, size);

    let countClause = {
        where: condition
    }

    if (categoryId > -1) {

        ProductCategory.findAll({
            where: {
                CategoryId: categoryId
            }
        }).then(prodCates => {

            let productIds = [];

            if (!prodCates || prodCates.length <= 0) {

                res.send({
                    totalItemCount: 0,
                    items: 0,
                    totalPages: 0,
                    currentPage: 0
                });

                return;
            }

            prodCates.forEach((prodCate) => {
                productIds.push(prodCate.ProductId);
            });

            countClause.where.Id = { [Op.in]: productIds };

            getProducts(countClause, page, limit, offset, res);

        });

    } else
        getProducts(countClause, page, limit, offset, res);

    return;
}

exports.getList = (req, res) => {

    const page = req.body.page;
    const size = req.body.size;
    const categoryId = req.body.categoryId ? req.body.categoryId : -1;
    const name = req.body.name;
    const tagIds = req.body.tagIds ? req.body.tagIds : [];

    var condition = name ? { Name: { [Op.like]: `%${name}%` } } : {};

    const { limit, offset } = commonService.getPagination(page, size);

    let countClause = {
        where: condition
    }

    if (categoryId > -1) {

        ProductCategory.findAll({
            where: {
                CategoryId: categoryId
            }
        }).then(prodCates => {

            let productIds = [];

            if (!prodCates || prodCates.length <= 0) {

                res.send({
                    totalItemCount: 0,
                    items: 0,
                    totalPages: 0,
                    currentPage: 0
                });

                return;
            }

            prodCates.forEach((prodCate) => {
                productIds.push(prodCate.ProductId);
            });

            countClause.where.Id = { [Op.in]: productIds };

            if (tagIds.length > 0) {
                ProductTag.findAll({
                    where: {
                        TagId: {
                            [Op.in]: tagIds
                        }
                    }
                }).then(productTags => {

                    if (!productTags || productTags.length <= 0) {

                        res.send({
                            totalItemCount: 0,
                            items: 0,
                            totalPages: 0,
                            currentPage: 0
                        });

                        return;
                    }

                    let productIds2 = [];

                    productTags.forEach(productTag => {
                        if (productIds.indexOf(productTag.ProductId) > -1)
                            productIds2.push(productTag.ProductId);
                    });

                    countClause.where.Id = { [Op.in]: productIds2 };

                    getProducts(countClause, page, limit, offset, res);
                    return;
                });
            } else {
                getProducts(countClause, page, limit, offset, res);
                return;
            }
        }).catch(err => logger.error(err, res));

    } else {

        if (tagIds.length > 0) {
            ProductTag.findAll({
                where: {
                    TagId: {
                        [Op.in]: tagIds
                    }
                }
            }).then(productTags => {

                if (!productTags || productTags.length <= 0) {

                    res.send({
                        totalItemCount: 0,
                        items: 0,
                        totalPages: 0,
                        currentPage: 0
                    });

                    return;
                }

                let productIds = [];

                productTags.forEach(productTag => {
                    productIds.push(productTag.ProductId);
                });

                countClause.where.Id = { [Op.in]: productIds };

                getProducts(countClause, page, limit, offset, res);

                return;
            }).catch(err => logger.error(err, res));

        } else {
            getProducts(countClause, page, limit, offset, res);
            return;
        }
    }
}

exports.createProduct = (req, res) => {

    const body = req.body;

    var defaultImgName = 'https://images.vexels.com/media/users/3/156051/isolated/preview/72094c4492bc9c334266dc3049c15252-flat-flower-icon-flower-by-vexels.png';

    if (req.files) {

        defaultImgName = commonService.getNewFileName(req.files.productImg);

        req.files.productImg.mv(proudctImgFolderPath + defaultImgName);
    }

    let priceList = body.priceList ? body.priceList : '';

    Product.create({
        Name: body.name,
        ImageUrl: defaultImgName,
        Description: body.description,
        Price: body.price,
        PriceList: priceList
    }).then(product => {

        if (!product) {

            res.status(500).send({
                message: "Create product err"
            });

            return;
        }

        if (body.categoryIds) {

            let categories = JSON.parse(body.categoryIds);

            product.setCategories(categories);
        }


        if (body.tagIds) {

            let tags = JSON.parse(body.tagIds);

            product.setTags(tags);

        }

        res.send({ product: product });

    }).catch(err => logger.error(err, res));
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
        }).catch(err => logger.error(err, res));
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
    }).catch(err => logger.error(err, res));

}

exports.updateProduct = (req, res) => {

    const body = req.body;

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

    let priceList = body.priceList ? body.priceList : '';

    Product.update({
        Name: body.name,
        Price: body.price,
        Description: body.description,
        ImageUrl: defaultImgName,
        PriceList: priceList
    }, {
        where: {
            Id: body.id
        }
    }).then(() => {

        if ((body.categoryIds && body.categoryIds.length > 0) || (body.tagIds && body.tagIds.length > 0)) {

            Product.findByPk(body.id).then((product) => {

                if ((body.categoryIds && body.categoryIds.length > 0)) {

                    ProductCategory.destroy({
                        where: {
                            ProductId: body.id
                        }
                    }).then(() => {

                        let categories = JSON.parse(body.categoryIds);

                        product.setCategories(categories);

                    }).catch(err => logger.error(err, res));
                }

                if (body.tagIds && body.tagIds.length > 0) {

                    ProductTag.destroy({
                        where: {
                            ProductId: body.id
                        }
                    }).then(() => {

                        let tags = JSON.parse(body.tagIds);

                        product.setTags(tags);

                    }).catch(err => logger.error(err, res));
                }

                res.send({
                    message: 'Product is updated'
                });

            });

        } else {

            res.send({
                message: 'Product is updated'
            });

        }
    }).catch(err => logger.error(err, res));

}
