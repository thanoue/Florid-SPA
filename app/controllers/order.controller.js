const db = require("../models");
const commonService = require("../services/common.service");
const Order = db.order;
const OrderDetail = db.orderDetail;
const Op = db.Sequelize.Op;

exports.getByCustomerId