const createSendEmailCommand = require('../services/ses');
const orderStatus = require("../services/orderStatus");
const Order = require('../models/order');
const FoodItem = require('../models/fooditem');
const {Sequelize} = require('sequelize');
const { fn, col, Op } = Sequelize;

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

module.exports.findOrderByOtp = (req, res, next) => {
    Order.findAll({
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
            empId: {
                [Op.like]:  `%${req.query.empId}%`
            }
        },
        include: FoodItem
    }).then((result) => {
      return res.send(result);
    });
};

module.exports.Orders = (req, res, next) => {
    if(req.query.type && req.query.org){
        Order.findAll({
            where: {
                type: req.query.type,
                OrganizationDomain: req.query.org
            }
        })
    }
    else if(req.query.type){

    }
    else if(req.query.org){

    }
    else{
        Order.findAll({
            attributes: ['FoodItemId', 
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'orderCount'], 
            ],
            group: 'FoodItemId'
        }).then((result) => {
            return res.send(result);
        });
    }
};

// like vala
//not found for otp and username
// group by
