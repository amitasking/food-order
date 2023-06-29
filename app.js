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
const Notification = require('./models/notification')
// const subscription = {
//   endpoint:
//       'https://fcm.googleapis.com/fcm/send/eK13dggFkt4:APA91bEJFtI52ei4cRyJN2WpVo4g_JssRhR5Ye-K-EvME3nzsGgKdZ83bWCratCZWimgrEbLqUQ4rSQcrOkztArLW9Vx7A6azNFla_tX3LGA0djMNoM1iSlWyXHW65rs1HdpX-UK6dof',
//   expirationTime: null,
//   keys: {
//       p256dh: '<CLIENT_P256DH>',
//       auth: '<CLIENT_AUTH>',
//   },
// };

var app = express();
const webpush = require('web-push');
const notification = require('./models/notification');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.options('/', cors())
app.options('/notification', cors())
app.options('/notification/send', cors())
app.use(cors())
const vapidKeys = {
  "publicKey": "BEsCP3dcYVdKyd8W3NpkbFETW6zi66ZpgO8RBJHOhR2LiFtePJyFBpauZ_3bLa1g7R4gG95UZ9U_-uBw8o7zKHY",
  "privateKey": "RIHekHJtB0RGCuYamBIdlNS6EXGxCUYX1g-SgiIvCjg"
};

const options = {
  vapidDetails: {
    subject: 'mailto:amit423raja@gmail.com',
    publicKey: vapidKeys.publicKey,
    privateKey: vapidKeys.privateKey,
  },
  TTL: 60,
};

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


app.post('/notification/send', (req, response, next) => {

  const payload = {
    notification: {
      title: `hello ${req.user}! ${req.body.notification}`,
      // data: {
      //   url: 'dsdsdsdsd'
      // },
    },
  };

  notification.findAll().then(res => {
    res.forEach(el => {
      console.log(el);
      const subscription = {
        endpoint: el.endpoint,
        expirationTime: null,
        keys: {
          p256dh: el.p256dh,
          auth: el.auth,
        },
      };
      webpush.sendNotification(subscription, JSON.stringify(payload), options)
        .then((_) => {
          console.log('SENT!!! to ' + JSON.stringify(subscription));
          console.log(_);
        })
        .catch((_) => {
          console.log(_);
        });
    })
    response.send(200)
  }).catch(err => {
    response.send(err)
  });

})
const COGNITO_URL = `https://cognito-idp.us-east-1.amazonaws.com/`;
app.get('/health', (req, res, next) => {
  res.send("ok");
})


seq.sync().then(result => {
  // console.log(result);
}).catch(err => {
  console.log(err);
})

app.post('/notification/register', (req, res, next) => {
  // console.log(req.body.key);
  notification.create({
    endpoint: req.body.endpoint,
    auth: req.body.keys.auth,
    p256dh: req.body.keys.p256dh
  }).then(result => {
    res.send(result);
  }).catch(err => {
    res.send(err)
  })


})

app.use('/order', orderRouter);
app.use('/admin', adminRouter);
app.use('/fooditem', foodItemRouter);
app.use('/organization', organizationRouter);

// association
Order.belongsTo(FoodItem, { constraints: true, onDelete: 'CASCADE' })
FoodItem.belongsTo(FoodType, { constraints: true, onDelete: 'CASCADE' })
FoodItem.belongsTo(Organization, { constraints: true, onDelete: 'CASCADE' })

seq.sync({ force: false }).then(res => {

  console.log(res);
  app.listen(4000)
})
  .catch(err => {
    console.log(err);
  })
