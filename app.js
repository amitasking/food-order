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
app.use(cors())
const vapidKeys = {
  "publicKey": "BJNhvkYyr_VbQLcTijnWZfQx7Vugk-0fUfHTZfBL00WzhlSuvs-4ow729tQeQp08MdX5u-FCSk7rxxPu7g2oaeI",
  "privateKey": "R8MGK56Wvr7lIJqkP3kDpPr5keSOKDOd10zU0_IPCXk"
};

app.post('/api/notifications', (req, res) => {
  console.log(req.body);
 // return res.send(req.body)
  const subscription = {
    endpoint: 'https://fcm.googleapis.com/fcm/send/fwb_w2ELz2M:APA91bGHlYXKMI2rJwxc_G94vMbh3Tyg0LVg_Vwd_OBbixaCtcpXuaMLa9qJnhuetptmHxyP51xrWv7E6JYLpdqycoVejM9sION8t2RNrwaiT6wrq9t3lYabhKF0wic4LJAloLU6fwT_',
    expirationTime: null,
    keys: {
      auth: 'ETF8x_rzfrKiemn7toT8zw',
      p256dh: 'BFgXCahPeaEro0vAwuJlpVoj08OZvBOtjouFACHu3iPK5muexUEOahQt9moVZh4cSh6oij8oajnLvuE_oVM3Kl4',
    },
  };

  const payload = {
    notification: {
      title: 'sdsd',
      data: {
        url :'dsdsdsdsd'
      },
    },
  };

  const options = {
    vapidDetails: {
      subject: 'mailto:amit423raja@example.com',
      publicKey: vapidKeys.publicKey,
      privateKey: vapidKeys.privateKey,
    },
    TTL: 60,
  };

  // send notification
  webpush.sendNotification(subscription, JSON.stringify(payload), options)
    .then((_) => {
      console.log('SENT!!!');
      console.log(_);
    })
    .catch((_) => {
      console.log(_);
    });

})
const COGNITO_URL = `https://cognito-idp.us-east-1.amazonaws.com/`;
app.get('/health', (req, res, next) => {
  res.send("ok");
})

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
Order.belongsTo(FoodItem, { constraints: true, onDelete: 'CASCADE' })
FoodItem.belongsTo(FoodType, { constraints: true, onDelete: 'CASCADE' })
FoodItem.belongsTo(Organization, { constraints: true, onDelete: 'CASCADE' })

seq.sync({ force: true }).then(res => {

  console.log(res);
  app.listen(4000)
})
  .catch(err => {
    console.log(err);
  })
