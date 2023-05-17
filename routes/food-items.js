var express = require('express');
var router = express.Router();
const fooditemController = require('../controllers/food-item');
router.get('/fooditems',fooditemController.getfoodItems);
router.post('/addfooditem',fooditemController.addFoodItem);
module.exports = router;
