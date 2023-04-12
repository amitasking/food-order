const Order = require("../models/order");

 module.exports.saveOrder = (req, res, next) => {
   console.log(req.body);
   order = new Order(req.body.name,new Date(), req.body.empId);
   order.save();
   res.send(order);
}

module.exports.getAllOrders = (req, res, next) => {
    res.send(Order.fetchAllOrder())
 }
 