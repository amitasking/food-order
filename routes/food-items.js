var express = require('express');
var router = express.Router();
const fooditemController = require('../controllers/food-item');
router.get('',fooditemController.getfoodItems);
router.post('',fooditemController.addFoodItem);

module.exports = router;
