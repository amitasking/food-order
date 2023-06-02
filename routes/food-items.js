var express = require('express');
var router = express.Router();
const fooditemController = require('../controllers/food-item');
router.get('/fooditem',fooditemController.getfoodItems);
router.post('/fooditem',fooditemController.addFoodItem);

module.exports = router;
