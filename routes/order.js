var express = require('express');
var router = express.Router();
const orderController = require('../controllers/order')

router.post('/', orderController.saveOrder);
router.get('',orderController.fetchOrdersForUser)
router.get('/qr',orderController.qrcode)
router.get('/getqr',orderController.getQr)
router.get('/book',orderController.book)
module.exports = router;
