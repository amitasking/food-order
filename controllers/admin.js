const createSendEmailCommand = require('../services/ses');
const orderStatus = require("../services/orderStatus");
const Order = require('../models/order');
const FoodItem = require('../models/fooditem');

exports.admin = (req,res,next) => {
    createSendEmailCommand
}

module.exports.updateOrderStatus = (req, res, next) => {
    const status = req.body.status.toUpperCase();
    if(!(status === orderStatus.APPROVED || status === orderStatus.CANCELLED || status === orderStatus.REJECTED))
        res.status(400).send("Invalid status");

    Order.findOne({
        where: {
            id: req.body.id
        }
    }).then((result) => {
      
        result.status = status;
        result.save();
        return res.send(result);
    });
};

// handle duplicates
module.exports.findOrderByOtp = (req, res, next) => {
    Order.findOne({
        where: {
            otp: req.query.otp
        },
        include: FoodItem
    }).then((result) => {
        return res.send(result);
    });
};

module.exports.findOrdersByUsername = (req, res, next) => {
    Order.findAll({
        where: {
            empId: req.query.empId,
        },
        include: FoodItem
    }).then((result) => {
      return res.send(result);
    });
};