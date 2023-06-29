var express = require('express');
var router = express.Router();
const productController = require('../controllers/admin');
const orderController = require('../controllers/order');
const ses = require('../util/ses');

router.get('/', productController.admin);
router.get('/allorders', orderController.getAllOrders);
router.get('/testmail',ses.sendRawMail);
module.exports = router;
