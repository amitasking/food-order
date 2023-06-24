var express = require('express');
var router = express.Router();
const productController = require('../controllers/admin');
const orderController = require('../controllers/order');

router.get('/', productController.admin);
router.get('/allOrders', orderController.getAllOrders);

module.exports = router;
