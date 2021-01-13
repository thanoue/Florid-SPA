const { user } = require("../models");
const db = require("../models");
const Order = db.order;
const OrderDetail = db.orderDetail;
const Customer = db.customer;
const Op = db.Sequelize.Op;
const sequelize = db.sequelize;
const commonService = require('../services/common.service');
const Purchase = db.purchase;

exports.getByCustomer = (req, res) => {

    if (!req.body.customerId) {

        res.status(403).send({
            message: 'Customer Id is Required'
        });

        return;
    }

    Order.findAll({
        where: {
            CustomerId: req.body.customerId
        },
        include: [
            { model: OrderDetail },
            { model: Customer },
            { model: Purchase }
        ]

    }).then(orders => {
        res.send({ orders: orders });
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
}

exports.getByDayRange = (req, res) => {

    var startTime = req.body.startDate;
    var endTime = req.body.endDate;

    Order.findAll({
        where: {
            CreatedDate: {
                [Op.between]: [startTime, endTime]
            },
            TotalPaidAmount: {
                [Op.gte]: sequelize.col('TotalAmount')
            }
        },
        include: [
            { model: Customer },
            { model: OrderDetail },
            { model: Purchase }
        ]
    }).then(orders => {
        res.send({ orders: orders });
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
}

exports.getById = (req, res) => {

    if (!req.body.id) {

        res.status(403).send({
            message: 'Id is Required'
        });

        return;
    }

    Order.findOne({
        where: {
            Id: req.body.id
        },
        include: [
            { model: OrderDetail },
            { model: Customer },
            { model: Purchase }
        ]

    }).then(order => {
        res.send({ order: order });
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
}

exports.getNotLazyById = (req, res) => {

    if (!req.body.id) {

        res.status(403).send({
            message: 'Id is Required'
        });

        return;
    }

    Order.findOne({
        where: {
            Id: req.body.id
        },
    }).then(order => {
        res.send({ order: order });
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
}

exports.addBulk = (req, res) => {

    let orders = req.body;
    let obj = [];

    orders.forEach(order => {

        if (order.Id) {

            let orderItem = {
                CustomerId: order.CustomerId,
                Id: order.Id,
                VATIncluded: order.VATIncluded,
                TotalAmount: +order.TotalAmount,
                TotalPaidAmount: +order.TotalPaidAmount,
                GainedScore: +order.GainedScore,
                ScoreUsed: +order.ScoreUsed,
                CreatedDate: +order.Created,
                PercentDiscount: 0,
                AmountDiscount: 0,
                NumberId: order.NumberId,
                DoneTime: order.DoneTime
            };

            obj.push(orderItem);

        }

    });

    obj.forEach(data=>{
        if(data.Id == undefined || data.Id == '' || data.CustomerId == undefined || data.CustomerId == ''){
            console.error(data);
        }
    });

    Order.bulkCreate(obj, {
        returning: true
    }).then(orderRes => {
        res.send({ message: "Some order are added" });
    }).catch(err => {
        console.log(err);
        res.status(500).send({ message: err.message });
    });
}

exports.updateMemberDiscountApplies = (req, res) => {

    Order.findAll({
        include: [
            {
                model: Customer,
                where: {
                    MembershipType: {
                        [Op.ne]: 'NewCustomer'
                    }
                }
            }
        ]
    }).then(data => {

        let ids = [];

        data.forEach(order => {
            ids.push(order.Id);
        });

        Order.update({
            IsMemberDiscountApply: true
        }, {
            where: {
                Id: {
                    [Op.in]: ids
                }
            }
        }).then(updateData => {
            res.send({ data: updateData });
        })
    }).catch(err => {
        console.log(err);
        res.status(500).send({ message: err.message | err });
    });

}

exports.addOrder = (req, res) => {

    let body = req.body;

    let numberId = 0;

    let id = body.id.split('.')[1];

    if (parseInt(id) != undefined && parseInt(id) != NaN) {
        numberId = parseInt(id);
    } else {
        numberId = -1;
    }

    let order = {
        CustomerId: body.customerId,
        Id: body.id,
        VATIncluded: body.vatIncluded,
        TotalAmount: body.totalAmount,
        TotalPaidAmount: body.totalPaidAmount,
        GainedScore: body.gaindedScore,
        ScoreUsed: body.scoreUsed,
        CreatedDate: body.createdDate,
        PercentDiscount: body.percentDiscount ? body.percentDiscount : 0,
        AmountDiscount: body.amountDiscount ? body.amountDiscount : 0,
        NumberId: numberId,
        IsMemberDiscountApply: body.isMemberDiscountApply ? body.isMemberDiscountApply : false,
        DoneTime: body.doneTime
    }

    try {
        Order.create(order)
            .then(orderRes => {
                res.send({ order: orderRes });
            }).catch(err => {
                console.log(err);
                res.status(500).send({ message: err.message });
            });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: err.message });
    }
}

exports.editOrder = (req, res) => {

    let body = req.body;

    let order = {
        CustomerId: body.customerId,
        VATIncluded: body.vatIncluded,
        TotalAmount: body.totalAmount,
        TotalPaidAmount: body.totalPaidAmount,
        GainedScore: body.gaindedScore,
        ScoreUsed: body.scoreUsed,
        CreatedDate: body.createdDate,
        PercentDiscount: body.percentDiscount,
        AmountDiscount: body.amountDiscount
    }

    try {

        Order.update(order, {
            where: {
                Id: req.body.id
            }
        })
            .then(orderRes => {
                res.send({ order: orderRes });
            }).catch(err => {
                res.status(500).send({ message: err.message });
            });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}

exports.getMaxNumberByYearId = (req, res) => {

    let year = req.body.year;

    var command = "select MAX(`NumberId`) as `max` from `orders` where `NumberId` > -1 AND EXTRACT(YEAR FROM `createdAt`) = " + year + ";";

    sequelize.query(command).then(data => {

        res.send(data[0][0]);

    }).catch(err => {

        console.log(err);

        res.status(500).send({
            message:
                err.message || err
        });
    });
};

exports.insertMissingCustomer = async (req,res)=>{

    let customers = [];

    let allCustomers = await Customer.findAll();

    req.body.forEach(rawCus => {

        if(checkIfExist(allCustomers,rawCus.Id)){
            console.log(rawCus.Id);
        }else{

            if(checkIfExist(customers,rawCus.Id)){
                console.log(rawCus.Id);
            }else{
                customers.push(rawCus);
            }
        }

    });

    Customer.bulkCreate(customers,{
        returning:true
    }).then(data =>{
        res.send(data);
    }).catch(err => {

        console.log(err);

        res.status(500).send({
            message:
                err.message || err
        });
    });

}

exports.getMissingCustomers = (req,res)=>{

    Order.findAll({
        where:{
            Id:{
                [Op.in]:[
                    "3506",
                    "3512",
                    "3515",
                    "3566",
                    "3576",
                    "3584",
                    "3586",
                    "3588",
                    "3589",
                    "3590",
                    "3599",
                    "3601",
                    "3621",
                    "3636",
                    "3641",
                    "3666",
                    "3667",
                    "3676",
                    "3683",
                    "3684",
                    "3705",
                    "3718",
                    "3759"
                ]
            }
        },
        include:[
            {
                model:Customer,
            }
        ]
    }).then(orders=>{
        let customers = [];
        orders.forEach(order =>{
            customers.push(order.customer);
        });

        res.send(customers);
    })
}

exports.getNullOrder = (req,res) =>{

    Order.findAll({
        where:{
            CustomerId : null
        }
    }).then(orders =>{
        
        let ids = [];
        orders.forEach(order =>{
            ids.push(order.Id);
        });
        res.send({ids: ids});
    });
}

exports.getOrders = (req,res)=>{
    let orderIds = ['21.67','21.66','21.65','21.64','21.63','21.61','21.62','21.59','21.58','21.57', '21.56', '21.55', '3763', '3759', '3727', '3718', '3712', '3705', '3695', '3689', '3685', '3684', '3683', '3676', '3494', '3672', '3286_', '3667', '3666', '3663', '3492', '3491', '3488', '00', '3654', '3652', '3646', '3641', '000', '3640', '3636', '3622', '3621', '0000', '3607', '3606', '3605', '3601', '3599', '3586', '3590', '3589', '3588', '3587', '3584', '3583', '3576', '3575', '3572', '3567', '3566', '3525', '3515', '3512', '3508', '3507', '3506', '3497', '3493', '3479', '3473'];

    Order.findAll({
        where:{
            Id:{
                [Op.in]: orderIds
            }
        }
    }).then(orders =>{
        res.send(orders);
    }).catch(err =>{
        console.log(err);
        res.status(500).send({
            message:
                err.message || err
        });
    });
}

function checkIfExist(customers,customerId){

   let temp = 0;
   let isExist = false;

   if(customers.length <=0)
   return false;

   while(true){

        if(temp >= customers.length){
             break;
        }
       
        if(customers[temp].Id == customerId) {
            isExist = true;
            break;
        }

        temp +=1;
   }

   return isExist;

}

exports.updateOldOrders = async (req,res)=>{

    let orders = req.body;

    let orderCommand = '';
    let customerCommand = '';

    let customers = await Customer.findAll();

    orders.forEach(order =>{

        if(checkIfExist(customers,order.CustomerId)){

            orderCommand += 'UPDATE `orders` SET `CustomerId` = \''+order.CustomerId+'\' WHERE `Id` = \''+order.Id+'\';';
            customerCommand += 'UPDATE `customers` SET `AccumulatedAmount` = `customers`.`AccumulatedAmount` + '+ order.TotalAmount+ ', `AvailableScore` = `customers`.`AvailableScore` + ' +order.GainedScore +' WHERE `Id` = \''+order.CustomerId+'\';';
        }

    });


    sequelize.query(orderCommand).then(data => {

        sequelize.query(customerCommand).then(data => {

            res.send({ updating: data });

        }).catch(err => {
            console.log(err);
            res.status(500).send({
                message:
                    err.message || err
            });
        });

    }).catch(err => {
        console.log(err);
        res.status(500).send({
            message:
                err.message || err
        });
    });

}

exports.removeOrders = (req, res) => {

    let orderIds = ['21.67','21.66','21.65','21.64','21.63','21.61','21.62','21.59','21.58','21.57', '21.56', '21.55', '3763', '3759', '3727', '3718', '3712', '3705', '3695', '3689', '3685', '3684', '3683', '3676', '3494', '3672', '3286_', '3667', '3666', '3663', '3492', '3491', '3488', '00', '3654', '3652', '3646', '3641', '000', '3640', '3636', '3622', '3621', '0000', '3607', '3606', '3605', '3601', '3599', '3586', '3590', '3589', '3588', '3587', '3584', '3583', '3576', '3575', '3572', '3567', '3566', '3525', '3515', '3512', '3508', '3507', '3506', '3497', '3493', '3479', '3473'];

    OrderDetail.destroy({
        where: {
            OrderId: {
                [Op.notIn]: orderIds
            }
        }
    }).then(deleteOrderDetails => {

        Order.destroy({
            where: {
                Id: {
                    [Op.notIn]: orderIds
                }
            }
        }).then(deleteOrders => {

            Customer.destroy({
                where:{
                    Id:{
                        [Op.ne] : null
                    }
                }
            })
                .then(va => {
                    res.send({ updated: va });
                }).catch(err =>{
                    console.log(err);
                    res.status(500).send({
                        message:
                            err.message || err
                    });
                });
        }).catch(err =>{
            console.log(err);
            res.status(500).send({
                message:
                    err.message || err
            });
        });
    });
}

exports.getByStates = (req, res) => {

    let states = req.body.states;

    Order.findAll({
        include: [
            {
                model: OrderDetail,
                where: {
                    State: {
                        [Op.in]: states
                    }
                }
            },
            { model: Customer },
            { model: Purchase }

        ],
        order: [
            ['CreatedDate', 'DESC'],
        ]
    }).then(orders => {
        res.send({
            orders: orders
        });
    }).catch(err => {
        console.log(err);
        res.status(500).send({
            message:
                err.message || err
        });
    });

}

exports.getDebts = (req, res) => {

    const page = req.body.page;
    const size = req.body.size;
    const startTime = req.body.startTime ? req.body.startTime : 0;
    const endTime = req.body.endTime ? req.body.endTime : Number.MAX_VALUE;

    var condition = {
        TotalPaidAmount: { [Op.lt]: sequelize.col('TotalAmount') },
        DoneTime: {
            [Op.between]: [startTime, endTime]
        }
    };

    const { limit, offset } = commonService.getPagination(page, size);

    let countClause = {
        where: condition
    }

    Order.count(countClause)
        .then(data => {

            const count = data;

            Order.findAndCountAll({
                where: countClause.where,
                include: [
                    { model: OrderDetail },
                    { model: Customer }
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
            console.log(err);
            res.status(500).send({
                message:
                    err.message || err
            });
        });
}

exports.searchOrders = (req, res) => {

    let term = req.body.term;
    let page = req.body.page;
    let size = req.body.size;
    let statuses = req.body.statuses;

    if (!page || page < 0)
        page = 0;

    if (!size || size < 0)
        size = 20;

    var orderDetailCond = {
        State: {
            [Op.in]: statuses
        }
    }

    var cusCondition = term ? {
        [Op.or]: [
            {
                FullName: {
                    [Op.like]: `%${term}%`
                }
            },
            {
                PhoneNumber: {
                    [Op.like]: `%${term}%`
                }
            }
        ]

    } : {};

    const { limit, offset } = commonService.getPagination(page, size);

    Order.count({
        include: [
            {
                model: OrderDetail,
                where: orderDetailCond
            },
            {
                model: Customer,
                where: cusCondition
            }
        ]
    }).then(count => {

        Order.findAndCountAll({
            subQuery: false,
            order: [['CreatedDate', 'DESC']],
            include: [
                { model: Purchase },
                {
                    model: OrderDetail,
                    where: orderDetailCond
                },
                {
                    model: Customer,
                    where: cusCondition
                }
            ],
            limit: limit,
            offset: offset

        }).then(newData => {

            newData.count = count;

            const newResponse = commonService.getPagingData(newData, page, limit);

            res.send(newResponse);

        }).catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving orders"
            });
        });
    });
}

exports.updateOrderFields = (req, res) => {

    let obj = req.body.obj;

    Order.update(obj, {
        where: {
            Id: req.body.orderId
        }
    }).then(val => {
        res.send({ result: val });
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });

}
