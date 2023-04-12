var express = require('express');
var router = express.Router();
const productController = require('../controllers/admin');

router.get('/', productController.admin);

module.exports = router;
