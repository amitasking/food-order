var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');
var cors = require('cors')
var adminRouter = require('./routes/admin');
var orderRouter = require('./routes/order');
var foodItemRouter = require('./routes/food-items');
var axios = require('axios')
var organizationRouter = require('./routes/organization');

const seq = require('./util/database');
const Order = require('./models/order');
const FoodItem = require('./models/fooditem');
const FoodType = require('./models/foodtype');
const Organization = require('./models/organization');

var app = express();

const COGNITO_URL = `https://cognito-idp.us-east-1.amazonaws.com/`;
app.get('/health',(req,res,next)=>{
  res.send("ok");
})
app.use(cors())
app.use(async (req, res, next) => {
  try {
      const accessToken = req.headers.authorization.split(" ")[1];

      const { data } = await axios.post(
          COGNITO_URL,
          {
              AccessToken: accessToken
          },
          {
              headers: {
                  "Content-Type": "application/x-amz-json-1.1",
                  "X-Amz-Target": "AWSCognitoIdentityProviderService.GetUser"
              }
          }
      )

      req.user = data.UserAttributes[2].Value
      next();
  } catch (error) {
       console.log(error);
      return res.status(401).json({
          message: 'Auth failed'
      });
  }
})

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

seq.sync({force : true}).then(res => {

  console.log(res);
  app.listen(4000)
})
.catch(err => {
   console.log(err);
})
