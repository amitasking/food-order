var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');
var cors = require('cors')
var adminRouter = require('./routes/admin');
var orderRouter = require('./routes/order');
var foodItemRouter = require('./routes/food-items');
var organizationRouter = require('./routes/organization');

const seq = require('./util/database');
const Order = require('./models/order');
const FoodItem = require('./models/fooditem');
const FoodType = require('./models/foodtype');
const Organization = require('./models/organization');

var app = express();

app.use(cors())

seq.sync().then(result => {
  console.log(result);
}).catch(err => {
  console.log(err);
})

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/order', orderRouter);
app.use('/admin', adminRouter);
app.use('/fooditem', foodItemRouter);
app.use('/organization', organizationRouter);

// association
Order.belongsTo(FoodItem, {constraints : true, onDelete : 'CASCADE'})
FoodItem.belongsTo(FoodType, {constraints : true, onDelete : 'CASCADE'})
FoodItem.belongsTo(Organization, {constraints : true, onDelete : 'CASCADE'})

seq.sync({force : false}).then(res => {

  console.log(res);
  app.listen(3000)
})
.catch(err => {
   console.log(err);
})
