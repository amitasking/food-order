var express = require('express');
var router = express.Router();
const orderController = require('../controllers/order')

router.post('/', orderController.saveOrder);
router.get('/allorders',orderController.getAllOrders)

module.exports = router;
